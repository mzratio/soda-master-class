import Promise from 'bluebird'
import loggerProvider from '../services/loggerProvider'

export default class BaseHandler {
  constructor() {
    this.handlerName = this.constructor.name
    this.logger = loggerProvider(this.handlerName)
    this.JSON = JSON
  }

  execute(event, context) {
    this.logger.info(`Executing handler ${this.handlerName}`)
    return Promise.try(() => {
      return this._doExecute(event, context)
    })
  }

  _doExecute(event) {
    this.logger.info('Remember to overwrite this method if you need to provide custom handling logic.')
  }
}
