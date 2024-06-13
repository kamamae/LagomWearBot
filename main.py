import asyncio
import logging
import sys
import os
import json
import smtplib
from email.mime.text import MIMEText
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

from config import TOKEN, PAYMENTS_TOKEN, PASSWORD_EMAIL

from aiogram import Bot, Dispatcher, types, executor
from aiogram.types import Message, InputFile, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.markdown import hbold
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, ContentType, LabeledPrice
from aiogram.dispatcher.filters import ContentTypeFilter

bot = Bot(TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def command_start_handler(message: types.Message):
    try:
        with open("assets/LagomWear.jpg", "rb") as photo_file:
            await message.answer_photo(photo=InputFile(photo_file), caption="Приветствуем, в нашем магазине Lagom wear!\n"
                        "Чтобы посмотреть каталог товаров нашего магазина пропишите команду - /shop\n")
        await start(message)
    except Exception as e:
        print(f"Ошибка в команде /start: {e}")

async def start(message: types.Message):
    try:
        markup = ReplyKeyboardMarkup(row_width=2, resize_keyboard=True)
        btn1 = KeyboardButton(text="Заказать", web_app=WebAppInfo(url="https://main--lagomwearbot.netlify.app/"))
        btn2 = KeyboardButton('Поддержка')
        markup.add(btn1, btn2)
        await message.answer(text="Приятных покупок!", reply_markup=markup)
    except Exception as e:
        print(f"Ошибка в функции start: {e}")

@dp.message_handler(content_types=['web_app_data'])
async def buy(message: types.Message):
    try:
        if message.web_app_data:
            global web_app_data
            web_app_data = json.loads(message.web_app_data.data)
            price = web_app_data.get('price')
            print(f"Received price: {price}")
            print('WEB',web_app_data)
            prices = [LabeledPrice(label="Цена", amount=int(price * 100))]
            await bot.send_invoice(message.chat.id,
                                   title="Оплата заказа",
                                   description="Для оплаты заказа перейдите по ссылке",
                                   provider_token=PAYMENTS_TOKEN,
                                   currency="rub",
                                   photo_url="https://habrastorage.org/getpro/moikrug/uploads/company/100/006/341/2/logo/big_32156f1572916e1f7fb432e67e1defc2.png",
                                   photo_width=416,
                                   photo_height=234,
                                   photo_size=416,
                                   is_flexible=False,
                                   prices=prices,
                                   start_parameter="one-month-subscription",
                                   payload="test-invoice-payload",
                                   need_phone_number=True,
                                   need_shipping_address=True)
        else:
            await bot.send_message(chat_id=message.chat.id, text="No web app data received.")
    except Exception as e:
        print(f"Ошибка в обработке web_app_data: {e}")

@dp.pre_checkout_query_handler(lambda query: True)
async def pre_checkout_query(pre_checkout_q: types.PreCheckoutQuery):
    try:
        await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)
    except Exception as e:
        print(f"Ошибка в pre_checkout_query: {e}")

@dp.message_handler(content_types=ContentType.SUCCESSFUL_PAYMENT)
async def successful_payment(message: types.Message):
    try:
        print("SUCCESSFUL PAYMENT:")
        payment_info = message.successful_payment.to_python()
        for k, v in payment_info.items():
            print(f"{k} = {v}")

        # Отправляем сообщение с фото и кнопкой
        await send_successful_payment_message(message.chat.id, message.successful_payment.total_amount, message.successful_payment.currency)
        # Отправляем email после успешной оплаты
        email_message = f"Платёж на сумму {message.successful_payment.total_amount // 100} {message.successful_payment.currency} прошел успешно\n\n"
        for item in web_app_data['cartItems']:
            email_message += f"  id: {item['id']}\n"
            email_message += f"  Товар: {item['product']['name']}\n"
            email_message += f"  Размер: {item['product_size']['size_name']}\n"
            email_message += f"  Количество: {item['quantity']}\n"
            email_message += f"  Цена: {item['product']['price']} ₽ за единицу\n\n"
        email_message += f"""
        Адрес доставки:
        Телефон: {message.successful_payment.order_info['phone_number']}
        Страна: {message.successful_payment.order_info['shipping_address']['country_code']}
        Штат: {message.successful_payment.order_info['shipping_address']['state']}
        Город: {message.successful_payment.order_info['shipping_address']['city']}
        Улица 1: {message.successful_payment.order_info['shipping_address']['street_line1']}
        Улица 2: {message.successful_payment.order_info['shipping_address']['street_line2']}
        Почтовый индекс: {message.successful_payment.order_info['shipping_address']['post_code']}
        """
        send_email(email_message)
    except Exception as e:
        print(f"Ошибка в successful_payment: {e}")

