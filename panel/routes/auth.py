from flask import Blueprint, render_template, redirect, url_for, request, flash, current_app
from flask_login import login_user, logout_user, login_required

from .. import login_manager


class User:
    def __init__(self, username):
        self.username = username
        self.is_authenticated = True
        self.is_active = True
        self.is_anonymous = False

    def get_id(self):
        return self.username


auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/login')
def login():
    return render_template('auth/login.html')


@auth_blueprint.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')

    if username == 'admin' and password == current_app.config['ADMIN_KEY']:
        login_user(User(username))
    else:
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))

    return redirect(url_for('main.index'))


@auth_blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        return User(user_id)
    return None
