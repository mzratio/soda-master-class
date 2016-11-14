import 'aurelia-polyfills' // This is needed to allow aurelia-di to resolve reflect functions

// Services
import DataSource from '../services/data/DataSource'

// Function handlers
import GetDataHandler from '../functions/api/GetDataHandler'
import TokenGeneratorHandler from '../functions/tokenGenerator/TokenGeneratorHandler'

export default function configure(container) {
  // Services
  container.registerSingleton('DataSource', DataSource)

  // Function handlers
  container.registerSingleton('GetDataHandler', GetDataHandler)
  container.registerSingleton('TokenGeneratorHandler', TokenGeneratorHandler)
}
