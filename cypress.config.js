import { defineConfig } from 'cypress'
import 'dotenv/config'

export default defineConfig({
  reporter: 'spec',
  e2e: {
    baseUrl: 'https://thinking-tester-contact-list.herokuapp.com',
    supportFile: false,
    fixturesFolder: false,
    setupNodeEvents(on, config) {
      on('task', {
        print(s) {
          console.log(s)
          return null
        }
      })
      return config
    },
    env: {
      ...process.env
    },
    chromeWebSecurity: false,
    experimentalStudio: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    waitForAnimations: true,
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    watchForFileChanges: false
  }
})
