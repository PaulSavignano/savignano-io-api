import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  update,
  remove,
} from '../controllers/apiConfig'

const apiConfigs = express.Router()

apiConfigs.post('/:brandName', authenticate([ 'owner' ]), add)
apiConfigs.get('/:brandName', authenticate([ 'owner' ]), get)
apiConfigs.patch('/:brandName/:_id', authenticate([ 'owner' ]), update)
apiConfigs.delete('/:brandName/:_id', authenticate([ 'owner' ]), remove)

export default apiConfigs
