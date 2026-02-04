import os


class Config:
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "19ecd085a443a14f3dc781161234fc0db3a75a254558984e9a1febd413a1a4de"
    )
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    DEBUG = True
    TESTING = True


class ProductionConfig(Config):
    DEBUG = False


def get_config(env_name):
    if env_name == "production":
        if not os.environ.get("SECRET_KEY"):
            raise ValueError(
                "SECRET_KEY environment variable must be set in production"
            )
        return ProductionConfig

    if env_name == "testing":
        return TestingConfig

    return DevelopmentConfig
