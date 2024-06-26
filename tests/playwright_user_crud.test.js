// @ts-nocheck
import { expect, test } from '../fixtures/fixture.api.js'
import { user } from '../utils/dataFactory.js'
let token = ''
test.describe.serial(`Supertest users API`, async () => {
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
  test(`get user profile`, async ({ api }) => {
    const response = await api.getReq('/users/me', token)
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('firstName', user.firstName)
    expect(body).toHaveProperty('lastName', user.lastName)
    expect(body).toHaveProperty('email', user.email)
  })
  test(`update user profile`, async ({ api }) => {
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
    expect(body).toHaveProperty('email', user.email)
  })
  test(`logout user`, async ({ api }) => {
    const response = await api.postReq('/users/logout', {}, token)
    expect(response.status()).toBe(200)
  })
  test(`get user profile after logout`, async ({ api }) => {
    const response = await api.getReq('/users/me', token)
    expect(response.status()).toBe(401)
  })
  test(`login and get updated user`, async ({ api }) => {
    const response = await api.postReq('/users/login', {
      email: user.email,
      password: 'myNewPassword'
    })
    const body = await response.json()
    expect(response.status()).toBe(200)
    expect(body.user).toHaveProperty('firstName', 'Updated')
    expect(body.user).toHaveProperty('lastName', 'Username')
    expect(body.user).toHaveProperty('email', user.email)
    token = body.token
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
