from fastapi import status

from .examples import register_examples, verify_examples, login_examples

register_responses = {
    status.HTTP_400_BAD_REQUEST: {
        "content": {"application/json": {"examples": register_examples}},
    },
}

verify_responses = {
    status.HTTP_400_BAD_REQUEST: {
        "content": {"application/json": {"examples": verify_examples}},
    }
}

login_responses = {
    status.HTTP_400_BAD_REQUEST: {
        "content": {"application/json": {"examples": login_examples}},
    }
}
