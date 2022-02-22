import glob
import time
from os import path
from flask import Blueprint, jsonify, current_app, request, Response, json
from flask_login import login_required

from ..services.server_options_service import read_config, save_config, prepared_config_to_view, formatted_config_lines
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


def get_config(pz_server_config):
    config = read_config(pz_server_config)

    return {
        "WorkshopItems": prepared_config_to_view(config["WorkshopItems"]),
        "Mods": prepared_config_to_view(config["Mods"])
    }


@server_blueprint.route('/server/options')
@login_required
def list_workshop_items():
    export_config = get_config(current_app.config['PZ_SERVER_CONFIG'])

    return jsonify(export_config)


@server_blueprint.route('/server/options/export')
@login_required
def export_server_config():
    export_config = get_config(current_app.config['PZ_SERVER_CONFIG'])

    return Response(
        formatted_config_lines(export_config),
        mimetype='text/event-stream',
        headers={"Content-Disposition": "attachment;filename=server_config.ini"}
    )


@server_blueprint.route('/server/options', methods=['POST'])
@login_required
def save_items():
    request_data = request.get_json()

    config = save_config(current_app.config['PZ_SERVER_CONFIG'], request_data)

    export_config = {
        "WorkshopItems": prepared_config_to_view(config["WorkshopItems"]),
        "Mods": prepared_config_to_view(config["Mods"])
    }

    return jsonify(export_config)


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
