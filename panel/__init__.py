from flask import Flask
from flask_login import LoginManager
from flask_assets import Environment

from config import config
from .utils import PzServerStateMachine
from .utils.assets import register_bundles

__version__ = '0.1.0'

login_manager = LoginManager()
pz_server_state = PzServerStateMachine()
assets = Environment()


def create_app(config_name):
    _app = Flask(__name__, instance_relative_config=False)
    _app.config.from_object(config[config_name])

    login_manager.login_view = 'auth.login'
    login_manager.init_app(_app)
    assets.init_app(_app)

    _app.logger.info(f"Starting app in \"{_app.config['FLASK_ENV']}\" environment")

    with _app.app_context():
        from .routes import auth, main, server

        _app.register_blueprint(main.main_blueprint)
        _app.register_blueprint(auth.auth_blueprint)
        _app.register_blueprint(server.server_blueprint)

        register_bundles(assets, _app.config['FLASK_ENV'])

        return _app

