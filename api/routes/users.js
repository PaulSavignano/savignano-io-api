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

users.post('/:brandName', add)
users.get('/:brandName', authenticate([ 'user', 'admin', 'owner' ]), get)
users.patch('/:brandName', authenticate([ 'user', 'admin', 'owner' ]), update)
users.delete('/:brandName', authenticate([ 'user', 'admin', 'owner' ]), remove)
users.post('/:brandName/signin', signin)
users.post('/:brandName/recovery', recovery)
users.post('/:brandName/reset/:resetToken', reset)

users.post('/:brandName/contact', contact)
users.post('/:brandName/request-estimate', requestEstimate)

users.post('/:brandName/admin', authenticate([ 'owner' ]), adminAdd)
users.patch('/:brandName/admin/:_id', authenticate([ 'owner']), adminUpdate)
users.delete('/:brandName/admin/:_id', authenticate([ 'owner' ]), adminRemove)

export default users
