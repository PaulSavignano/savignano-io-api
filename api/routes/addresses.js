import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  adminAdd,
  adminUpdate,
  adminRemove,
  get,
  remove,
  update
} from '../controllers/address'

const addresses = express.Router()

addresses.post('/:brandName', authenticate([ 'admin', 'owner', 'user' ]), add)
addresses.post('/:brandName/admin/:userId', authenticate([ 'owner' ]), adminAdd)
addresses.patch('/:brandName/:_id', authenticate([ 'admin', 'owner', 'user' ]), update)
addresses.patch('/:brandName/admin/:_id', authenticate([ 'owner' ]), adminUpdate)
addresses.delete('/:brandName/:_id', authenticate([ 'admin', 'owner', 'user' ]), remove)
addresses.delete('/:brandName/admin/:_id', authenticate([ 'owner' ]), adminRemove)

export default addresses
