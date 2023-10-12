import json
from starlette.testclient import TestClient


def test_registration_flow(test_app: TestClient):
    email = "testuser@compose-stack.com"
    register_payload = {
        "email": email,
        "password": "SuperSecret1!",
        "first_name": "Test",
        "last_name": "User",
    }

    # Register, with success
    response = test_app.post("/register", json=register_payload)
    assert response.status_code == 201
    json_response = response.json()
    assert "id" in json_response
    for key in ["email", "first_name", "last_name"]:
        assert json_response[key] == register_payload[key]
    user_id = json_response["id"]

    # Request a verification code and registration code
    response = test_app.post("/auth/request-verification-token", json={"email": email})
    assert response.status_code == 200
    tokens = response.json()
    verification_token = tokens["verification_token"]
    registration_code = tokens["registration_code"]

    import pprint

    print("=" * 40)
    pprint.pprint(tokens)
    print("=" * 40)

    # Verify user
    response = test_app.post(
        "/auth/verify",
        json={"token": verification_token, "registration_code": registration_code},
    )
    assert response.status_code == 200
    assert response.json() == {"verified": True}

    # Login
    response = test_app.post(
        "/login", data={"username": email, "password": "SuperSecret1!"}
    )
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    # Access a route that requires authorization
    response = test_app.get(f"/users/user", headers=headers)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["id"] == user_id
    assert json_response["email"] == email

    # Request a new token
    response = test_app.post(
        "/auth/refresh-tokens", json={"token": tokens["refresh_token"]}
    )
    assert response.status_code == 200
    json_response = response.json()
    assert "access_token" in json_response
    assert "access_token_expiration" in json_response
    assert "token_type" in json_response
    new_access_token = json_response["access_token"]
    headers = {"Authorization": f"Bearer {new_access_token}"}
    # Access a route that requires authorization
    response = test_app.get(f"/users/user", headers=headers)
    assert response.status_code == 200

    # Change password when forget
    response = test_app.post("/auth/forgot-password", json={"email": email})
    assert response.status_code == 200
    json_response = response.json()
    forgot_password_token = json_response["forgot_password_token"]
    # Use the token to update the password
    pw_payload = {
        "email": email,
        "token": forgot_password_token,
        "password": "AnotherGood1!",
    }
    response = test_app.post("/auth/reset-password", json=pw_payload)
    assert response.status_code == 200

    # Try to login with the old one, then with the new one
    response = test_app.post(
        "/login", data={"username": email, "password": "SuperSecret1"}
    )
    assert response.status_code == 400
    response = test_app.post(
        "/login", data={"username": email, "password": "AnotherGood1!"}
    )
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
