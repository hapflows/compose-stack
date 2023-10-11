import sys
from fastapi_server.lib.async_io import get_event_loop

from fastapi_server.init.postgres import destroy as postgres_destroy


async def destroy():
    print("Destroy all services")
    await postgres_destroy()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise Exception("This command needs to be invoked with stage: `destroy.py dev`")
    env = sys.argv[1]

    loop = get_event_loop()
    loop.run_until_complete(destroy())
