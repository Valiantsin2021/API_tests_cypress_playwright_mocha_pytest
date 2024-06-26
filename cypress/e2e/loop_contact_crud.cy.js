/// <reference types="cypress" />
import 'cypress-plugin-api'
import { UserBuilder } from '../../utils/dataFactory.js'
for (let i = 0; i < 10; i++) {
  const contact1 = new UserBuilder().setDefaults().build()
  const contact2 = new UserBuilder().setDefaults().build()
  const user = new UserBuilder().setDefaults().build()
  describe(`API contacts crud ${i}`, () => {
    before(() => {
      let token = ''
      let contactId = ''
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
        expect(response.body.user).to.have.property('email', user.email)
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
        expect(response.body.user).to.have.property('email', user.email)
        this.token = response.body.token
      })
    })
    it(`create contact for ${user.firstName}`, function () {
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
        expect(response.body).to.have.property('email', contact1.email)
        this.contactId = response.body._id
      })
    })
    it(`get user ${user.firstName} contacts`, function () {
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

    it(`get single contact for ${user.firstName}`, function () {
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
        expect(response.body).to.have.property('email', contact1.email)
        expect(response.body).to.have.property('phone', contact1.phoneNumber)
        expect(response.body).to.have.property('street1', contact1.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact1.city)
        expect(response.body).to.have.property('stateProvince', contact1.state)
        expect(response.body).to.have.property('postalCode', contact1.postalCode)
        expect(response.body).to.have.property('country', contact1.country)
      })
    })
    it(`update contact for ${user.firstName}`, function () {
      cy.api({
        method: 'PUT',
        url: './contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
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
        }
      }).then(response => {
        expect(response.status).to.eq(200)
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
    })

    it(`get contacts for ${user.firstName} after update`, function () {
      cy.api({
        method: 'GET',
        url: './contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(1)
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
    })

    it(`get contact for ${user.firstName} after update`, function () {
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
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property('postalCode', contact2.postalCode)
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`patch contact for ${user.firstName}`, function () {
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
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property('postalCode', contact2.postalCode)
        expect(response.body).to.have.property('country', contact2.country)
      })
    })

    it(`get contacts for ${user.firstName} after patch`, function () {
      cy.api({
        method: 'GET',
        url: './contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(1)
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
    })

    it(`get contact for ${user.firstName} after patch`, function () {
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
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property('postalCode', contact2.postalCode)
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`delete contact for ${user.firstName}`, function () {
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
    it(`get contacts for ${user.firstName} after delete`, function () {
      cy.api({
        method: 'GET',
        url: './contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(0)
      })
    })
    it(`get contact for ${user.firstName} after delete`, function () {
      cy.api({
        method: 'GET',
        url: './contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(404)
      })
    })
    it(`delete registered user ${user.firstName}`, function () {
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
