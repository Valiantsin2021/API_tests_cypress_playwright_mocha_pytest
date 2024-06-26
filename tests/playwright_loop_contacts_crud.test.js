// @ts-nocheck
import fs from 'fs'
import { expect, test } from '../fixtures/fixture.api.js'
const users = JSON.parse(fs.readFileSync('./fixtures/users.json'))
const contact = JSON.parse(fs.readFileSync('./fixtures/contact1.json'))
const contact2 = JSON.parse(fs.readFileSync('./fixtures/contact2.json'))
let token = ''
let contactId = ''
for(let i = 0; i < users.length; i++) {
  test.describe.serial(`Contacts APIfor user ${i + 1}`, async () => {
    test(`register new user ${users[i].firstName}`, async ({ api }) => {
      const response = await api.postReq('/users', {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        email: users[i].email,
        password: users[i].password
      })
      const body = await response.json()
      expect(response.status()).toBe(201)
      expect(body.user).toHaveProperty('firstName', users[i].firstName)
      expect(body.user).toHaveProperty('lastName', users[i].lastName)
      expect(body.user).toHaveProperty('email', users[i].email)
      token = body.token
    })
    test(`login registered user ${users[i].firstName}`, async ({ api }) => {
      const response = await api.postReq('/users/login', {
        email: users[i].email,
        password: users[i].password
      })
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.user).toHaveProperty('firstName', users[i].firstName)
      expect(body.user).toHaveProperty('lastName', users[i].lastName)
      expect(body.user).toHaveProperty('email', users[i].email)
      token = body.token
    })
    test(`create contact for ${users[i].firstName}`, async ({ api }) => {
      const response = await api.postReq(
        '/contacts',
        {
          firstName: contact[i].firstName,
          lastName: contact[i].lastName,
          birthdate: contact[i].dateOfBirth,
          email: contact[i].email,
          phone: contact[i].phoneNumber,
          street1: contact[i].street,
          street2: '',
          city: contact[i].city,
          stateProvince: contact[i].state,
          postalCode: contact[i].postalCode,
          country: contact[i].country
        },
        token
      )
      const body = await response.json()
      expect(response.status()).toBe(201)
      expect(body).toHaveProperty('firstName', contact[i].firstName)
      expect(body).toHaveProperty('lastName', contact[i].lastName)
      expect(body).toHaveProperty('email', contact[i].email)
      expect(body).toHaveProperty('phone', contact[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact[i].city)
      expect(body).toHaveProperty('stateProvince', contact[i].state)
      expect(body).toHaveProperty('postalCode', contact[i].postalCode)
      expect(body).toHaveProperty('country', contact[i].country)
      contactId = body._id
    })
    test(`get user ${users[i].firstName} contacts`, async ({ api }) => {
      const response = await api.getReq('/contacts', token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.length).toBe(1)
    })
    test(`get single contact for ${users[i].firstName}`, async ({ api }) => {
      const response = await api.getReq(`/contacts/${contactId}`, token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', contact[i].firstName)
      expect(body).toHaveProperty('lastName', contact[i].lastName)
      expect(body).toHaveProperty('email', contact[i].email)
      expect(body).toHaveProperty('phone', contact[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact[i].city)
      expect(body).toHaveProperty('stateProvince', contact[i].state)
      expect(body).toHaveProperty('postalCode', contact[i].postalCode)
    })
    test(`update contact for ${users[i].firstName}`, async ({ api }) => {
      const response = await api.patchReq(
        `/contacts/${contactId}`,
        {
          firstName: contact2[i].firstName,
          lastName: contact2[i].lastName,
          birthdate: contact2[i].dateOfBirth,
          email: contact2[i].email,
          phone: contact2[i].phoneNumber,
          street1: contact2[i].street,
          street2: '',
          city: contact2[i].city,
          stateProvince: contact2[i].state,
          postalCode: contact2[i].postalCode,
          country: contact2[i].country
        },
        token
      )
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', contact2[i].firstName)
      expect(body).toHaveProperty('lastName', contact2[i].lastName)
      expect(body).toHaveProperty('email', contact2[i].email)
      expect(body).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact2[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact2[i].city)
      expect(body).toHaveProperty('stateProvince', contact2[i].state)
      expect(body).toHaveProperty('postalCode', contact2[i].postalCode)
      expect(body).toHaveProperty('country', contact2[i].country)
    })
    test(`get contacts for ${users[i].firstName} after update`, async ({ api }) => {
      const response = await api.getReq('/contacts', token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.length).toBe(1)
      expect(body[0]).toHaveProperty('firstName', contact2[i].firstName)
      expect(body[0]).toHaveProperty('lastName', contact2[i].lastName)
      expect(body[0]).toHaveProperty('email', contact2[i].email)
      expect(body[0]).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body[0]).toHaveProperty('street1', contact2[i].street)
      expect(body[0]).toHaveProperty('street2', '')
      expect(body[0]).toHaveProperty('city', contact2[i].city)
      expect(body[0]).toHaveProperty('stateProvince', contact2[i].state)
      expect(body[0]).toHaveProperty('postalCode', contact2[i].postalCode)
      expect(body[0]).toHaveProperty('country', contact2[i].country)
    })
    test(`get contact for ${users[i].firstName} after update`, async ({ api }) => {
      const response = await api.getReq(`/contacts/${contactId}`, token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', contact2[i].firstName)
      expect(body).toHaveProperty('lastName', contact2[i].lastName)
      expect(body).toHaveProperty('email', contact2[i].email)
      expect(body).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact2[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact2[i].city)
      expect(body).toHaveProperty('stateProvince', contact2[i].state)
      expect(body).toHaveProperty('postalCode', contact2[i].postalCode)
    })
    test(`patch contact for ${users[i].firstName}`, async ({ api }) => {
      const response = await api.patchReq(
        `/contacts/${contactId}`,
        {
          firstName: 'Updated',
          lastName: 'Name',
          email: contact2[i].email,
          phone: contact2[i].phoneNumber
        },
        token
      )
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', 'Updated')
      expect(body).toHaveProperty('lastName', 'Name')
      expect(body).toHaveProperty('email', contact2[i].email)
      expect(body).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact2[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact2[i].city)
      expect(body).toHaveProperty('stateProvince', contact2[i].state)
      expect(body).toHaveProperty('postalCode', contact2[i].postalCode)
      expect(body).toHaveProperty('country', contact2[i].country)
    })
    test(`get contacts for ${users[i].firstName} after patch`, async ({ api }) => {
      const response = await api.getReq('/contacts', token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.length).toBe(1)
      expect(body[0]).toHaveProperty('firstName', 'Updated')
      expect(body[0]).toHaveProperty('lastName', 'Name')
      expect(body[0]).toHaveProperty('email', contact2[i].email)
      expect(body[0]).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body[0]).toHaveProperty('street1', contact2[i].street)
      expect(body[0]).toHaveProperty('street2', '')
      expect(body[0]).toHaveProperty('city', contact2[i].city)
      expect(body[0]).toHaveProperty('stateProvince', contact2[i].state)
      expect(body[0]).toHaveProperty('postalCode', contact2[i].postalCode)
      expect(body[0]).toHaveProperty('country', contact2[i].country)
    })
    test(`get contact for ${users[i].firstName} after patch`, async ({ api }) => {
      const response = await api.getReq(`/contacts/${contactId}`, token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', 'Updated')
      expect(body).toHaveProperty('lastName', 'Name')
      expect(body).toHaveProperty('email', contact2[i].email)
      expect(body).toHaveProperty('phone', contact2[i].phoneNumber)
      expect(body).toHaveProperty('street1', contact2[i].street)
      expect(body).toHaveProperty('street2', '')
      expect(body).toHaveProperty('city', contact2[i].city)
      expect(body).toHaveProperty('stateProvince', contact2[i].state)
      expect(body).toHaveProperty('postalCode', contact2[i].postalCode)
      expect(body).toHaveProperty('country', contact2[i].country)
    })

    // Delete
    test(`delete contact for ${users[i].firstName}`, async ({ api }) => {
      const response = await api.deleteReq(`/contacts/${contactId}`, token)
      expect(response.status()).toBe(200)
    })
    test(`get all contacts for ${users[i].firstName} after delete`, async ({ api }) => {
      const response = await api.getReq('/contacts', token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.length).toBe(0)
    })
    test(`get contact for ${users[i].firstName} after delete`, async ({ api }) => {
      const response = await api.getReq(`/contacts/${contactId}`, token)
      expect(response.status()).toBe(404)
    })
    test(`delete registered user ${users[i].firstName}`, async ({ api }) => {
      const response = await api.deleteReq('/users/me', token)
      expect(response.status()).toBe(200)
    })
    test(`get user ${users[i].firstName} profile after delete`, async ({ api }) => {
      const response = await api.getReq('/users/me', token)
      expect(response.status()).toBe(401)
    })
  })
}
