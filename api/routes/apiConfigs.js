import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  update,
  remove,
} from '../controllers/apiConfig'

const apiConfigs = express.Router()

apiConfigs.post('/:clientName', authenticate([ 'owner' ]), add)
apiConfigs.get('/:clientName', authenticate([ 'owner' ]), get)
apiConfigs.patch('/:clientName/:_id', authenticate([ 'owner' ]), update)
apiConfigs.delete('/:clientName/:_id', authenticate([ 'owner' ]), remove)

export default apiConfigs