async def send_successful_payment_message(chat_id, total_amount, currency):
    try:
        # Создаем кнопку для получения чека
        inline_btn_1 = InlineKeyboardButton('Получить чек', callback_data='get_receipt')
        inline_kb1 = InlineKeyboardMarkup().add(inline_btn_1)

        # Отправляем изображение с инлайн-кнопкой
        image_url = "https://img.freepik.com/premium-vector/success-payment-in-hand-illustration-in-flat-style-approved-money-vector-illustration-on-isolated-background-successful-pay-sign-business-concept_157943-6857.jpg"
        await bot.send_photo(chat_id=chat_id, photo=image_url, caption="Тестовая оплата успешно пройдена!", reply_markup=inline_kb1)
    except Exception as e:
        print(f"Ошибка в send_successful_payment_message: {e}")

@dp.callback_query_handler(lambda c: c.data == 'get_receipt')
async def on_click(callback_query: types.CallbackQuery):
    try:
        chat_id = callback_query.message.chat.id

        receipt_text = "Тестовая оплата прошла успешно\n"

        for item in web_app_data['cartItems']:
            receipt_text += f"  id: {item['id']}\n"
            receipt_text += f"  Товар: {item['product']['name']}\n"
            receipt_text += f"  Размер: {item['product_size']['size_name']}\n"
            receipt_text += f"  Количество: {item['quantity']}\n"
            receipt_text += f"  Цена: {item['product']['price']} ₽ за единицу\n"

        pdfmetrics.registerFont(TTFont('DejaVuSans', 'DejaVuSans.ttf'))

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='RussianStyle', fontName='DejaVuSans'))

        doc = SimpleDocTemplate("check.pdf", pagesize=letter)
        elements = []
        elements.append(Paragraph(receipt_text, styles["RussianStyle"]))
        doc.build(elements)

        with open("check.pdf", "rb") as f:
            await bot.send_document(chat_id=chat_id, document=f)

        os.remove("check.pdf")
    except Exception as e:
        print(f"Ошибка в on_click: {e}")

def send_email(message):
    sender = "lagomwearwork@gmail.com"

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        try:
            server.login(sender, PASSWORD_EMAIL)
            msg = MIMEText(message)
            msg["Subject"] = "Successful Payment"
            server.sendmail(sender, sender, msg.as_string())

            return "The message was sent successfully!"
        except Exception as e:
            print(f"Ошибка при отправке email: {e}")
        finally:
            server.quit()
    except Exception as e:
        print(f"Ошибка при подключении к SMTP серверу: {e}")

@dp.message_handler(lambda message: message.text == 'Поддержка')
async def support(message: types.Message):
    try:
        support_text = ("Возникли затруднения?\n"
                        "Мы всегда рады ответить на Ваши вопросы!\n"
                        "Вы можете написать нам [сюда](https://t.me/shnurok_ver)")
        await message.answer(support_text, parse_mode="Markdown")
    except Exception as e:
        print(f"Ошибка в обработке сообщения 'Поддержка': {e}")

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
