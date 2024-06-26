// @ts-nocheck
import fs from 'fs'
import { expect, test } from '../fixtures/fixture.api.js'
const users = JSON.parse(fs.readFileSync('./1.json'))
let token = ''
// const users = [
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build(),
//   new UserBuilder().setDefaults().build()
// ]
for (let user of users) {
  test.describe.serial(`Supertest users API user ${user.firstName}`, async () => {
    test(`register new user ${user.firstName}`, async ({ api }) => {
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
      expect(body.user).toHaveProperty('email', user.email.toLowerCase())
      token = body.token
    })
    test(`login registered user ${user.firstName}`, async ({ api }) => {
      const response = await api.postReq('/users/login', {
        email: user.email,
        password: user.password
      })
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.user).toHaveProperty('firstName', user.firstName)
      expect(body.user).toHaveProperty('lastName', user.lastName)
      expect(body.user).toHaveProperty('email', user.email.toLowerCase())
      token = body.token
    })
    test(`get user ${user.firstName} profile`, async ({ api }) => {
      const response = await api.getReq('/users/me', token)
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', user.firstName)
      expect(body).toHaveProperty('lastName', user.lastName)
      expect(body).toHaveProperty('email', user.email.toLowerCase())
    })
    test(`update user ${user.firstName} profile`, async ({ api }) => {
      const response = await api.patchReq(
        '/users/me',
        {
          firstName: 'Updated',
          lastName: 'Username',
          email: user.email,
          password: 'myNewPassword'
        },
        token
      )
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body).toHaveProperty('firstName', 'Updated')
      expect(body).toHaveProperty('lastName', 'Username')
      expect(body).toHaveProperty('email', user.email.toLowerCase())
    })
    test(`logout user ${user.firstName}`, async ({ api }) => {
      const response = await api.postReq('/users/logout', {}, token)
      expect(response.status()).toBe(200)
    })
    test(`get user ${user.firstName} profile after logout`, async ({ api }) => {
      const response = await api.getReq('/users/me', token)
      expect(response.status()).toBe(401)
    })
    test(`login and get updated user ${user.firstName}`, async ({ api }) => {
      const response = await api.postReq('/users/login', {
        email: user.email,
        password: 'myNewPassword'
      })
      const body = await response.json()
      expect(response.status()).toBe(200)
      expect(body.user).toHaveProperty('firstName', 'Updated')
      expect(body.user).toHaveProperty('lastName', 'Username')
      expect(body.user).toHaveProperty('email', user.email.toLowerCase())
      token = body.token
    })
    test(`delete registered user ${user.firstName}`, async ({ api }) => {
      const response = await api.deleteReq('/users/me', token)
      expect(response.status()).toBe(200)
    })
    test(`get user ${user.firstName} profile after delete`, async ({ api }) => {
      const response = await api.getReq('/users/me', token)
      expect(response.status()).toBe(401)
    })
  })
}
