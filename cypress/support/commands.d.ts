declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to open custom url
     * @example cy.print({ foo: 'bar' })
     */
    print(object)
    /**
     * Custom command to open get element by data-cy attribute
     * @example cy.getCy('hello)
     * @param {string} attr - data-cy attribute
     */
    getCy(attr)
  }
}
