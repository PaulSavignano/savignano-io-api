import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  update,
  updateWithBackgroundImage,
  updateWithDeleteBackgroundImage,
  remove
} from '../controllers/page'

const pages = express.Router()

pages.post('/:clientName', authenticate(['admin']), add)
pages.get('/:clientName', get)
pages.patch('/:clientName/:_id/update-values', authenticate(['admin']), update)
pages.patch('/:clientName/:_id/update-with-background-image', authenticate(['admin']), updateWithBackgroundImage)
pages.patch('/:clientName/:_id/update-with-delete-background-image', authenticate(['admin']), updateWithDeleteBackgroundImage)
pages.delete('/:clientName/:_id', authenticate(['admin']), remove)

export default pages
