import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  remove,
  update,
  updateWithBackgroundImage,
  updateWithDeleteBackgroundImage,
} from '../controllers/section'

const sections = express.Router()

sections.post('/:clientName', authenticate(['admin']), add)
sections.patch('/:clientName/:_id/update-values', authenticate(['admin']), update)
sections.patch('/:clientName/:_id/update-with-background-image', authenticate(['admin']), updateWithBackgroundImage)
sections.patch('/:clientName/:_id/update-with-delete-background-image', authenticate(['admin']), updateWithDeleteBackgroundImage)
sections.delete('/:clientName/:_id', authenticate(['admin']), remove)

export default sections
