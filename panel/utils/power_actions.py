from enum import Enum, unique
from subprocess import Popen, PIPE


@unique
class CommandStatus(Enum):
    SUCCESS = 1
    FAIL = 2


actions = {}


def power_action(task_fn):
    actions[task_fn.__name__] = task_fn


def execute_command(pzuser_home, command):
    cmd = f"{pzuser_home}/pz-server/bin/{command}"
    p = Popen(cmd, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    print(stdout)
    print(stderr)

    return CommandStatus.SUCCESS if p.returncode == 0 else CommandStatus.FAIL


@power_action
def stop_server(pzuser_home):
    return execute_command(pzuser_home, 'stop-zomboid')


@power_action
def start_server(pzuser_home,):
    return execute_command(pzuser_home, 'start-zomboid')


@power_action
def restart_server(pzuser_home):
    return execute_command(pzuser_home, 'restart-zomboid')
