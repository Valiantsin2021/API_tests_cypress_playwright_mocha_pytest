import { request } from '@playwright/test'
import { Logger } from './Logger.js'

export class API {
  /**
   * @property {Function} constructor class constructor
   * @param {import('@playwright/test').APIRequestContext} request request passed in a constructor of the API class
   */
  bool = true
  constructor(request, page = null) {
    /**@type {import('@playwright/test').APIRequestContext} request passed in a constructor */
    this.request = request
    /**@type {import('@playwright/test').Page} page page passed in a constructor */
    this.page = page
  }
  async enableLog(bool) {
    this.bool = bool
  }
  async #makeRequest(endpoint, method, reqBody = null, token = null, params = null, formUrl = null, bool = this.bool) {
    bool ? Logger.logRequest(endpoint, reqBody) : ''
    const res = await this.request[method](endpoint, {
      headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {},
      data: reqBody ? reqBody : undefined,
      form: formUrl ? formUrl : undefined,
      params: params ? params : undefined
    })
    try {
      bool ? Logger.logResponse(res.status(), await res.json()) : ''
    } catch (err) {
      bool ? Logger.logResponse(res.status(), await res.text()) : ''
    }
    return res
  }
  async postReq(endpoint, reqBody = null, token = null, params = null, formUrl = null) {
    return await this.#makeRequest(endpoint, 'post', reqBody, token, params, formUrl)
  }

  async getReq(endpoint, token = null, params = null) {
    return await this.#makeRequest(endpoint, 'get', null, token, params)
  }

  async putReq(endpoint, reqBody = null, token = null, params = null, formUrl = null) {
    return await this.#makeRequest(endpoint, 'put', reqBody, token, params, formUrl)
  }

  async patchReq(endpoint, reqBody = null, token = null, params = null, formUrl = null) {
    return await this.#makeRequest(endpoint, 'patch', reqBody, token, params, formUrl)
  }

  async deleteReq(endpoint, token = null, params = null) {
    return await this.#makeRequest(endpoint, 'delete', null, token, params)
  }
  /**
   * Create a request with token from localStorage
   */
  async createRequestWithToken(baseURL) {
    const token = await this.page.evaluate('localStorage["token"]')
    const apiRequest = await request.newContext({
      baseURL: baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return apiRequest
  }
  /**
   * Wait for response from url contains the api url
   * @param apiUrl api url to wait until get the response
   * @param statusCode Status code returned by the api
   * @returns responsePromise
   */
  async waitForResponse(apiUrl, statusCode = 200, method) {
    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes(apiUrl) && response.request().method() === method && response.status() === statusCode
    )
    return responsePromise
  }
  /**
   * An asynchronous function to mock an API response for a given URL with the provided JSON data.
   *
   * @param {string} url - the URL for which to mock the API response
   * @param {any} jsonData - the JSON data to be used for mocking the API response
   */
  async mockApi(url, jsonData) {
    await this.page.route(url, async route => {
      await route.fulfill({ body: JSON.stringify(jsonData) })
    })
  }
  /**
   * Asynchronously adds a block to the given URI.
   *
   * @param {string} uri - The URI to block.
   * @return {Promise<void>} A promise that resolves when the block is added.
   */
  async blockAdd(uri) {
    await this.page.route('**/*', route => {
      if (route.request().url().startsWith(uri)) {
        return route.abort()
      }
      return route.continue()
    })
  }
}
