// @ts-nocheck
import { expect } from 'chai'
import dotenv from 'dotenv'
import request from 'supertest'
import { user, UserBuilder } from '../../utils/dataFactory.js'
const contact = new UserBuilder().setDefaults().build()
const contact2 = new UserBuilder().setDefaults().build()
dotenv.config()
let token = ''
let contactId = ''
describe(`Supertest contacts API`, async () => {
  it('register new user', async () => {
    const response = await request(process.env.BASE_URL).post('/users').send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })
    expect(response.status).to.equal(201)
    expect(response.body.user).to.have.property('firstName', user.firstName)
    expect(response.body.user).to.have.property('lastName', user.lastName)
    expect(response.body.user).to.have.property('email', user.email)
  })
  it('login registered user', async () => {
    const response = await request(process.env.BASE_URL).post('/users/login').send({
      email: user.email,
      password: user.password
    })
    expect(response.status).to.equal(200)
    expect(response.body.user).to.have.property('firstName', user.firstName)
    expect(response.body.user).to.have.property('lastName', user.lastName)
    expect(response.body.user).to.have.property('email', user.email)
    token = response.body.token
  })
  it('create contact', async () => {
    const response = await request(process.env.BASE_URL)
      .post('/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({
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
      })
    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('firstName', contact.firstName)
    expect(response.body).to.have.property('lastName', contact.lastName)
    expect(response.body).to.have.property('email', contact.email)
    expect(response.body).to.have.property('phone', contact.phoneNumber)
    expect(response.body).to.have.property('street1', contact.street)
    expect(response.body).to.have.property('street2', '')
    expect(response.body).to.have.property('city', contact.city)
    expect(response.body).to.have.property('stateProvince', contact.state)
    expect(response.body).to.have.property('postalCode', contact.postalCode)
    expect(response.body).to.have.property('country', contact.country)
    contactId = response.body._id
  })
  it('get user contacts', async () => {
    const response = await request(process.env.BASE_URL).get('/contacts').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.lengthOf(1)
    expect(response.body[0]).to.have.property('firstName', contact.firstName)
    expect(response.body[0]).to.have.property('lastName', contact.lastName)
    expect(response.body[0]).to.have.property('email', contact.email)
    expect(response.body[0]).to.have.property('phone', contact.phoneNumber)
    expect(response.body[0]).to.have.property('street1', contact.street)
    expect(response.body[0]).to.have.property('street2', '')
    expect(response.body[0]).to.have.property('city', contact.city)
    expect(response.body[0]).to.have.property('stateProvince', contact.state)
    expect(response.body[0]).to.have.property('postalCode', contact.postalCode)
    expect(response.body[0]).to.have.property('country', contact.country)
  })
  it('get single contact', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', contact.firstName)
    expect(response.body).to.have.property('lastName', contact.lastName)
    expect(response.body).to.have.property('email', contact.email)
    expect(response.body).to.have.property('phone', contact.phoneNumber)
    expect(response.body).to.have.property('street1', contact.street)
    expect(response.body).to.have.property('street2', '')
    expect(response.body).to.have.property('city', contact.city)
    expect(response.body).to.have.property('stateProvince', contact.state)
    expect(response.body).to.have.property('postalCode', contact.postalCode)
    expect(response.body).to.have.property('country', contact.country)
  })
  it('update contact', async () => {
    const response = await request(process.env.BASE_URL)
      .put(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: contact2.firstName,
        lastName: contact2.lastName,
        email: contact2.email,
        phone: contact2.phoneNumber,
        street1: contact2.street,
        street2: '',
        city: contact2.city,
        stateProvince: contact2.state,
        postalCode: contact2.postalCode,
        country: contact2.country
      })
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', contact2.firstName)
    expect(response.body).to.have.property('lastName', contact2.lastName)
    expect(response.body).to.have.property('email', contact2.email)
    expect(response.body).to.have.property('phone', contact2.phoneNumber)
    expect(response.body).to.have.property('street1', contact2.street)
    expect(response.body).to.have.property('street2', '')
    expect(response.body).to.have.property('city', contact2.city)
    expect(response.body).to.have.property('stateProvince', contact2.state)
    expect(response.body).to.have.property('postalCode', contact2.postalCode)
    expect(response.body).to.have.property('country', contact2.country)
  })
  it(`get contacts after update`, async () => {
    const response = await request(process.env.BASE_URL).get('/contacts').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.lengthOf(1)
    expect(response.body[0]).to.have.property('firstName', contact2.firstName)
    expect(response.body[0]).to.have.property('lastName', contact2.lastName)
    expect(response.body[0]).to.have.property('email', contact2.email)
    expect(response.body[0]).to.have.property('phone', contact2.phoneNumber)
    expect(response.body[0]).to.have.property('street1', contact2.street)
    expect(response.body[0]).to.have.property('street2', '')
    expect(response.body[0]).to.have.property('city', contact2.city)
    expect(response.body[0]).to.have.property('stateProvince', contact2.state)
    expect(response.body[0]).to.have.property('postalCode', contact2.postalCode)
    expect(response.body[0]).to.have.property('country', contact2.country)
  })
  it('get contact after update', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', contact2.firstName)
    expect(response.body).to.have.property('lastName', contact2.lastName)
    expect(response.body).to.have.property('email', contact2.email)
    expect(response.body).to.have.property('phone', contact2.phoneNumber)
    expect(response.body).to.have.property('street1', contact2.street)
    expect(response.body).to.have.property('street2', '')
    expect(response.body).to.have.property('city', contact2.city)
    expect(response.body).to.have.property('stateProvince', contact2.state)
    expect(response.body).to.have.property('postalCode', contact2.postalCode)
    expect(response.body).to.have.property('country', contact2.country)
  })
  it(`patch contact`, async () => {
    const response = await request(process.env.BASE_URL)
      .patch(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Updated',
        lastName: 'Name',
        email: contact2.email,
        phone: contact2.phoneNumber
      })
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', 'Updated')
    expect(response.body).to.have.property('lastName', 'Name')
    expect(response.body).to.have.property('email', contact2.email)
  })

  it(`get contacts after patch`, async () => {
    const response = await request(process.env.BASE_URL).get('/contacts').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.lengthOf(1)
    expect(response.body[0]).to.have.property('firstName', 'Updated')
    expect(response.body[0]).to.have.property('lastName', 'Name')
    expect(response.body[0]).to.have.property('email', contact2.email)
    expect(response.body[0]).to.have.property('phone', contact2.phoneNumber)
    expect(response.body[0]).to.have.property('street1', contact2.street)
    expect(response.body[0]).to.have.property('street2', '')
    expect(response.body[0]).to.have.property('city', contact2.city)
    expect(response.body[0]).to.have.property('stateProvince', contact2.state)
    expect(response.body[0]).to.have.property('postalCode', contact2.postalCode)
    expect(response.body[0]).to.have.property('country', contact2.country)
  })
  it('get contact after patch', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', 'Updated')
    expect(response.body).to.have.property('lastName', 'Name')
    expect(response.body).to.have.property('email', contact2.email)
    expect(response.body).to.have.property('phone', contact2.phoneNumber)
    expect(response.body).to.have.property('street1', contact2.street)
    expect(response.body).to.have.property('street2', '')
    expect(response.body).to.have.property('city', contact2.city)
    expect(response.body).to.have.property('stateProvince', contact2.state)
    expect(response.body).to.have.property('postalCode', contact2.postalCode)
    expect(response.body).to.have.property('country', contact2.country)
  })
  it('delete contact', async () => {
    const response = await request(process.env.BASE_URL)
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
  })
  it(`get contacts after delete`, async () => {
    const response = await request(process.env.BASE_URL).get('/contacts').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.lengthOf(0)
  })
  it(`get contact after delete`, async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(404)
  })
  it('delete user', async () => {
    const response = await request(process.env.BASE_URL).delete('/users/me').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
  })
  it(`get user profile after delete`, async () => {
    const response = await request(process.env.BASE_URL).get('/users/me').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(401)
  })
})
