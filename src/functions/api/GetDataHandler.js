import Promise from 'bluebird'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import ApiHandler from '../ApiHandler'

export default class GetDataHandler extends ApiHandler {
  static inject() { return ['DataSource'] }

  constructor(dataSource) {
    super()
    this.dataSource = dataSource
  }

  _getResponse(event) {
    return this.dataSource.getData()
  }
}
