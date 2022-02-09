from flask import Blueprint, jsonify, current_app, request
from flask_login import login_required
from configobj import ConfigObj

from ..utils.power_actions import CommandStatus, actions as server_power_actions
from ..utils.resources_functions import server_status, server_resources, online_players

server_blueprint = Blueprint('server', __name__)


@server_blueprint.route('/server/status')
@login_required
def status():
    rcon_host = current_app.config['RCON_HOST']
    rcon_password = current_app.config['RCON_PASSWORD']

    status = "online" if server_status(rcon_host, rcon_password) is True else "offline"
    players = online_players(rcon_host, rcon_password)

    return jsonify(
        server_status=status,
        online_players=players,
        server_resources=server_resources()
    )


@server_blueprint.route('/server/power-actions', methods=['POST'])
@login_required
def power_actions():
    request_data = request.get_json()
    power_action = None

    if request_data:
        if 'power_action' in request_data:
            power_action = request_data['power_action']

    if not power_action or f"{power_action}_server" not in server_power_actions:
        return jsonify(error="Unknown action"), 400

    pz_user_home = current_app.config["PZ_USER_HOME"]
    result = server_power_actions[f"{power_action}_server"](pz_user_home)
    if result is CommandStatus.SUCCESS:
        return '', 200
    else:
        return '', 500


@server_blueprint.route('/server/options')
@login_required
def list_workshop_items():
    server_config_path = current_app.config['PZ_SERVER_CONFIG']
    config = ConfigObj(server_config_path, write_empty_values=True, interpolation=False)

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )


@server_blueprint.route('/server/options', methods=['POST'])
@login_required
def save_items():
    request_data = request.get_json()

    server_config_path = current_app.config['PZ_SERVER_CONFIG']
    config = ConfigObj(server_config_path, write_empty_values=True, interpolation=False)

    if("WorkshopItems" in request_data):
        workshop_items = request_data.get("WorkshopItems", [])
        config['WorkshopItems'] = ";".join(workshop_items)

    if("Mods" in request_data):
        mods = request_data.get("Mods", [])
        config['Mods'] = ";".join(mods)

    config.write()

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )
