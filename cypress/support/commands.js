// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on(
  'uncaught:exception',
  err => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false
    }
    if (test.state === 'failed') {
      let item = runnable
      const nameParts = [runnable.title]

      // Iterate through all parents and grab the titles
      while (item.parent) {
        nameParts.unshift(item.parent.title)
        item = item.parent
      }

      const fullTestName = nameParts.filter(Boolean).join(' -- ') // this is how cypress joins the test title fragments

      const imageUrl = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`

      addContext({ test }, imageUrl)
    }
  },
  Cypress.Screenshot.defaults({
    capture: 'viewport'
  })
)
Cypress.Commands.overwrite('log', (log, message, ...args) => {
  // print the to Cypress Command Log
  // to preserve the existing functionality
  log(message, ...args)
  // send the formatted message down to the Node
  // callback in the cypress.config.js to be printed to the terminal
  cy.task('print', [message, ...args].join(', '), { log: false })
})
Cypress.Commands.add('print', object => {
  return cy.log(object)
})
Cypress.Commands.add('getCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
