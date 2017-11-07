import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  remove,
  update,
  updateWithImage,
  updateWithDeleteImage,
} from '../controllers/product'

const products = express.Router()

products.post('/:clientName', authenticate(['admin']), add)
products.get('/:clientName', get)
products.patch('/:clientName/:_id/update-values', authenticate(['admin']), update)
products.patch('/:clientName/:_id/update-with-image', authenticate(['admin']), updateWithImage)
products.patch('/:clientName/:_id/update-with-delete-image', authenticate(['admin']), updateWithDeleteImage)
products.delete('/:clientName/:_id', authenticate(['admin']), remove)

export default products
