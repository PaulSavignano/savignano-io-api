import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  remove,
  update
} from '../controllers/contactForm'

const contactForm = express.Router()

contactForm.post('/:brandName', authenticate(['admin']), add)
contactForm.delete('/:brandName/:_id', authenticate(['admin']), remove)
contactForm.patch('/:brandName/:_id/update-values', authenticate(['admin']), update)

export default contactForm
