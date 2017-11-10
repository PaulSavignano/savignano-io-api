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

orders.post('/:brandName', authenticate(['user']), add)
orders.get('/:brandName', authenticate(['user']), get)
orders.get('/:brandName/admin', authenticate(['admin', 'owner']), getAdmin)
orders.patch('/:brandName/:_id', authenticate(['admin']), update)

export default orders
