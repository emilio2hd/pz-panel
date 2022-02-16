import re
from rcon import Client
from psutil import virtual_memory, cpu_percent, disk_usage


def bytes2human(n):
    # http://code.activestate.com/recipes/578019
    # >>> bytes2human(10000)
    # '9.8K'
    # >>> bytes2human(100001221)
    # '95.4M'
    symbols = ('K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y')
    prefix = {}
    for i, s in enumerate(symbols):
        prefix[s] = 1 << (i + 1) * 10
    for s in reversed(symbols):
        if n >= prefix[s]:
            value = float(n) / prefix[s]
            return "%.1f%s" % (value, s)
    return "%sB" % n


def server_status(rcon_host, rcon_password):
    try:
        with Client(rcon_host, 27015, timeout=5, passwd=rcon_password):
            is_server_on = True
    except:
        is_server_on = False

    return is_server_on


def server_resources():
    resources = dict()

    disk = disk_usage('/')

    resources['ram'] = virtual_memory().percent
    resources['cpu'] = cpu_percent()
    resources['disk'] = {
        "free": bytes2human(disk.free),
        "used": bytes2human(disk.used),
        "usagePercent": disk.percent
    }

    return resources


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