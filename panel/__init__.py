from flask import Flask


def create_app():
    return Flask(__name__)


app = create_app()


@app.route('/')
def index():
    return 'Flask is running!'


if __name__ == "__main__":
    app.run(host='0.0.0.0')
