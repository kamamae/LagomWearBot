from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")

DB_PASSWORD=os.environ.get("DB_PASSWORD")
DB_USER=os.environ.get("DB_USER")
DB_NAME=os.environ.get("DB_NAME")
TOKEN = os.environ.get("TOKEN")
PAYMENTS_TOKEN = os.environ.get("PAYMENTS_TOKEN")
PASSWORD_EMAIL = os.environ.get("PASSWORD_EMAIL")