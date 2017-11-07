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

addresses.post('/:clientName', authenticate([ 'admin', 'owner', 'user' ]), add)
addresses.post('/:clientName/admin/:userId', authenticate([ 'owner' ]), adminAdd)
addresses.patch('/:clientName/:_id', authenticate([ 'admin', 'owner', 'user' ]), update)
addresses.patch('/:clientName/admin/:_id', authenticate([ 'owner' ]), adminUpdate)
addresses.delete('/:clientName/:_id', authenticate([ 'admin', 'owner', 'user' ]), remove)
addresses.delete('/:clientName/admin/:_id', authenticate([ 'owner' ]), adminRemove)

export default addresses
