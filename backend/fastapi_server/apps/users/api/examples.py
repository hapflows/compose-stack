from ..constants import ErrorCode


register_examples = {
    ErrorCode.REGISTER_USER_ALREADY_EXISTS: {
        "summary": "A user with this email already exists.",
        "value": {"detail": ErrorCode.REGISTER_USER_ALREADY_EXISTS},
    },
    ErrorCode.REGISTER_INVALID_PASSWORD: {
        "summary": "Password validation failed.",
        "value": {
            "detail": {
                "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                "reason": "Password should be"
                "at least 8 characters, and shuold have at least"
                "one lower case letter, one upper case letter"
                "and one special symbol.",
            }
        },
    },
}

verify_examples = {
    ErrorCode.VERIFY_USER_BAD_TOKEN: {
        "summary": "Bad token, not existing user or"
        "not the e-mail currently set for the user.",
        "value": {"detail": ErrorCode.VERIFY_USER_BAD_TOKEN},
    },
    ErrorCode.VERIFY_USER_ALREADY_VERIFIED: {
        "summary": "The user is already verified.",
        "value": {"detail": ErrorCode.VERIFY_USER_ALREADY_VERIFIED},
    },
}

login_examples = {
    ErrorCode.LOGIN_BAD_CREDENTIALS: {
        "summary": "Bad credentials or the user is inactive.",
        "value": {"detail": ErrorCode.LOGIN_BAD_CREDENTIALS},
    },
    ErrorCode.LOGIN_USER_NOT_VERIFIED: {
        "summary": "The user is not verified.",
        "value": {"detail": ErrorCode.LOGIN_USER_NOT_VERIFIED},
    },
}
