import Promise from 'bluebird'
import stringify from 'json-stringify-safe'
import { globalContainer as container } from '../di'
import loggerProvider from '../services/loggerProvider'

let logger = loggerProvider('handlerInvoker')

function invoke(event, context, handlerKey) {
  logger.info('Entering invoke\n', stringify({ event, context, handlerKey }))
  return Promise.try(() => {
    let handlerInstance = container.get(handlerKey)

    logger.info('Invoking handler\n', handlerInstance.constructor.name)
    return handlerInstance.execute(event, context)
  }).catch((err) => {
    logger.error(err, (loggerError) => {
      // If for any reasons the logger throws an error, log it in the console
      if (loggerError) {
        console.log('Logger error: ' + loggerError)
      }
    })
    throw err
  })
}

export { logger }

export default function handler(event, context, handlerKey, cb) {
  return invoke(event, context, handlerKey).then((response) => {
    cb(null, response)
  }).catch(cb)
}
