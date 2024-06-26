import json
import os

import requests
from dotenv import load_dotenv

import pytest


load_dotenv()
token = ""
contact_id = ""
users = json.loads(open("./fixtures/users.json", "r").read())
contact1 = json.loads(open("./fixtures/contact1.json", "r").read())
contact2 = json.loads(open("./fixtures/contact2.json", "r").read())

data = []
for i in range(len(users)):
    data.append((users[i], contact1[i], contact2[i]))
session = requests.Session()
session.verify = False


@pytest.mark.parametrize("user, contact1, contact2", data, scope="class")
class Test_ContactsCrud:

    def test_register_user(self, user, contact1, contact2):
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

    def test_login_user(self, user, contact1, contact2):
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

    def test_create_contact(self, user, contact1, contact2):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.post(
            os.getenv("BASE_URL") + "/contacts",
            headers=headers,
            data=json.dumps(
                {
                    "firstName": contact1["firstName"],
                    "lastName": contact1["lastName"],
                    "birthdate": contact1["dateOfBirth"],
                    "email": contact1["email"],
                    "phone": contact1["phoneNumber"],
                    "street1": contact1["street"],
                    "street2": "",
                    "city": contact1["city"],
                    "stateProvince": contact1["state"],
                    "postalCode": contact1["postalCode"],
                    "country": contact1["country"],
                }
            ),
        )
        assert response.status_code == 201
        body = response.json()
        assert body["firstName"] == contact1["firstName"]
        assert body["lastName"] == contact1["lastName"]
        assert body["email"] == contact1["email"]
        assert body["phone"] == contact1["phoneNumber"]
        assert body["street1"] == contact1["street"]
        assert body["street2"] == ""
        assert body["city"] == contact1["city"]
        assert body["stateProvince"] == contact1["state"]
        assert body["postalCode"] == contact1["postalCode"]
        assert body["country"] == contact1["country"]
        contact_id = body["_id"]

    def test_get_user_contacts(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(os.getenv("BASE_URL") + "/contacts", headers=headers)
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == contact1["firstName"]
        assert body[0]["lastName"] == contact1["lastName"]
        assert body[0]["email"] == contact1["email"]
        assert body[0]["phone"] == contact1["phoneNumber"]
        assert body[0]["street1"] == contact1["street"]
        assert body[0]["street2"] == ""
        assert body[0]["city"] == contact1["city"]
        assert body[0]["stateProvince"] == contact1["state"]
        assert body[0]["postalCode"] == contact1["postalCode"]
        assert body[0]["country"] == contact1["country"]

    def test_get_created_contact(self, user, contact1, contact2):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + f"/contacts/{contact_id}", headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body["firstName"] == contact1["firstName"]
        assert body["lastName"] == contact1["lastName"]
        assert body["email"] == contact1["email"]
        assert body["phone"] == contact1["phoneNumber"]
        assert body["street1"] == contact1["street"]
        assert body["street2"] == ""
        assert body["city"] == contact1["city"]
        assert body["stateProvince"] == contact1["state"]
        assert body["postalCode"] == contact1["postalCode"]
        assert body["country"] == contact1["country"]

    def test_update_contact(self, user, contact1, contact2):
        global token, contact_id
        response = session.put(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            data=json.dumps(
                {
                    "firstName": contact2["firstName"],
                    "lastName": contact2["lastName"],
                    "birthdate": contact2["dateOfBirth"],
                    "email": contact2["email"],
                    "phone": contact2["phoneNumber"],
                    "street1": contact2["street"],
                    "street2": "",
                    "city": contact2["city"],
                    "stateProvince": contact2["state"],
                    "postalCode": contact2["postalCode"],
                    "country": contact2["country"],
                }
            ),
        )
        body = response.json()
        assert response.status_code == 200
        assert body["firstName"] == contact2["firstName"]
        assert body["lastName"] == contact2["lastName"]
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phoneNumber"]
        assert body["street1"] == contact2["street"]
        assert body["street2"] == ""
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["state"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]

    def test_get_contacts_after_update(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(os.getenv("BASE_URL") + "/contacts", headers=headers)
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == contact2["firstName"]
        assert body[0]["lastName"] == contact2["lastName"]
        assert body[0]["email"] == contact2["email"]
        assert body[0]["phone"] == contact2["phoneNumber"]
        assert body[0]["street1"] == contact2["street"]
        assert body[0]["street2"] == ""
        assert body[0]["city"] == contact2["city"]
        assert body[0]["stateProvince"] == contact2["state"]
        assert body[0]["postalCode"] == contact2["postalCode"]
        assert body[0]["country"] == contact2["country"]

    def test_get_contact_after_update(self, user, contact1, contact2):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts/" + contact_id, headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body["firstName"] == contact2["firstName"]
        assert body["lastName"] == contact2["lastName"]
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phoneNumber"]
        assert body["street1"] == contact2["street"]
        assert body["street2"] == ""
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["state"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]

    def test_patch_contact(self, user, contact1, contact2):
        global token, contact_id
        response = session.patch(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            data=json.dumps(
                {
                    "firstName": "Updated",
                    "lastName": "Name",
                    "email": contact2["email"],
                    "phoneNumber": contact2["phoneNumber"],
                }
            ),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["firstName"] == "Updated"
        assert body["lastName"] == "Name"
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phoneNumber"]

    def test_get_contacts_after_patch(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(os.getenv("BASE_URL") + "/contacts", headers=headers)
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == "Updated"
        assert body[0]["lastName"] == "Name"
        assert body[0]["email"] == contact2["email"]
        assert body[0]["phone"] == contact2["phoneNumber"]
        assert body[0]["street1"] == contact2["street"]
        assert body[0]["street2"] == ""
        assert body[0]["city"] == contact2["city"]
        assert body[0]["stateProvince"] == contact2["state"]
        assert body[0]["postalCode"] == contact2["postalCode"]
        assert body[0]["country"] == contact2["country"]

    def test_get_contact_after_patch(self, user, contact1, contact2):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts/" + contact_id, headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body["firstName"] == "Updated"
        assert body["lastName"] == "Name"
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phoneNumber"]
        assert body["street1"] == contact2["street"]
        assert body["street2"] == ""
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["state"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]

    def test_delete_contact(self, user, contact1, contact2):
        global token, contact_id
        response = session.delete(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        )
        assert response.status_code == 200

    def test_get_contacts_after_delete(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(os.getenv("BASE_URL") + "/contacts", headers=headers)
        assert response.status_code == 200
        body = response.json()
        assert len(body) == 0

    def test_get_contact_after_delete(self, user, contact1, contact2):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts/" + contact_id, headers=headers
        )
        assert response.status_code == 404

    def test_delete_user(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.delete(os.getenv("BASE_URL") + "/users/me", headers=headers)
        assert response.status_code == 200

    def test_get_user_after_delete(self, user, contact1, contact2):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(os.getenv("BASE_URL") + "/users/me", headers=headers)
        assert response.status_code == 401


if __name__ == "__main__":
    pytest.main([__file__])
