import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  getId,
  update,
  remove
} from '../controllers/cart'

const carts = express.Router()

carts.post('/:clientName', add)
carts.get('/:clientName/:_id', getId)
carts.patch('/:clientName/:_id', update)
carts.delete('/:clientName/:_id', remove)

export default carts
