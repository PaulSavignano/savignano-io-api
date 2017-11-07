import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  remove,
  updateValues,
  updateWithImageAndBackgroundImage,
  updateWithImageAndDeleteBackgroundImage,
  updateWithBackgroundImageAndDeleteImage,
  updateWithDeleteImageAndDeleteBackgroundImage,
  updateWithImage,
  updateWithBackgroundImage,
  updateWithDeleteImage,
  updateWithDeleteBackgroundImage,
} from '../controllers/hero'

const heros = express.Router()

heros.post('/:clientName', authenticate(['admin']), add)
heros.delete('/:clientName/:_id', authenticate(['admin']), remove)

heros.patch('/:clientName/:_id/update-with-image-and-background-image', authenticate(['admin']), updateWithImageAndBackgroundImage)
heros.patch('/:clientName/:_id/update-with-image-and-delete-background-image', authenticate(['admin']), updateWithImageAndDeleteBackgroundImage)
heros.patch('/:clientName/:_id/update-with-background-image-and-delete-image', authenticate(['admin']), updateWithBackgroundImageAndDeleteImage)
heros.patch('/:clientName/:_id/update-with-delete-image-and-delete-background-image', authenticate(['admin']), updateWithDeleteImageAndDeleteBackgroundImage)
heros.patch('/:clientName/:_id/update-with-image', authenticate(['admin']), updateWithImage)
heros.patch('/:clientName/:_id/update-with-background-image', authenticate(['admin']), updateWithBackgroundImage)
heros.patch('/:clientName/:_id/update-with-delete-image', authenticate(['admin']), updateWithDeleteImage)
heros.patch('/:clientName/:_id/update-with-delete-background-image', authenticate(['admin']), updateWithDeleteBackgroundImage)
heros.patch('/:clientName/:_id/update-values', authenticate(['admin']), updateValues)

export default heros
