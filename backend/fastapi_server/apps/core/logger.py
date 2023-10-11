import os
import pprint

import httpx
import structlog

NEW_RELIC_URL = "https://log-api.eu.newrelic.com/log/v1"


# Custom processor
# Uses the New Relic Log API
# https://docs.newrelic.com/docs/logs/log-management/log-api/introduction-log-api/
def send_to_newrelic(logger, log_method, event_dict):
    API_KEY = os.getenv("NEW_RELIC_LICENSE_KEY")
    if not API_KEY:
        return
    headers = {"Api-Key": API_KEY}

    attributes = {
        "level": log_method,
        "entity.name": os.getenv("NEW_RELIC_ENTITY_NAME"),
    }

    attributes.update(event_dict)

    payload = {
        "message": event_dict["event"],
        "attributes": attributes,
    }

    try:
        httpx.post(
            NEW_RELIC_URL,
            json=payload,
            headers=headers,
        )
    except:
        pass
    return event_dict


def log_test_error(logger, log_method, event_dict):
    if log_method == "error":
        print("Error raised and logged")
        pprint.pprint(event_dict, indent=2)


def log_to_stdout(logger, log_method, event_dict):
    print("================= LOGGED  =================")
    if "exception" in event_dict:
        print(event_dict.get("exception"))
        del event_dict["exception"]
    pprint.pprint(event_dict, indent=2)
    print("================= END LOG =================")


NEW_RELIC = os.getenv("NEW_RELIC")
if NEW_RELIC == "1":
    # Configure Structlog's processor pipeline
    structlog.configure(
        processors=[send_to_newrelic, structlog.processors.JSONRenderer()],
    )

ENVIRONMENT = os.getenv("ENVIRONMENT")

if ENVIRONMENT == "test":
    # Configure Structlog's to raise errors
    structlog.configure(
        processors=[log_test_error, structlog.processors.JSONRenderer()],
    )

if ENVIRONMENT == "dev":
    # Configure Structlog's to print all logs
    structlog.configure(
        processors=[log_to_stdout, structlog.processors.JSONRenderer()],
    )

logger = structlog.get_logger("main")

if ENVIRONMENT == "production":
    if os.getenv("NEW_RELIC") == "1":
        logger.info("NewRelic initialized")
    else:
        logger.info("Logger initialized")
