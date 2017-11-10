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

products.post('/:brandName', authenticate(['admin']), add)
products.get('/:brandName', get)
products.patch('/:brandName/:_id/update-values', authenticate(['admin']), update)
products.patch('/:brandName/:_id/update-with-image', authenticate(['admin']), updateWithImage)
products.patch('/:brandName/:_id/update-with-delete-image', authenticate(['admin']), updateWithDeleteImage)
products.delete('/:brandName/:_id', authenticate(['admin']), remove)

export default products
