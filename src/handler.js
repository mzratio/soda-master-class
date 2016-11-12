import { Container } from 'aurelia-dependency-injection'
import { init } from './di'
import handler from './functions/handlerInvoker'

let container = new Container()
container.makeGlobal()
init(container)

const getDataHandler = (event, context, cb) => {
  return handler(event, context, 'GetDataHandler', cb)
}

const tokenGeneratorHandler = (event, context, cb) => {
  return handler(event, context, 'TokenGeneratorHandler', cb)
}

export {
  getDataHandler,
  tokenGeneratorHandler
}
