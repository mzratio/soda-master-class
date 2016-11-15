
import Promise from 'bluebird'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
import expect, { createSpy } from 'expect'
import ContentApiHandler from '../../../../src/functions/api/GetDataHandler'

describe('GetDataHandler tests', () => {
  let handler, mockDataSource, event, context, decodedJwt
  const jwtSecret = 'soda_academy_secret'

  beforeEach(() => {
    event = {}
    context = {}
    _.set(event, 'headers.x-access-token', jwt.sign({ channel: 'my_tenant', platform: 'my_platform' }, jwtSecret))
    _.set(event, 'headers.Accept', 'application/json')
    decodedJwt = jwt.decode(event.headers['x-access-token'])

    mockDataSource = {
      getData: createSpy().andReturn(Promise.resolve())
    }
    handler = new ContentApiHandler(mockDataSource)
  })

  describe('when execute is called', () => {
    it('should get data from DataSource', () => {
      return handler.execute(event)
        .then(() => {
          expect(mockDataSource.getData).toHaveBeenCalled()
        })
    })

    // it('should return 500 if getting data fails', () => {
    //   const expectedError = new Error('Error from getData')
    //   mockDataSource.getData.andReturn(Promise.reject(expectedError))
    //   return handler.execute(event)
    //     .then((res) => {
    //       expect(res.statusCode).toEqual(500)
    //     })
    // })
  })
})
