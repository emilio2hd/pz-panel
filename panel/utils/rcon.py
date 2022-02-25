import re
import socket
from rcon import Client


def is_server_on(rcon_host):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        is_on = s.connect_ex((rcon_host, 27015)) == 0

    return is_on


def online_players(rcon_host, rcon_password):
    players = 0

    try:
        with Client(rcon_host, 27015, timeout=5, passwd=rcon_password) as client:
            response = client.run('players')

            result = re.search(r"Players connected \((.*)\)", response)
            if result:
                return result.group(1)
    except:
        pass

    return players
