import subprocess
from enum import Enum, unique


@unique
class CommandStatus(Enum):
    SUCCESS = 1
    FAIL = 2


actions = {}


def power_action(task_fn):
    actions[task_fn.__name__] = task_fn


def execute_command(pzuser_home, command):
    source = f"source {pzuser_home}/.profile"
    process_output = subprocess.run(['/bin/bash', '-c', '%s && %s' % (source, command)], capture_output=True)

    return CommandStatus.SUCCESS if process_output.returncode == 0 else CommandStatus.FAIL


@power_action
def stop_server(pzuser_home):
    return execute_command(pzuser_home, 'stop-zomboid')


@power_action
def start_server(pzuser_home,):
    return execute_command(pzuser_home, 'start-zomboid')


@power_action
def restart_server(pzuser_home):
    return execute_command(pzuser_home, 'restart-zomboid')
