/// <reference types="cypress" />
import 'cypress-plugin-api'
import { UserBuilder } from '../../utils/dataFactory.js'
for (let i = 0; i < 10; i++) {
  describe(`API users crud ${i}`, () => {
    const user = new UserBuilder().setDefaults().build()
    before(() => {
      let token = ''
    })
    it(`register new user ${user.firstName}`, function () {
      cy.api({
        method: 'POST',
        url: './users',
        body: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password
        }
      }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body.user).to.have.property('firstName', user.firstName)
        expect(response.body.user).to.have.property('lastName', user.lastName)
        expect(response.body.user).to.have.property('email', user.email.toLowerCase())
        this.token = response.body.token
      })
    })

    it(`login registered user ${user.firstName}`, function () {
      cy.api({
        method: 'POST',
        url: './users/login',
        body: {
          email: user.email,
          password: user.password
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.user).to.have.property('firstName', user.firstName)
        expect(response.body.user).to.have.property('lastName', user.lastName)
        expect(response.body.user).to.have.property('email', user.email.toLowerCase())
        this.token = response.body.token
      })
    })

    it(`get user ${user.firstName} profile`, function () {
      cy.api({
        method: 'GET',
        url: './users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        cy.log(response.body)
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', user.firstName)
        expect(response.body).to.have.property('lastName', user.lastName)
        expect(response.body).to.have.property('email', user.email.toLowerCase())
      })
    })

    it(`update user ${user.firstName} profile`, function () {
      cy.api({
        method: 'PATCH',
        url: './users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
          firstName: 'Updated',
          lastName: 'Username',
          email: user.email,
          password: 'myNewPassword'
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', 'Updated')
        expect(response.body).to.have.property('lastName', 'Username')
        expect(response.body).to.have.property('email', user.email.toLowerCase())
      })
    })

    it(`logout user ${user.firstName}`, function () {
      cy.api({
        method: 'POST',
        url: './users/logout',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    })

    it(`get user ${user.firstName} profile after logout`, function () {
      cy.api({
        method: 'GET',
        url: './users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(401)
      })
    })
    it(`login and get updated user ${user.firstName}`, function () {
      cy.api({
        method: 'POST',
        url: './users/login',
        body: {
          email: user.email,
          password: 'myNewPassword'
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.user).to.have.property('firstName', 'Updated')
        expect(response.body.user).to.have.property('lastName', 'Username')
        expect(response.body.user).to.have.property('email', user.email.toLowerCase())
        this.token = response.body.token
      })
    })
    it(`delete user ${user.firstName}`, function () {
      cy.api({
        method: 'DELETE',
        url: './users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    })

    it(`get user ${user.firstName} profile after delete`, function () {
      cy.api({
        method: 'GET',
        url: './users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(401)
      })
    })
  })
}
