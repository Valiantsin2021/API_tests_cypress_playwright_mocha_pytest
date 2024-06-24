//@ts-check

import eyes from 'eyes'
import fs from 'fs'

/**
 * Logger utility for pretify request-response output
 */

export class Logger {
  /**
   * Logs a message to a specified log file or the default 'app.log'.
   * The log message includes a timestamp.
   *
   * @param {string} message - The message to be logged.
   * @param {string} [logfile='./fixtures/temp/fails.log'] - The name of the log file. Defaults to 'app.log'.
   * @throws {Error} Throws an error if there is an issue writing the log to the file.
   * @returns {void}
   * @static
   * @example
   * // Example Usage:
   * Logger.log('This is a log message');
   * // This will append a log entry to 'app.log' with the current timestamp and the specified message.
   *
   * @example
   * // Example Usage with custom log file name:
   * Logger.log('Custom log message', 'custom.log');
   * // This will append a log entry to 'custom.log' with the current timestamp and the specified message.
   */
  static logToFile(message, logfile = './fixtures/temp/fails.log') {
    Logger.applyColorization()
    const date = new Date().toISOString()
    try {
      fs.appendFileSync(logfile, `${date} - ${message}\n`)
      console.log(Logger.green(`Log written to ${logfile}`))
    } catch (err) {
      console.error(`Failed write log to file ${logfile} with error: ${err.message}`)
      throw err
    }
  }
  static inspect = eyes.inspector({
    // @ts-ignore
    maxLength: false,
    pretty: true,
    hideFunctions: false,
    stream: process.stdout
  })
  static RED = '\x1b[31m'
  static GREEN = '\x1b[32m'
  static YELLOW = '\x1b[33m'
  static BLUE = '\x1b[34m'
  static MAGENTA = '\x1b[35m'
  static CYAN = '\x1b[36m'
  static WHITE = '\x1b[37m'
  static RESET = '\x1b[0m'

  static applyColorization() {
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info
    const originalLog = console.log

    console.error = (...args) => {
      originalError(Logger.RED, ...args, Logger.RESET)
    }

    console.warn = (...args) => {
      originalWarn(Logger.YELLOW, ...args, Logger.RESET)
    }

    console.info = (...args) => {
      originalInfo(Logger.BLUE, ...args, Logger.RESET)
    }

    console.log = (...args) => {
      originalLog(Logger.WHITE, ...args, Logger.RESET)
    }
  }

  static green(...args) {
    console.log(Logger.GREEN, ...args, Logger.RESET)
  }

  static magenta(...args) {
    console.log(Logger.MAGENTA, ...args, Logger.RESET)
  }

  static cyan(...args) {
    console.log(Logger.CYAN, ...args, Logger.RESET)
  }
  /**
   * Logs a request to the console based on the provided URL and data.
   * @property {Function} logRequest Logs a request to the console based on the provided URL and data.
   * @returns {Promise<void>}
   * @param {string} URL - Request URL.
   * @param {object} data - Request body.
   */

  static async logRequest(URL, data) {
    Logger.applyColorization()
    console.info(`\n<<<<<<<<<<<<<<<<< SENDING REQUEST <<<<<<<<<<<<<<<<<\nRequest URL: \n${URL}\nRequest data: \n`)
    const toLog = { ...data }
    toLog?.password ? (toLog.password = '******') : null
    toLog?.token ? (toLog.token = '******') : null
    this.inspect(toLog)
    console.info('<<<<<<<<<<<<<<<<< END OF REQUEST <<<<<<<<<<<<<<<<<')
  }

  /**
   * Logs a response to the console based on the provided status and data.
   * @property {Function} logResponse Logs a response to the console based on the provided status and data.
   * @returns {Promise<void>}
   * @param {string|number} status - Response status.
   * @param {object} data - Response body.
   */

  static async logResponse(status, data) {
    Logger.applyColorization()
    console.info(
      `\n<<<<<<<<<<<<<<<<< RECEIVING RESPONSE <<<<<<<<<<<<<<<<<\nResponse status: \n${status}\nResponse data: \n`
    )
    const toLog = { ...data }
    toLog?.token ? (toLog.token = '******') : null
    this.inspect(toLog)
    console.info('<<<<<<<<<<<<<<<<< END OF RESPONSE <<<<<<<<<<<<<<<<<')
  }

  /**
   * Logs requests and responses occurred on the UI testing page.
   * @property {Function} logBrowserConsole Logs requests and responses occurred on the UI testing page.
   * @returns {Promise<void>}
   * @param {object} page - Page instance to listen for requests, responses, and console messages.
   */

  static async logBrowserConsole(page) {
    Logger.applyColorization()
    // page.on('request', request => console.log(this.color.outgoingRequest('>>', request.method(), request.url())))
    // page.on('response', response => console.log(this.color.incomingRequest('<<', response.status(), response.url())))
    page.on('pageerror', async exception => {
      console.error(`Uncaught exception: "${exception}"`)
    })
    page.on('console', async messsage => {
      console.error(`BROWSER: ${messsage.type()} with message ${messsage.text()}`)
    })
  }
}
Logger.applyColorization()
