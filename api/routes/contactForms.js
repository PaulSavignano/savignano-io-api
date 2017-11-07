import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  remove,
  update
} from '../controllers/contactForm'

const contactForm = express.Router()

contactForm.post('/:clientName', authenticate(['admin']), add)
contactForm.delete('/:clientName/:_id', authenticate(['admin']), remove)
contactForm.patch('/:clientName/:_id/update-values', authenticate(['admin']), update)

export default contactForm
