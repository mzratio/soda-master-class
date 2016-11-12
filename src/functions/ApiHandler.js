import Promise from 'bluebird'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import BaseHandler from './BaseHandler'

export default class ApiHandler extends BaseHandler {

  _doExecute(event, context) {
    if (!this.ignoreAccept) {
      this.logger.info('Validating "Accept" header')
      if (!this._validateAcceptHeader(event)) {
        this.logger.info('Invalid "Accept" header found. The operation will be rejected')
        return Promise.resolve(this._build406Response())
      }
    }

    if (!this.ignoreToken) {
      const token = _.get(event, 'headers.x-access-token')
      const payload = this._validateToken(token)
      this.logger.info('Validating "x-access-token" header')
      if (_.isNil(payload)) {
        this.logger.info('Invalid "x-access-token" header found. The operation will be rejected')
        return Promise.resolve(this._build401Response())
      }
    }

    this.logger.info('Validating other headers')
    const headerErr = this._validateHeaders(event, context)
    if (!_.isNil(headerErr)) {
      this.logger.info('One of the other headers validation failed. The operation will be rejected')
      return Promise.resolve(this._build500Response())
    }

    this.logger.info('Calling _getResponse()')
    return Promise.try(() => {
      return this._getResponse(event, context)
    }).then((response) => {
      let httpStatusOverride = 200
      if (!_.isNil(response)) {
        if (!_.isNil(response) && !_.isNil(response.httpStatusOverride) && _.isNumber(response.httpStatusOverride)) {
          httpStatusOverride = response.httpStatusOverride
        }
        delete response.httpStatusOverride // this remove the override from the response
      }

      this.logger.info('_getResponse() successfully executed. HTTP status to be returned - ', httpStatusOverride)
      return this._wrapResponse(httpStatusOverride, null, response)
    }).catch((err) => {
      if (err.status === 404) {
        this.logger.info('_getResponse() thrown a 404 [Not Found] error - ', err.message)
        return this._build404Response()
      }
      this.logger.info('_getResponse() thrown an error - ', err.message)
      return this._build500Response()
    }).then((response) => {
      return response
    })
  }

  _getResponse() {
    this.logger.info('Remember to overwrite this method if you need to get data from data source.')
  }

  _validateHeaders(event, context) {
    this.logger.info('Remember to overwrite this method if you need to validate headers.')
  }

  _validateAcceptHeader(event) {
    const acceptHeaderVal = _.get(event, 'headers.Accept')
    return acceptHeaderVal === 'application/json'
  }

  _validateToken(token) {
    if (_.isNil(token)) {
      return
    }

    let payload
    const jwtSecret = 'soda_academy_secret'
    try {
      payload = jwt.verify(token, jwtSecret)
    } catch (err) {
      return
    }
    return payload
  }

  _wrapResponse(statusCode, headers, responseBody) {
    const response = {
      statusCode: statusCode,
      headers: {
      },
      body: JSON.stringify(responseBody)
    }

    const serviceName = 'soda-master-class'
    const stage = 'dev'
    response.headers['x-rtv-service'] = `${serviceName}-${stage}`
    response.headers['Access-Control-Allow-Origin'] = '*'

    _.merge(response.headers, headers)
    return response
  }

  _buildErrorResponse(statusCode, error, message) {
    return {
      statusCode,
      error,
      message
    }
  }

  _build500Response() {
    return this._wrapResponse(500, null, this._buildErrorResponse(500, 'Internal Server Error',
      'The server encountered an internal error. Please retry the request.'))
  }

  _build406Response() {
    return this._wrapResponse(406, null, this._buildErrorResponse(406, 'Not Acceptable', 'Invalid Accept Type'))
  }

  _build401Response() {
    return this._wrapResponse(401, null, this._buildErrorResponse(401, 'Unauthorized', 'Invalid Access Token'))
  }

  _build404Response() {
    return this._wrapResponse(404, null, this._buildErrorResponse(404, 'Not Found'))
  }
}
