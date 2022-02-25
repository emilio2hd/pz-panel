import shlex
from subprocess import run

from ..utils.rcon import is_server_on, online_players
from .. import pz_server_state


def is_zomboid_screen_session_up() -> bool:
    command_line = f"/usr/bin/screen -S zomboid -Q info > /dev/null"
    args = shlex.split(command_line)
    command_result = run(args, capture_output=True)

    return True if command_result.returncode == 0 else False


def get_server_status(rcon_host: str, rcon_password: str):
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

    return pz_server_state.state, players
