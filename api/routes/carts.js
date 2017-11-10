import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  getId,
  update,
  remove
} from '../controllers/cart'

const carts = express.Router()

carts.post('/:brandName', add)
carts.get('/:brandName/:_id', getId)
carts.patch('/:brandName/:_id', update)
carts.delete('/:brandName/:_id', remove)

export default carts
