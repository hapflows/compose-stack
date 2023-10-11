import os

TOKEN_SECRET = os.getenv("USERS_TOKEN_SECRET", "SetMeInEnvVars!")

SETTINGS = {
    "JWT_ALGORITHM": "HS256",
    "VERIFICATION_TOKEN_AUDIENCE": "users:VERIFICATION_TOKEN",
    "VERIFICATION_SECRET": os.getenv("USERS_VERIFICATION_TOKEN_SECRET", TOKEN_SECRET),
    "VERIFICATION_LIFETIME_SECONDS": 60 * 60 * 24,  # 1 day
    "RETURN_VERIFICATION_TOKENS": os.getenv("USERS_RETURN_VERIFICATION_TOKENS") == "1",
    "ACCESS_TOKEN_AUDIENCE": "users:ACCESS_TOKEN",
    "ACCESS_TOKEN_SECRET": os.getenv("ACCESS_TOKEN_SECRET", TOKEN_SECRET),
    "ACCESS_TOKEN_EXPIRE_SECONDS": 60 * 60 * 24 * 7,  # 7 days
    "REFRESH_TOKEN_AUDIENCE": "users:REFRESH_TOKEN",
    "REFRESH_TOKEN_SECRET": os.getenv("USERS_REFRESH_TOKEN_SECRET", TOKEN_SECRET),
    "REFRESH_TOKEN_EXPIRE_SECONDS": 60 * 60 * 24 * 30,  # 1 month
    "FORGOT_PASSWORD_TOKEN_AUDIENCE": "users:FORGOT_PASSWORD_TOKEN",
    "FORGOT_PASSWORD_TOKEN_SECRET": os.getenv(
        "USERS_FORGOT_PASSWORD_TOKEN_SECRET", TOKEN_SECRET
    ),
    "FORGOT_PASSWORD_TOKEN_EXPIRE_SECONDS": 60 * 60 * 24,  # 1 day
    "RETURN_FORGOT_PASSWORD_TOKEN": os.getenv("USERS_RETURN_FORGOT_PASSWORD_TOKEN")
    == "1",
}
