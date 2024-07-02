import json
import os
import requests
from dotenv import load_dotenv
from faker import Faker
from faker.providers import person
import pytest

fake = Faker()
fake.add_provider(person)
load_dotenv()
token = ""
user = {
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "email": fake.email(),
        "password": fake.password(),
    }

session = requests.Session()
session.verify = False

class Test_UserCrud:
    def test_register_user(self):
        global token, user
        headers = {'Content-Type': 'application/json'}
        response = session.post(os.getenv("BASE_URL") + "/users", headers=headers, data=json.dumps(user))
        assert response.status_code == 201
        body = response.json()
        assert body["user"]["firstName"] == user["firstName"]
        assert body["user"]["lastName"] == user["lastName"]
        assert body["user"]["email"] == user["email"]
        token = body["token"]
    def test_login_user(self):
        global token
        headers = {'Content-Type': 'application/json'}
        response = session.post(
            os.getenv("BASE_URL") + "/users/login", headers=headers,
            data=json.dumps({"email": user["email"], "password": user["password"]}),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["user"]["firstName"] == user["firstName"]
        assert body["user"]["lastName"] == user["lastName"]
        assert body["user"]["email"] == user["email"]
        token = body["token"]
    def test_get_user_profile(self):
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
    def test_update_user_profile(self):
        global token
        response = session.patch(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token, 'Content-Type': 'application/json'},
            data=json.dumps({
        'firstName': 'Updated',
        'lastName': 'Username',
        'email': user['email'],
        'password': 'myNewPassword'
      })
        )
        assert response.status_code == 200
        body = response.json()
        assert (
            body["firstName"] == 'Updated'
            and body["lastName"] == 'Username'
            and body["email"] == user["email"]
        )
    def test_logout_user(self):
        global token
        response = session.post(
            os.getenv("BASE_URL") + "/users/logout",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 200
    def test_get_user_profile_after_logout(self):
        global token
        response = session.get(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 401
    def test_login_and_get_updated_user(self):
        global token
        response = session.post(
            os.getenv("BASE_URL") + "/users/login",
            headers={'Content-Type': 'application/json'},
            data=json.dumps({"email": user["email"], "password": "myNewPassword"}),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["user"]["firstName"] == 'Updated'
        assert body["user"]["lastName"] == 'Username'
        assert body["user"]["email"] == user["email"]
        token = body["token"]
    def test_delete_user(self):
        global token
        response = session.delete(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 200
    def test_get_user_profile_after_delete(self):
        global token
        response = session.get(
            os.getenv("BASE_URL") + "/users/me",
            headers={"Authorization": "Bearer " + token},
        )
        assert response.status_code == 401

if __name__ == "__main__":
    pytest.main([__file__])
