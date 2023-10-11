from datetime import datetime
import arrow

DATE_FORMAT = "YYYY-MM-DD"
DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss"
DATETIME_TZ_FORMAT = "YYYY-MM-DDTHH:mm:ssZZ"


def now(format=DATETIME_TZ_FORMAT):
    date = arrow.utcnow()
    if format:
        date = date.format(DATETIME_TZ_FORMAT)
    return date


def tomorrow(format=DATETIME_TZ_FORMAT):
    date = arrow.now().shift(hours=24)
    if format:
        date = date.format(DATETIME_TZ_FORMAT)
    return date


def string_to_datetime(date_s: str, format=DATE_FORMAT, naive=True):
    date = arrow.get(date_s, format).to("utc")
    if naive:
        return date.naive
    return date


def string_to_datetime_utc(date_s: str, format=DATETIME_TZ_FORMAT, naive=True):
    date = arrow.get(date_s, format).to("utc")
    if naive:
        return date.naive
    return date


def datetimetz_to_datetime(datetz: datetime | None, naive=True):
    if not datetz:
        return None
    date = arrow.get(datetz).to("utc")
    if naive:
        return date.naive
    return date
