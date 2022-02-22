import glob
import time
from os import path
from flask import Blueprint, jsonify, current_app, request, Response, json
from flask_login import login_required

from ..utils.power_actions import CommandStatus, actions as server_power_actions, is_zomboid_screen_session_up
from ..utils.resources_functions import is_server_on, server_resources, online_players
from .. import pz_server_state

server_blueprint = Blueprint('server', __name__)


@server_blueprint.route('/server/status')
@login_required
def status():
    rcon_host = current_app.config['RCON_HOST']
    rcon_password = current_app.config['RCON_PASSWORD']
    is_rcon_server_on = None

    if is_zomboid_screen_session_up():
        is_rcon_server_on = is_server_on(rcon_host)

        if is_rcon_server_on:
            pz_server_state.on()

        if pz_server_state.is_off():
            pz_server_state.boot()
    else:
        pz_server_state.off()

    players = 0
    if is_rcon_server_on:
        players = online_players(rcon_host, rcon_password)

    return jsonify(
        server_state=pz_server_state.state,
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
        return jsonify(server_state=pz_server_state.state)
    else:
        return '', 500


def read_config(pz_server_config: str):
    with open(pz_server_config) as f:
        config = dict(x.rstrip().split("=", 1) for x in f)

    return config


@server_blueprint.route('/server/options')
@login_required
def list_workshop_items():
    config = read_config(current_app.config['PZ_SERVER_CONFIG'])

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )


@server_blueprint.route('/server/options', methods=['POST'])
@login_required
def save_items():
    request_data = request.get_json()

    config = read_config(current_app.config['PZ_SERVER_CONFIG'])

    if "WorkshopItems" in request_data:
        workshop_items = request_data.get("WorkshopItems", [])
        config['WorkshopItems'] = ";".join(list(dict.fromkeys(workshop_items)))

    if "Mods" in request_data:
        mods = request_data.get("Mods", [])
        config['Mods'] = ";".join(list(dict.fromkeys(mods)))

    with open(current_app.config['PZ_SERVER_CONFIG'], 'w') as f:
        for key in config.keys():
            f.write("%s=%s\n" % (key, config[key]))

    return jsonify(
        WorkshopItems=list(filter(None, config["WorkshopItems"].split(";"))),
        Mods=list(filter(None, config["Mods"].split(";")))
    )

@server_blueprint.route('/server/options/export')
@login_required
def export_server_config():
    config = read_config(current_app.config['PZ_SERVER_CONFIG'])

    export_config = {
        "WorkshopItems": config["WorkshopItems"],
        "Mods": config["Mods"]
    }

    def generate(config):
        for key in config.keys():
            yield "%s=%s\n" % (key, config[key])

    return Response(
        generate(export_config),
        mimetype='text/event-stream',
        headers={"Content-Disposition": "attachment;filename=server_config.ini"}
    )

@server_blueprint.route('/server/log')
@login_required
def listen_log():
    def followLog(serverLogsDir):
        logFilePattern = "*_DebugLog-server.txt"
        logFiles = glob.glob(path.join(serverLogsDir, logFilePattern))
        if not logFiles:
            yield 'data: {}\n\n'.format(
                json.dumps({"error": True, "errorMessage": "No log file found"})
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
                        json.dumps({"log": line.strip()})
                    )
            finally:
                pass

    serverLogsDir = current_app.config['PZ_SERVER_LOGS_DIR']
    return Response(followLog(serverLogsDir), mimetype='text/event-stream')
