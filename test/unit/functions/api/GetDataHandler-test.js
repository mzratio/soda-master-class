
import Promise from 'bluebird'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import expect, { createSpy } from 'expect'
import ContentApiHandler from '../../../../src/functions/api/GetDataHandler'

describe('GetDataHandler tests', () => {
  let handler, mockCacheService, mockConfigService, event, context, decodedJwt
  const jwtSecret = 'my_alki_secret'

  beforeEach(() => {
    event = {}
    context = {}
    _.set(event, 'headers.x-access-token', jwt.sign({ channel: 'my_tenant', platform: 'my_platform' }, jwtSecret))
    _.set(event, 'headers.Accept', 'application/json')
    decodedJwt = jwt.decode(event.headers['x-access-token'])

    mockCacheService = {
      getData: createSpy().andReturn(Promise.resolve())
    }
    mockConfigService = {
      get: () => { return jwtSecret }
    }
    handler = new ContentApiHandler(mockCacheService, mockConfigService)
  })

  describe('when execute is called', () => {
  })
})
