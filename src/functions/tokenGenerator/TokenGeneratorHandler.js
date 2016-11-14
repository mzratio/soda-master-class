import _ from 'lodash'
import ApiHandler from '../ApiHandler'
import jwt from 'jsonwebtoken'

export default class TokenGeneratorHandler extends ApiHandler {
  constructor() {
    super()
    this.ignoreToken = true
    this.ignoreAccept = true
  }

  _getResponse(event) {
    let body
    if (!_.isNil(event.body)) {
      body = this.JSON.parse(event.body)
    }

    const error = assertClientData(body)
    if (!_.isNil(error)) {
      return Promise.reject(error)
    }

    const response = {
      jwt: this._createjwt(body)
    }
    return Promise.resolve(response)
  }

  _createjwt(body) {
    const jwtSecret = 'soda_academy_secret'
    let targetPayload = {}
    _.forOwn(body, (value, key) => {
      targetPayload[key] = value
    })
    return jwt.sign(targetPayload, jwtSecret)
  }
}

function assertClientData(body) {
  if (!body) {
    return new Error('Must provide client data in POST body')
  }

  return
}
