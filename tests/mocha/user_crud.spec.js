// @ts-nocheck
import { expect } from 'chai'
import dotenv from 'dotenv'
import request from 'supertest'
import { user } from '../../utils/dataFactory.js'
dotenv.config()
let token = ''
describe(`Supertest users API`, async () => {
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
    expect(response.body.user).to.have.property('email', user.email.toLowerCase())
  })
  it('login registered user', async () => {
    const response = await request(process.env.BASE_URL).post('/users/login').send({
      email: user.email,
      password: user.password
    })
    expect(response.status).to.equal(200)
    expect(response.body.user).to.have.property('firstName', user.firstName)
    expect(response.body.user).to.have.property('lastName', user.lastName)
    expect(response.body.user).to.have.property('email', user.email.toLowerCase())
    token = response.body.token
  })
  it(`get user profile`, async () => {
    const response = await request(process.env.BASE_URL).get('/users/me').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', user.firstName)
    expect(response.body).to.have.property('lastName', user.lastName)
    expect(response.body).to.have.property('email', user.email.toLowerCase())
  })
  it(`update user profile`, async () => {
    const response = await request(process.env.BASE_URL)
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Updated',
        lastName: 'Username',
        email: user.email,
        password: 'myNewPassword'
      })
    expect(response.status).to.equal(200)
    expect(response.body).to.have.property('firstName', 'Updated')
    expect(response.body).to.have.property('lastName', 'Username')
    expect(response.body).to.have.property('email', user.email.toLowerCase())
  })
  it(`logout user`, async () => {
    const response = await request(process.env.BASE_URL).post('/users/logout').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(200)
  })
  it(`get user profile after logout`, async () => {
    const response = await request(process.env.BASE_URL).get('/users/me').set('Authorization', `Bearer ${token}`)
    expect(response.status).to.equal(401)
  })
  it('login registered user after logout', async () => {
    const response = await request(process.env.BASE_URL).post('/users/login').send({
      email: user.email,
      password: 'myNewPassword'
    })
    expect(response.status).to.equal(200)
    expect(response.body.user).to.have.property('firstName', 'Updated')
    expect(response.body.user).to.have.property('lastName', 'Username')
    expect(response.body.user).to.have.property('email', user.email.toLowerCase())
    token = response.body.token
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
