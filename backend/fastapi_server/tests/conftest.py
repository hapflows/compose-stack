import pytest
from fastapi.testclient import TestClient

from ..main import app


@pytest.fixture(scope="module")
def test_app():
    # set up
    with TestClient(app) as test_client:
        # testing
        yield test_client

    # tear down
