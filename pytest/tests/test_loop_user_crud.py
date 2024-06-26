import json
import os

import requests
from dotenv import load_dotenv

import pytest

load_dotenv()
token = ""
users = json.loads(open("./fixtures/users.json", "r").read())
session = requests.Session()
session.verify = False
data = []
for i in range(len(users)):
    data.append((users[i]))


@pytest.mark.parametrize("user", data, scope="class")
class Test_UserCrud:
    def test_register_user(self, user):
        global token
        headers = {"Content-Type": "application/json"}
        response = session.post(
            os.getenv("BASE_URL") + "/users", headers=headers, data=json.dumps(user)
        )
        assert response.status_code == 201
        body = response.json()
        assert body["user"]["firstName"] == user["firstName"]
        assert body["user"]["lastName"] == user["lastName"]
        assert body["user"]["email"] == user["email"]
        token = body["token"]

    def test_login_user(self, user):
        global token
        headers = {"Content-Type": "application/json"}
        response = session.post(
            os.getenv("BASE_URL") + "/users/login",
            headers=headers,
            data=json.dumps({"email": user["email"], "password": user["password"]}),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["user"]["firstName"] == user["firstName"]
        assert body["user"]["lastName"] == user["lastName"]
        assert body["user"]["email"] == user["email"]
        token = body["token"]

    def test_get_user_profile(self, user):
        global token
        response = session.get(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 200
        body = response.json()
        assert (
            body["firstName"] == user["firstName"]
            and body["lastName"] == user["lastName"]
            and body["email"] == user["email"]
        )

    def test_update_user_profile(self, user):
        global token
        response = session.patch(
            os.getenv("BASE_URL") + "/users/me",
            headers={
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            data=json.dumps(
                {
                    "firstName": "Updated",
                    "lastName": "Username",
                    "email": user["email"],
                    "password": "myNewPassword",
                }
            ),
        )
        assert response.status_code == 200
        body = response.json()
        assert (
            body["firstName"] == "Updated"
            and body["lastName"] == "Username"
            and body["email"] == user["email"]
        )

    def test_logout_user(self, user):
        global token
        response = session.post(
            os.getenv("BASE_URL") + "/users/logout",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 200

    def test_get_user_profile_after_logout(self, user):
        global token
        response = session.get(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 401

    def test_login_and_get_updated_user(self, user):
        global token
        response = session.post(
            os.getenv("BASE_URL") + "/users/login",
            headers={"Content-Type": "application/json"},
            data=json.dumps({"email": user["email"], "password": "myNewPassword"}),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["user"]["firstName"] == "Updated"
        assert body["user"]["lastName"] == "Username"
        assert body["user"]["email"] == user["email"]
        token = body["token"]

    def test_delete_user(self, user):
        global token
        response = session.delete(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 200

    def test_get_user_profile_after_delete(self, user):
        global token
        response = session.get(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__])
