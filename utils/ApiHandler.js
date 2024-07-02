import { Logger } from './Logger.js'

export class API {
  /**
   * @property {Function} constructor class constructor
   * @param {import('@playwright/test').APIRequestContext} request request passed in a constructor of the API class
   */
  bool = true
  constructor(request) {
    /**@type {import('@playwright/test').APIRequestContext} request passed in a constructor */
    this.request = request
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
}
