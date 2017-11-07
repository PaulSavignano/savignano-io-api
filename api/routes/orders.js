import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  getAdmin,
  update,
  remove
} from '../controllers/order'

const orders = express.Router()

orders.post('/:clientName', authenticate(['user']), add)
orders.get('/:clientName', authenticate(['user']), get)
orders.get('/:clientName/admin', authenticate(['admin', 'owner']), getAdmin)
orders.patch('/:clientName/:_id', authenticate(['admin']), update)

export default orders
