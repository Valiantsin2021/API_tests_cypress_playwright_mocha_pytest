/// <reference types="cypress" />
import 'cypress-plugin-api'
import { user, UserBuilder } from '../../utils/dataFactory.js'
const contact1 = new UserBuilder().setDefaults().build()
const contact2 = new UserBuilder().setDefaults().build()
describe('API contacts crud', () => {
  before(() => {
    let token = ''
    let contactId = ''
  })
  it(`redister new user`, function () {
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

  it(`login registered user`, function () {
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
  it(`create contact`, function () {
    cy.api({
      method: 'POST',
      url: './contacts',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: {
        firstName: contact1.firstName,
        lastName: contact1.lastName,
        birthdate: contact1.dateOfBirth,
        email: contact1.email,
        phone: contact1.phoneNumber,
        street1: contact1.street,
        street2: '',
        city: contact1.city,
        stateProvince: contact1.state,
        postalCode: contact1.postalCode,
        country: contact1.country
      }
    }).then(response => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('firstName', contact1.firstName)
      expect(response.body).to.have.property('lastName', contact1.lastName)
      expect(response.body).to.have.property('email', contact1.email.toLowerCase())
      this.contactId = response.body._id
    })
  })
  it(`get contacts`, function () {
    cy.api({
      method: 'GET',
      url: './contacts',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.eq(1)
    })
  })

  it(`get contact`, function () {
    cy.api({
      method: 'GET',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('firstName', contact1.firstName)
      expect(response.body).to.have.property('lastName', contact1.lastName)
      expect(response.body).to.have.property('email', contact1.email.toLowerCase())
    })
  })
  it(`update contact`, function () {
    cy.api({
      method: 'PATCH',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: {
        firstName: contact2.firstName,
        lastName: contact2.lastName,
        email: contact2.email
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('firstName', contact2.firstName)
      expect(response.body).to.have.property('lastName', contact2.lastName)
      expect(response.body).to.have.property('email', contact2.email.toLowerCase())
    })
  })

  it(`get contacts after update`, function () {
    cy.api({
      method: 'GET',
      url: './contacts',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.eq(1)
    })
  })

  it(`get contact after update`, function () {
    cy.api({
      method: 'GET',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('firstName', contact2.firstName)
      expect(response.body).to.have.property('lastName', contact2.lastName)
      expect(response.body).to.have.property('email', contact2.email.toLowerCase())
    })
  })
  it(`patch contact`, function () {
    cy.api({
      method: 'PATCH',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: {
        firstName: 'Updated',
        lastName: 'Name',
        email: contact2.email,
        phone: contact2.phoneNumber
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('firstName', 'Updated')
      expect(response.body).to.have.property('lastName', 'Name')
      expect(response.body).to.have.property('email', contact2.email.toLowerCase())
    })
  })

  it(`get contacts after patch`, function () {
    cy.api({
      method: 'GET',
      url: './contacts',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.eq(1)
    })
  })

  it(`get contact after patch`, function () {
    cy.api({
      method: 'GET',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('firstName', 'Updated')
      expect(response.body).to.have.property('lastName', 'Name')
      expect(response.body).to.have.property('email', contact2.email.toLowerCase())
    })
  })
  it(`delete contact`, function () {
    cy.api({
      method: 'DELETE',
      url: './contacts/' + this.contactId,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(response => {
      expect(response.status).to.eq(200)
    })
  })
  it(`delete user`, function () {
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

  it(`get user profile after delete`, function () {
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
