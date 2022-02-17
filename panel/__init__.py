from flask import Flask
from flask_login import LoginManager
from utils import PzServerStateMachine

login_manager = LoginManager()
pz_server_state = PzServerStateMachine()

def create_app(test_config=None):
    _app = Flask(__name__, instance_relative_config=False)

    if test_config is None:
        _app.config.from_object("config.Config")
    else:
        _app.config.from_mapping(test_config)

    login_manager.login_view = 'auth.login'
    login_manager.init_app(_app)

    _app.logger.info(f"Starting app in \"{_app.config['FLASK_ENV']}\" environment")

    with _app.app_context():
        from .routes import auth, main, server

        _app.register_blueprint(main.main_blueprint)
        _app.register_blueprint(auth.auth_blueprint)
        _app.register_blueprint(server.server_blueprint)

        return _app

