from datetime import datetime, timedelta
from typing import Any, Dict, List

import jwt

from .settings import SETTINGS


def generate_jwt(data: dict, secret: str, lifetime_seconds: int) -> str:
    payload = data.copy()
    if lifetime_seconds:
        expire = datetime.utcnow() + timedelta(seconds=lifetime_seconds)
        payload["exp"] = expire
    return jwt.encode(payload, secret, algorithm=SETTINGS["JWT_ALGORITHM"])


def decode_jwt(encoded_jwt: str, secret: str, audience: List[str]) -> Dict[str, Any]:
    return jwt.decode(
        encoded_jwt, secret, audience=audience, algorithms=[SETTINGS["JWT_ALGORITHM"]]
    )
