from ..utils.power_actions import CommandStatus, actions as server_power_actions


def is_valid_power_action(power_action) -> bool:
    return power_action and f"{power_action}_server" in server_power_actions


def execute_action(power_action, pz_user_home) -> bool:
    result = server_power_actions[f"{power_action}_server"](pz_user_home)
    return result is CommandStatus.SUCCESS

