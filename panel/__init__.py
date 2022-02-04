from flask import Flask

from .routes.main import main_blueprint


def create_app(test_config=None):
    _app = Flask(__name__, instance_relative_config=False)

    if test_config is None:
        _app.config.from_object("config.Config")
    else:
        _app.config.from_mapping(test_config)

    _app.logger.info(f"Starting app in \"{_app.config['FLASK_ENV']}\" environment")

    with _app.app_context():
        _app.register_blueprint(main_blueprint)

        return _app

