import re
from rcon import Client
from psutil import virtual_memory, cpu_percent


def server_status(rcon_host, rcon_password):
    try:
        with Client(rcon_host, 27015, timeout=2, passwd=rcon_password):
            is_server_on = True
    except:
        is_server_on = False

    return is_server_on


def server_resources():
    resources = dict()

    resources['ram'] = virtual_memory().percent
    resources['cpu'] = cpu_percent()

    return resources


def online_players(rcon_host, rcon_password):
    players = 0

    try:
        with Client(rcon_host, 27015, timeout=2, passwd=rcon_password) as client:
            response = client.run('players')

            result = re.search(r"Players connected \((.*)\)", response)
            if result:
                return result.group(1)
    except:
        pass

    return players