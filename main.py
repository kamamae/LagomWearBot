import asyncio
import logging
import sys
from os import getenv
from config import TOKEN

from aiogram import Bot, Dispatcher, types, executor

from aiogram.types import Message, InputFile, WebAppInfo
from aiogram.utils.markdown import hbold

# Bot token can be obtained via https://t.me/BotFather

bot = Bot(TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def command_start_handler(message: types.Message):
    with open("assets/LagomWear.jpg", "rb") as photo_file:
        await message.answer_photo(photo=InputFile(photo_file), caption="Приветствуем, в нашем магазине Lagom wear!\n"        
                    "Чтобы посмотреть каталог товаров нашего магазина пропишите команду - /shop\n")
    await start(message)

async def start(message):
    markup = types.ReplyKeyboardMarkup(row_width=2, resize_keyboard=True)
    btn1 = types.KeyboardButton('Каталог', web_app=WebAppInfo(url='https://www.youtube.com/'))
    btn2 = types.KeyboardButton('Заказы')
    btn3 = types.KeyboardButton('Поддержка')
    markup.add(btn1, btn2)
    markup.add(btn3)
    await message.answer('Hello', reply_markup=markup)
    dp.register_message_handler(on_click)

async def on_click(message: types.Message):
    if message.text == 'Каталог':
        await message.answer('Открыть Каталог')

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)

