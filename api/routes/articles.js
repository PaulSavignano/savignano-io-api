import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  remove,
  update,
  updateWithImage,
  updateWithDeleteImage,
} from '../controllers/article'

const articles = express.Router()

articles.post('/:brandName', authenticate(['admin']), add)
articles.patch('/:brandName/:_id/update-values', authenticate(['admin']), update)
articles.patch('/:brandName/:_id/update-with-image', authenticate(['admin']), updateWithImage)
articles.patch('/:brandName/:_id/update-with-delete-image', authenticate(['admin']), updateWithDeleteImage)

articles.delete('/:brandName/:_id', authenticate(['admin']), remove)

export default articles
