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
contact_id = ''
user = {
    "firstName": fake.first_name(),
    "lastName": fake.last_name(),
    "email": fake.email(),
    "password": fake.password(),
}
# contact1 = {
#     "firstName": fake.first_name(),
#     "lastName": fake.last_name(),
#     "email": fake.email(),
#     "phone": fake.msisdn(),
#     "street1": fake.street_address(),
#     "street2": "",
#     "city": fake.city(),
#     "stateProvince": fake.state(),
#     "postalCode": fake.postcode(),
#     "country": fake.country(),
# }
# contact2 = {

#     "firstName": fake.first_name(),
#     "lastName": fake.last_name(),
#     "email": fake.email(),
#     "phone": fake.msisdn(),
#     "street1": fake.street_address(),
#     "street2": "",
#     "city": fake.city(),
#     "stateProvince": fake.state(),
#     "postalCode": fake.postcode(),
#     "country": fake.country(),
# }

contact1 = {
    "firstName": 'Hithere',
    "lastName": 'oops',
    "email": 'fake@mail.co',
    "phone": '78123798213',
    "street1": 'Ajkdsfh jksdhf',
    "street2": "",
    "city": 'HJklde',
    "stateProvince": 'AZ',
    "postalCode": '29654',
    "country": 'US',
}
contact2 = {
    "firstName": 'dsfvsdv',
    "lastName": 'sdvvvsd',
    "email": 'sdvsdvdsv@mail.co',
    "phone": '24352345656',
    "street1": 'dsacfsdvc jksdhf',
    "street2": "",
    "city": 'sdvvvd',
    "stateProvince": 'NY',
    "postalCode": '31889',
    "country": 'US',
}
session = requests.Session()
session.verify = False
class Test_ContactsCrud:
    def test_register_user(self):
        global token, user
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

    def test_login_user(self):
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

    def test_create_contact(self):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.post(
            os.getenv("BASE_URL") + "/contacts",
            headers=headers,
            data=json.dumps(contact1),
        )
        assert response.status_code == 201
        body = response.json()
        assert body["firstName"] == contact1["firstName"]
        assert body["lastName"] == contact1["lastName"]
        assert body["email"] == contact1["email"]
        assert body["phone"] == contact1["phone"]
        assert body["street1"] == contact1["street1"]
        assert body["street2"] == contact1["street2"]
        assert body["city"] == contact1["city"]
        assert body["stateProvince"] == contact1["stateProvince"]
        assert body["postalCode"] == contact1["postalCode"]
        assert body["country"] == contact1["country"]
        contact_id = body["_id"]

    def test_get_user_contacts(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts", headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == contact1["firstName"]
        assert body[0]["lastName"] == contact1["lastName"]
        assert body[0]["email"] == contact1["email"]
        assert body[0]["phone"] == contact1["phone"]
        assert body[0]["street1"] == contact1["street1"]
        assert body[0]["street2"] == contact1["street2"]
        assert body[0]["city"] == contact1["city"]
        assert body[0]["stateProvince"] == contact1["stateProvince"]
        assert body[0]["postalCode"] == contact1["postalCode"]
        assert body[0]["country"] == contact1["country"]

    def test_get_created_contact(self):
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
        assert body["phone"] == contact1["phone"]
        assert body["street1"] == contact1["street1"]
        assert body["street2"] == contact1["street2"]
        assert body["city"] == contact1["city"]
        assert body["stateProvince"] == contact1["stateProvince"]
        assert body["postalCode"] == contact1["postalCode"]
        assert body["country"] == contact1["country"]

    def test_update_contact(self):
        global token, contact_id
        response = session.put(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            data=json.dumps(contact2),
        )
        body = response.json()
        assert response.status_code == 200
        assert body["firstName"] == contact2["firstName"]
        assert body["lastName"] == contact2["lastName"]
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phone"]
        assert body["street1"] == contact2["street1"]
        assert body["street2"] == contact2["street2"]
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["stateProvince"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]

    def test_get_contacts_after_update(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts", headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == contact2["firstName"]
        assert body[0]["lastName"] == contact2["lastName"]
        assert body[0]["email"] == contact2["email"]
        assert body[0]["phone"] == contact2["phone"]
        assert body[0]["street1"] == contact2["street1"]
        assert body[0]["street2"] == contact2["street2"]
        assert body[0]["city"] == contact2["city"]
        assert body[0]["stateProvince"] == contact2["stateProvince"]
        assert body[0]["postalCode"] == contact2["postalCode"]
        assert body[0]["country"] == contact2["country"]
    def test_get_contact_after_update(self):
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
        assert body["phone"] == contact2["phone"]
        assert body["street1"] == contact2["street1"]
        assert body["street2"] == contact2["street2"]
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["stateProvince"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]
    def test_patch_contact(self):
        global token, contact_id
        response = session.patch(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            data=json.dumps({
        "firstName": 'Updated',
        "lastName": 'Name',
        "email": contact2["email"],
        "phone": contact2["phone"]
      }),
        )
        assert response.status_code == 200
        body = response.json()
        assert body["firstName"] == 'Updated'
        assert body["lastName"] == 'Name'
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phone"]
    def test_get_contacts_after_patch(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts", headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert body[0]["firstName"] == 'Updated'
        assert body[0]["lastName"] == 'Name'
        assert body[0]["email"] == contact2["email"]
        assert body[0]["phone"] == contact2["phone"]
        assert body[0]["street1"] == contact2["street1"]
        assert body[0]["street2"] == contact2["street2"]
        assert body[0]["city"] == contact2["city"]
        assert body[0]["stateProvince"] == contact2["stateProvince"]
        assert body[0]["postalCode"] == contact2["postalCode"]
        assert body[0]["country"] == contact2["country"]
    def test_get_contact_after_patch(self):
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
        assert body["firstName"] == 'Updated'
        assert body["lastName"] == 'Name'
        assert body["email"] == contact2["email"]
        assert body["phone"] == contact2["phone"]
        assert body["street1"] == contact2["street1"]
        assert body["street2"] == contact2["street2"]
        assert body["city"] == contact2["city"]
        assert body["stateProvince"] == contact2["stateProvince"]
        assert body["postalCode"] == contact2["postalCode"]
        assert body["country"] == contact2["country"]
    def test_delete_contact(self):
        global token, contact_id
        response = session.delete(
            os.getenv("BASE_URL") + "/contacts/" + contact_id,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        )
        assert response.status_code == 200
    def test_get_contacts_after_delete(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts", headers=headers
        )
        assert response.status_code == 200
        body = response.json()
        assert len(body) == 0
    def test_get_contact_after_delete(self):
        global token, contact_id
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/contacts/" + contact_id, headers=headers
        )
        assert response.status_code == 404
    def test_delete_user(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.delete(
            os.getenv("BASE_URL") + "/users/me", headers=headers
        )
        assert response.status_code == 200
    def test_get_user_after_delete(self):
        global token
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
        response = session.get(
            os.getenv("BASE_URL") + "/users/me", headers=headers
        )
        assert response.status_code == 401
if __name__ == "__main__":
    pytest.main([__file__])
