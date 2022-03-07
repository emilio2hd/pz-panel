from os import environ, path

class Config(object):
    SECRET_KEY = environ.get("SECRET_KEY")

    ADMIN_KEY = environ.get("ADMIN_KEY")

    RCON_HOST = environ.get("RCON_HOST")
    RCON_PASSWORD = environ.get("RCON_PASSWORD")

    PZ_USER_HOME = environ.get("PZ_USER_HOME")
    PZ_SERVER_CONFIG = environ.get("PZ_SERVER_CONFIG")
    PZ_SERVER_LOGS_DIR = environ.get("PZ_SERVER_LOGS_DIR")


class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    ASSETS_DEBUG = False
    ASSETS_AUTO_BUILD = True


class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    ASSETS_DEBUG = False
    ASSETS_AUTO_BUILD = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
}
