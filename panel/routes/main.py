from flask import Blueprint, render_template

main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/')
def index():
    return render_template("main/index.html")
