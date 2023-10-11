import logging
from functools import lru_cache
import warnings

warnings.filterwarnings(
    "ignore",
    message=".*(pkg_resources|crypt).*",
)


from pydantic_settings import BaseSettings

log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    env: str = "dev"
    app_url: str = ""
    testing: bool = 0
    postgres_url: str = ""
    postgres_user: str = ""
    postgres_database: str = ""
    postgres_host: str = ""


@lru_cache()
def get_settings() -> Settings:
    log.info("Loading config settings from the environment...")
    return Settings()


MEDIA_BASE_PATH = "/home/fastapi_server/fastapi_server/mediafiles"

ANONYMOUS_USER_ID = "__anonymous__"
