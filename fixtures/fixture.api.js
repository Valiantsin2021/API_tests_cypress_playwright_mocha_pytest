import * as base from '@playwright/test'
import { API } from '../utils/ApiHandler.js'
import { Logger } from '../utils/Logger.js'

/**
 * API fixture file
 * @module API fixture file to initiate API instances
 */

/**
 * @typedef {object} APITestArgs - API test args
 * @property {API} api - api instance
 */
/** @type {base.Fixtures<APITestArgs, {}, base.PlaywrightTestArgs, base.PlaywrightWorkerArgs>} */

const extension = {
  api: async ({ request, page }, use, testInfo) => {
    const api = new API(request, page)
    await api.enableLog(process.env.LOG)
    await use(api)
    if (testInfo.status !== testInfo.expectedStatus) {
      Logger.logToFile(`FAILED: ${testInfo.title} -- ${testInfo.status} \n${testInfo.error.message}`)
    }
  }
}
export const test = base.test.extend(extension)
export { expect } from '@playwright/test'
