from flask import Blueprint, render_template
from flask_login import login_required

main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/')
@login_required
def index():
    return render_template("main/index.html")
