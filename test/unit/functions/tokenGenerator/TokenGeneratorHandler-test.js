import _ from 'lodash'
import jwt from 'jsonwebtoken'
import expect from 'expect'
import TokenGeneratorHandler from '../../../../src/functions/tokenGenerator/TokenGeneratorHandler'

describe('TokenGeneratorHandler tests (rtv)', () => {
  let handler, event, context
  const jwtSecret = 'soda_academy_secret'

  beforeEach(() => {
    event = {}
    context = {}
    handler = new TokenGeneratorHandler()
  })

  describe('when execute is called', () => {
    it('should fail if event body is not provided', () => {
      _.set(event, 'body', undefined)
      return handler.execute(event, context)
        .then((response) => {
          expect(JSON.parse(response.body).statusCode).toEqual(500)
        })
    })

    it('should respond with a jwt that has payload set to the data passed via body', () => {
      _.set(event, 'body', JSON.stringify({
        tenantId: 'brs',
        prop1: 'prop1_value',
        prop2: 'prop2_value',
        prop3: 'prop3_value'
      }))

      return handler.execute(event, context)
        .then((response) => {
          const body = JSON.parse(response.body)
          expect(body.jwt).toExist()

          let contents = jwt.verify(body.jwt, jwtSecret)
          expect(contents).toMatch({
            tenantId: 'brs',
            prop1: 'prop1_value',
            prop2: 'prop2_value',
            prop3: 'prop3_value'
          })
        })
    })
  })
})
