import _ from 'lodash'
import loggerProvider from '../loggerProvider'

let logger = loggerProvider('DataSource')

export default class DataSource {
  constructor() {
    logger.info('Initialize DataSource')
  }

  getData() {
    const items = _.times(20, (index) => {
      return {
        'id': `video_${index}`,
        'title': `video ${index} from mock API`,
        'thumbnail': `http://fpoimg.com/768x432?bg_color=dddddd&text=Image_${index}`
      }
    })
    return items
  }
}
