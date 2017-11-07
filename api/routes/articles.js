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

articles.post('/:clientName', authenticate(['admin']), add)
articles.patch('/:clientName/:_id/update-values', authenticate(['admin']), update)
articles.patch('/:clientName/:_id/update-with-image', authenticate(['admin']), updateWithImage)
articles.patch('/:clientName/:_id/update-with-delete-image', authenticate(['admin']), updateWithDeleteImage)

articles.delete('/:_id', authenticate(['admin']), remove)

export default articles
