
from os import environ, path

from panel import create_app

try:
    from dotenv import load_dotenv
    basedir = path.abspath(path.dirname(__file__))
    load_dotenv(path.join(basedir, ".env"))
except ImportError:
    pass


app = create_app(environ.get("FLASK_ENV", "development"))

if __name__ == "__main__":
    app.run(host="0.0.0.0")
