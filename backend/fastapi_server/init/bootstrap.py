import sys

from fastapi_server.lib.async_io import get_event_loop
from fastapi_server.init.postgres import bootstrap as postgres_bootstrap


async def bootstrap():
    print("Bootstrap all services")
    await postgres_bootstrap()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception(
            "This command needs to be invoked with stage: `bootstrap.py dev`"
        )
    env = sys.argv[1]

    loop = get_event_loop()
    loop.run_until_complete(bootstrap())
