// @ts-nocheck
import { expect, test } from '../fixtures/fixture.api.js'
import { UserBuilder, user } from '../utils/dataFactory.js'
const contact = new UserBuilder().setDefaults().build()
const contact2 = new UserBuilder().setDefaults().build()
let token = ''
let contactId = ''
test.describe.serial(`Contacts API`, async () => {
  test('register new user', async ({ api }) => {
    const response = await api.postReq('/users', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })
    const body = await response.json()
    expect(response.status()).toBe(201)
    expect(body.user).toHaveProperty('firstName', user.firstName)
    expect(body.user).toHaveProperty('lastName', user.lastName)
    expect(body.user).toHaveProperty('email', user.email)
    token = body.token
  })
  test('login registered user', async ({ api }) => {
    const response = await api.postReq('/users/login', {
      email: user.email,
      password: user.password
    })
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.user).toHaveProperty('firstName', user.firstName)
    expect(body.user).toHaveProperty('lastName', user.lastName)
    expect(body.user).toHaveProperty('email', user.email)
    token = body.token
  })
  test(`create contact`, async ({ api }) => {
    const response = await api.postReq(
      '/contacts',
      {
        firstName: contact.firstName,
        lastName: contact.lastName,
        birthdate: contact.dateOfBirth,
        email: contact.email,
        phone: contact.phoneNumber,
        street1: contact.street,
        street2: '',
        city: contact.city,
        stateProvince: contact.state,
        postalCode: contact.postalCode,
        country: contact.country
      },
      token
    )
    const body = await response.json()
    expect(response.status()).toBe(201)
    expect(body).toHaveProperty('firstName', contact.firstName)
    expect(body).toHaveProperty('lastName', contact.lastName)
    expect(body).toHaveProperty('email', contact.email)
    expect(body).toHaveProperty('phone', contact.phoneNumber)
    expect(body).toHaveProperty('street1', contact.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact.city)
    expect(body).toHaveProperty('stateProvince', contact.state)
    expect(body).toHaveProperty('postalCode', contact.postalCode)
    expect(body).toHaveProperty('country', contact.country)
    contactId = body._id
  })
  test(`get user contacts`, async ({ api }) => {
    const response = await api.getReq('/contacts', token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.length).toBe(1)
  })
  test(`get single contact`, async ({ api }) => {
    const response = await api.getReq(`/contacts/${contactId}`, token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', contact.firstName)
    expect(body).toHaveProperty('lastName', contact.lastName)
    expect(body).toHaveProperty('email', contact.email)
    expect(body).toHaveProperty('phone', contact.phoneNumber)
    expect(body).toHaveProperty('street1', contact.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact.city)
    expect(body).toHaveProperty('stateProvince', contact.state)
    expect(body).toHaveProperty('postalCode', contact.postalCode)
  })
  test(`update contact`, async ({ api }) => {
    const response = await api.patchReq(
      `/contacts/${contactId}`,
      {
        firstName: contact2.firstName,
        lastName: contact2.lastName,
        birthdate: contact2.dateOfBirth,
        email: contact2.email,
        phone: contact2.phoneNumber,
        street1: contact2.street,
        street2: '',
        city: contact2.city,
        stateProvince: contact2.state,
        postalCode: contact2.postalCode,
        country: contact2.country
      },
      token
    )
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', contact2.firstName)
    expect(body).toHaveProperty('lastName', contact2.lastName)
    expect(body).toHaveProperty('email', contact2.email)
    expect(body).toHaveProperty('phone', contact2.phoneNumber)
    expect(body).toHaveProperty('street1', contact2.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact2.city)
    expect(body).toHaveProperty('stateProvince', contact2.state)
    expect(body).toHaveProperty('postalCode', contact2.postalCode)
    expect(body).toHaveProperty('country', contact2.country)
  })
  test(`get contacts after update`, async ({ api }) => {
    const response = await api.getReq('/contacts', token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.length).toBe(1)
    expect(body[0]).toHaveProperty('firstName', contact2.firstName)
    expect(body[0]).toHaveProperty('lastName', contact2.lastName)
    expect(body[0]).toHaveProperty('email', contact2.email)
    expect(body[0]).toHaveProperty('phone', contact2.phoneNumber)
    expect(body[0]).toHaveProperty('street1', contact2.street)
    expect(body[0]).toHaveProperty('street2', '')
    expect(body[0]).toHaveProperty('city', contact2.city)
    expect(body[0]).toHaveProperty('stateProvince', contact2.state)
    expect(body[0]).toHaveProperty('postalCode', contact2.postalCode)
    expect(body[0]).toHaveProperty('country', contact2.country)
  })
  test(`get contact after update`, async ({ api }) => {
    const response = await api.getReq(`/contacts/${contactId}`, token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', contact2.firstName)
    expect(body).toHaveProperty('lastName', contact2.lastName)
    expect(body).toHaveProperty('email', contact2.email)
    expect(body).toHaveProperty('phone', contact2.phoneNumber)
    expect(body).toHaveProperty('street1', contact2.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact2.city)
    expect(body).toHaveProperty('stateProvince', contact2.state)
    expect(body).toHaveProperty('postalCode', contact2.postalCode)
  })
  test(`patch contact`, async ({ api }) => {
    const response = await api.patchReq(
      `/contacts/${contactId}`,
      {
        firstName: 'Updated',
        lastName: 'Name',
        email: contact2.email,
        phone: contact2.phoneNumber
      },
      token
    )
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', 'Updated')
    expect(body).toHaveProperty('lastName', 'Name')
    expect(body).toHaveProperty('email', contact2.email)
    expect(body).toHaveProperty('phone', contact2.phoneNumber)
    expect(body).toHaveProperty('street1', contact2.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact2.city)
    expect(body).toHaveProperty('stateProvince', contact2.state)
    expect(body).toHaveProperty('postalCode', contact2.postalCode)
    expect(body).toHaveProperty('country', contact2.country)
  })
  test(`get contacts after patch`, async ({ api }) => {
    const response = await api.getReq('/contacts', token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.length).toBe(1)
    expect(body[0]).toHaveProperty('firstName', 'Updated')
    expect(body[0]).toHaveProperty('lastName', 'Name')
    expect(body[0]).toHaveProperty('email', contact2.email)
    expect(body[0]).toHaveProperty('phone', contact2.phoneNumber)
    expect(body[0]).toHaveProperty('street1', contact2.street)
    expect(body[0]).toHaveProperty('street2', '')
    expect(body[0]).toHaveProperty('city', contact2.city)
    expect(body[0]).toHaveProperty('stateProvince', contact2.state)
    expect(body[0]).toHaveProperty('postalCode', contact2.postalCode)
    expect(body[0]).toHaveProperty('country', contact2.country)
  })
  test(`get contact after patch`, async ({ api }) => {
    const response = await api.getReq(`/contacts/${contactId}`, token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', 'Updated')
    expect(body).toHaveProperty('lastName', 'Name')
    expect(body).toHaveProperty('email', contact2.email)
    expect(body).toHaveProperty('phone', contact2.phoneNumber)
    expect(body).toHaveProperty('street1', contact2.street)
    expect(body).toHaveProperty('street2', '')
    expect(body).toHaveProperty('city', contact2.city)
    expect(body).toHaveProperty('stateProvince', contact2.state)
    expect(body).toHaveProperty('postalCode', contact2.postalCode)
    expect(body).toHaveProperty('country', contact2.country)
  })

  // Delete
  test(`delete contact`, async ({ api }) => {
    const response = await api.deleteReq(`/contacts/${contactId}`, token)
    expect(response.status()).toBe(200)
  })
  test(`get all contacts after delete`, async ({ api }) => {
    const response = await api.getReq('/contacts', token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.length).toBe(0)
  })
  test(`get contact after delete`, async ({ api }) => {
    const response = await api.getReq(`/contacts/${contactId}`, token)
    expect(response.status()).toBe(404)
  })
  test(`delete registered user`, async ({ api }) => {
    const response = await api.deleteReq('/users/me', token)
    expect(response.status()).toBe(200)
  })
  test(`get user profile after delete`, async ({ api }) => {
    const response = await api.getReq('/users/me', token)
    expect(response.status()).toBe(401)
  })
})
