from enum import Enum, unique
from subprocess import Popen, PIPE

from .. import pz_server_state


@unique
class CommandStatus(Enum):
    SUCCESS = 1
    FAIL = 2


actions = {}


def power_action(task_fn):
    actions[task_fn.__name__] = task_fn


@power_action
def stop_server(pzuser_home):
    result = execute_command(pzuser_home, 'stop-zomboid')

    if result is CommandStatus.SUCCESS and not pz_server_state.is_off():
        pz_server_state.halt()

    return result


@power_action
def start_server(pzuser_home):
    result = execute_command(pzuser_home, 'start-zomboid')

    if result is CommandStatus.SUCCESS and pz_server_state.is_off():
        pz_server_state.boot()

    return result


@power_action
def restart_server(pzuser_home):
    return execute_command(pzuser_home, 'restart-zomboid')


def execute_command(pzuser_home, command):
    cmd = f"{pzuser_home}/pz-server/bin/{command}"
    p = Popen(cmd, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    print(stdout)
    print(stderr)

    return CommandStatus.SUCCESS if p.returncode == 0 else CommandStatus.FAIL
