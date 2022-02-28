import re

ALLOWED_CONFIG_OPTIONS = ["WorkshopItems", "Mods"]
CONFIG_VALUE_SEPARATOR = ';'


def prepared_config_to_save(config_value: dict):
    return CONFIG_VALUE_SEPARATOR.join(list(dict.fromkeys(config_value)))


def prepared_config_to_view(config_value):
    return list(filter(None, config_value.split(CONFIG_VALUE_SEPARATOR)))


def formatted_config_lines(config: dict):
    for key in config.keys():
        yield "%s=%s\n" % (key, config[key])

def read_config(pz_server_config: str):
    config = dict()

    with open(pz_server_config, 'r') as reader:
        for line in reader.readlines():
            if line.startswith('#'):
                continue

            split_line = line.strip().split("=", 1)
            if len(split_line) > 1:
                config.update([split_line])

    return config


def save_config(pz_server_config: str, request_data: dict):
    config_content = ''
    with open(pz_server_config, 'r') as reader:
        config_content = reader.read()

    for config_key in ALLOWED_CONFIG_OPTIONS:
        if config_key in request_data:
            items = request_data.get(config_key, [])
            config_content = re.sub(rf"{config_key}=(.*)", "%s=%s" % (config_key, prepared_config_to_save(items)), config_content)

    with open(pz_server_config, 'w') as f:
        f.write(config_content)

    config = read_config(pz_server_config)
    return config
