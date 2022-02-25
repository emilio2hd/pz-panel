import glob
import time
from os import path

from flask import Blueprint, jsonify, current_app, request, Response, json
from flask_login import login_required

from .. import pz_server_state
from ..services.power_actions_service import is_valid_power_action, execute_action
from ..services.server_options_service import read_config, save_config, prepared_config_to_view, formatted_config_lines
from ..services.server_status_service import get_server_status
from ..utils.resources_functions import server_resources

server_blueprint = Blueprint('server', __name__, url_prefix='/server')


@server_blueprint.route('/status')
@login_required
def status():
    rcon_host = current_app.config['RCON_HOST']
    rcon_password = current_app.config['RCON_PASSWORD']

    server_state, players = get_server_status(rcon_host, rcon_password)

    return jsonify(
        server_state=server_state,
        online_players=players,
        server_resources=server_resources()
    )


@server_blueprint.route('/power-actions', methods=['POST'])
@login_required
def power_actions():
    request_data = request.get_json()
    pz_user_home = current_app.config["PZ_USER_HOME"]
    power_action = request_data.get("power_action", None)

    if not is_valid_power_action(power_action):
        return jsonify(error="Unknown action"), 400

    if not execute_action(power_action, pz_user_home):
        return '', 500

    return jsonify(server_state=pz_server_state.state)


def get_config(pz_server_config):
    config = read_config(pz_server_config)

    return {
        "WorkshopItems": prepared_config_to_view(config["WorkshopItems"]),
        "Mods": prepared_config_to_view(config["Mods"])
    }


@server_blueprint.route('/options')
@login_required
def list_workshop_items():
    export_config = get_config(current_app.config['PZ_SERVER_CONFIG'])

    return jsonify(export_config)


@server_blueprint.route('/options/export')
@login_required
def export_server_config():
    export_config = get_config(current_app.config['PZ_SERVER_CONFIG'])

    return current_app.response_class(
        formatted_config_lines(export_config),
        mimetype='text/event-stream',
        headers={"Content-Disposition": "attachment;filename=server_config.ini"}
    )


@server_blueprint.route('/options', methods=['POST'])
@login_required
def save_items():
    request_data = request.get_json()

    config = save_config(current_app.config['PZ_SERVER_CONFIG'], request_data)

    export_config = {
        "WorkshopItems": prepared_config_to_view(config["WorkshopItems"]),
        "Mods": prepared_config_to_view(config["Mods"])
    }

    return jsonify(export_config)


@server_blueprint.route('/log')
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
