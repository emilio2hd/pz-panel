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
    with open(pz_server_config) as f:
        config = dict(x.rstrip().split("=", 1) for x in f)

    return config


def save_config(pz_server_config: str, request_data: dict):
    config = read_config(pz_server_config)

    for config_key in ALLOWED_CONFIG_OPTIONS:
        if config_key in request_data:
            workshop_items = request_data.get(config_key, [])
            config[config_key] = prepared_config_to_save(workshop_items)

    with open(pz_server_config, 'w') as f:
        for line in formatted_config_lines(config):
            f.write(line)

    return config
