import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  update,
  remove,
  signin,
  recovery,
  reset,
  signout,
  contact,
  requestEstimate
} from '../controllers/user'
import {
  adminAdd,
  adminRemove,
  adminUpdate,
} from '../controllers/userAdmin'

const users = express.Router()

users.post('/:clientName', add)
users.get('/:clientName', authenticate([ 'user', 'admin', 'owner' ]), get)
users.patch('/:clientName', authenticate([ 'user', 'admin', 'owner' ]), update)
users.delete('/:clientName', authenticate([ 'user', 'admin', 'owner' ]), remove)
users.post('/:clientName/signin', signin)
users.post('/:clientName/recovery', recovery)
users.post('/:clientName/reset/:resetToken', reset)

users.post('/:clientName/contact', contact)
users.post('/:clientName/request-estimate', requestEstimate)

users.post('/:clientName/admin', authenticate([ 'owner' ]), adminAdd)
users.patch('/:clientName/admin/:_id', authenticate([ 'owner']), adminUpdate)
users.delete('/:clientName/admin/:_id', authenticate([ 'owner' ]), adminRemove)

export default users
