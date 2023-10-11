import traceback


def exception_to_string(exception):
    return traceback.format_exc(3)
