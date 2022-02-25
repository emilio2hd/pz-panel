import shlex
from subprocess import run


def is_zomboid_screen_session_up() -> bool:
    command_line = f"/usr/bin/screen -S zomboid -Q info > /dev/null"
    args = shlex.split(command_line)
    command_result = run(args, capture_output=True)

    return True if command_result.returncode == 0 else False
