import os

SETTINGS = {
    "API_TOKEN": os.getenv("NOTIFICATIONS_API_TOKEN", "").strip(),
}
