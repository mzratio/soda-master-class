import configureContainer from './configureContainer'

let globalContainer

export function init(container) {
  globalContainer = container
  configureContainer(container)
}

export { globalContainer }
