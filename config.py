from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, ".env"))


class Config(object):
    FLASK_APP = environ.get("FLASK_APP")
    FLASK_ENV = environ.get("FLASK_ENV", 'development')
    SECRET_KEY = environ.get("SECRET_KEY")

    ADMIN_KEY = environ.get("ADMIN_KEY")

    RCON_HOST = environ.get("RCON_HOST")
    RCON_PASSWORD = environ.get("RCON_PASSWORD")
    PZ_USER_HOME = environ.get("PZ_USER_HOME")
    PZ_SERVER_CONFIG = environ.get("PZ_SERVER_CONFIG")
    PZ_SERVER_LOGS_DIR = environ.get("PZ_SERVER_LOGS_DIR")

