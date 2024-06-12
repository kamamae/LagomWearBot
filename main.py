import asyncio
import logging
import sys
from os import getenv
import json
import smtplib
from email.mime.text import MIMEText

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
    # with open("assets/LagomWear.jpg", "rb") as photo_file:
    #     await message.answer_photo(photo=InputFile(photo_file), caption="Приветствуем, в нашем магазине Lagom wear!\n"
    #                 "Чтобы посмотреть каталог товаров нашего магазина пропишите команду - /shop\n")
    await start(message)

async def start(message: types.Message):
    markup = ReplyKeyboardMarkup(row_width=2, resize_keyboard=True)
    btn1 = KeyboardButton(text="Заказать", web_app=WebAppInfo(url="https://main--lagomwearbot.netlify.app/"))
    btn2 = KeyboardButton('Поддержка')
    markup.add(btn1, btn2)
    await message.answer(text="Приятных покупок!", reply_markup=markup)
    dp.register_message_handler(on_click)

@dp.message_handler(content_types=['web_app_data'])
async def buy(message: types.Message):
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
                               # photo_url="https://habrastorage.org/getpro/moikrug/uploads/company/100/006/341/2/logo/big_32156f1572916e1f7fb432e67e1defc2.png",
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

@dp.pre_checkout_query_handler(lambda query: True)
async def pre_checkout_query(pre_checkout_q: types.PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)

@dp.message_handler(content_types=ContentType.SUCCESSFUL_PAYMENT)
async def successful_payment(message: types.Message):
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

async def send_successful_payment_message(chat_id, total_amount, currency):
    # Создаем кнопку для распечатки чека
    markup = InlineKeyboardMarkup()
    print_receipt_button = InlineKeyboardButton("Распечатать чек", callback_data="print_receipt")
    markup.add(print_receipt_button)

    # Формируем содержимое чека
    receipt_text = ''

    for item in web_app_data['cartItems']:
        receipt_text += f"  id: {item['id']}\n"
        receipt_text += f"  Товар: {item['product']['name']}\n"
        receipt_text += f"  Размер: {item['product_size']['size_name']}\n"
        receipt_text += f"  Количество: {item['quantity']}\n"
        receipt_text += f"  Цена: {item['product']['price']} ₽ за единицу\n"

    # Формируем текст сообщения
    message_text = f"Платёж на сумму {total_amount // 100} {currency} прошел успешно!"

    # Отправляем сообщение с чеком
    await bot.send_message(chat_id=chat_id, text=message_text)
    await bot.send_document(chat_id=chat_id, document=receipt_text.encode(), filename="receipt.txt", reply_markup=markup)
def send_email(message):
    sender = "lagomwearwork@gmail.com"

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    try:
        server.login(sender, PASSWORD_EMAIL)
        msg = MIMEText(message)
        msg["Subject"] = "Successful Payment"
        server.sendmail(sender, sender, msg.as_string())

        return "The message was sent successfully!"
    except Exception as _ex:
        return f"{_ex}\nCheck your login or password please!"

async def on_click(message: types.Message):
    if message.text == 'Поддержка':
        support_text = ("Возникли затруднения?:\n"
                        "Мы всегда рады ответить на Ваши вопросы!\n"
                        "Вы можете написать нам сюда:"
                       "[@shnurok_ver ]((https://t.me/shnurok_ver)")

        await message.answer(support_text, parse_mode="Markdown")

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)