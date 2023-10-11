from typing import Tuple
import re

from passlib import pwd
from passlib.context import CryptContext


class PasswordHelper:
    context: CryptContext

    def __init__(self):
        self.context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_and_update(
        self, plain_password: str, hashed_password: str
    ) -> Tuple[bool, str]:
        return self.context.verify_and_update(plain_password, hashed_password)

    def hash(self, password: str) -> str:
        return self.context.hash(password)

    def generate(self) -> str:
        return pwd.genword()

    def is_valid_password(self, password: str) -> bool:
        if len(password) < 8:
            return "TOO_SHORT"
        if not re.match(r".*[A-Z]+", password):
            return "NO_UPPERCASE"
        if not re.match(r".*[a-z]+", password):
            return "NO_LOWERCASE"
        if not re.match(r".*[0-9]+", password):
            return "NO_NUMBER"
        if not re.match(r".*[@#$%^&\+=!\"£*\-_{};:~|[\]()/\\]+", password):
            return "NO_SPECIAL_CHAR"
        return True


password_helper = PasswordHelper()
