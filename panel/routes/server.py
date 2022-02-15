import glob
import time
from os import path
from flask import Blueprint, jsonify, current_app, request, Response, json
from flask_login import login_required

from ..utils.power_actions import CommandStatus, actions as server_power_actions, is_zomboid_screen_session_up
from ..utils.resources_functions import server_status, server_resources, online_players

server_blueprint = Blueprint('server', __name__)


@server_blueprint.route('/server/status')
@login_required
def status():
    rcon_host = current_app.config['RCON_HOST']
    rcon_password = current_app.config['RCON_PASSWORD']

    is_server_on = server_status(rcon_host, rcon_password)
    if is_zomboid_screen_session_up() and is_server_on:
        status = "online"
    elif not is_server_on:
        status = "starting"
    else:
        status = "offline"

    players = 0
    if is_server_on:
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
    with open(server_config_path) as f:
        config = dict(x.rstrip().split("=", 1) for x in f)

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )


@server_blueprint.route('/server/options', methods=['POST'])
@login_required
def save_items():
    request_data = request.get_json()

    server_config_path = current_app.config['PZ_SERVER_CONFIG']
    with open(server_config_path) as f:
        config = dict(x.rstrip().split("=", 1) for x in f)

    if("WorkshopItems" in request_data):
        workshop_items = request_data.get("WorkshopItems", [])
        config['WorkshopItems'] = ";".join(list(dict.fromkeys(workshop_items)))

    if("Mods" in request_data):
        mods = request_data.get("Mods", [])
        config['Mods'] = ";".join(list(dict.fromkeys(mods)))

    with open(server_config_path, 'w') as f:
        for key in config.keys():
            f.write("%s=%s\n" %(key, config[key]))

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )


@server_blueprint.route('/server/log')
@login_required
def listen_log():
    def followLog(serverLogsDir):
        logFilePattern = "*_DebugLog-server.txt"
        logFiles = glob.glob(path.join(serverLogsDir, logFilePattern))
        if not logFiles:
            yield 'data: {}\n\n'.format(
                json.dumps({ "error": True, "errorMessage": "No log file found" })
            )
            return

        logFiles.sort(reverse=True)

        with open(logFiles[0]) as serverLogFile:
            try:
                while True:
                    line = serverLogFile.readline()
                    if not line:
                        continue

                    time.sleep(0.01)
                    yield 'data: {}\n\n'.format(
                        json.dumps({ "log": line.strip() })
                    )
            finally:
                pass

    serverLogsDir = current_app.config['PZ_SERVER_LOGS_DIR']
    return Response(followLog(serverLogsDir), mimetype='text/event-stream')
