class BaseException(Exception):
    reason: str | None


class UserDoesNotExists(BaseException):
    pass


class UserAlreadyExists(BaseException):
    pass


class InvalidPasswordException(BaseException):
    pass


class UserInactive(BaseException):
    pass


class UserAlreadyVerified(BaseException):
    pass


class InvalidVerifyToken(BaseException):
    pass


class InvalidUserId(BaseException):
    pass
