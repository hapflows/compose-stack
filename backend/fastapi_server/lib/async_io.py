import asyncio


def get_event_loop():
    """
    Force the pytest-asyncio loop to be the main one.
    If there is no running event loop, create one and
    set as the current one.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop
