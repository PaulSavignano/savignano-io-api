import express from 'express'

import authenticate from '../middleware/authenticate'
import {
  add,
  get,
  getId,
  updateAppBarValues,
  updateAppBarWithImage,
  updateAppBarWithDeleteImage,
  updateArticleStyle,
  updateBusinessValues,
  updateBusinessWithImage,
  updateBusinessWithDeleteImage,
  updateBodyValues,
  updateBodyWithBackgroundImage,
  updateBodyWithDeleteBackgroundImage,
  updateCardStyle,
  updateFooterWithImageAndBackgroundImage,
  updateFooterWithImageAndDeleteBackgroundImage,
  updateFooterWithBackgroundImageAndDeleteImage,
  updateFooterWithDeleteImageAndDeleteBackgroundImage,
  updateFooterWithImage,
  updateFooterWithBackgroundImage,
  updateFooterWithDeleteImage,
  updateFooterWithDeleteBackgroundImage,
  updateFooterValues,
  updateHeroStyle,
  updatePalette,
  updateProductStyle,
  updateSocialMedia,
  updateTypography,
  remove
} from '../controllers/brand'

const brands = express.Router()

brands.post('/:brandName', authenticate(['admin']), add)
brands.get('/:brandName', get)

brands.patch('/:brandName/:_id/appbar/update-values', authenticate(['admin']), updateAppBarValues)
brands.patch('/:brandName/:_id/appbar/update-with-image', authenticate(['admin']), updateAppBarWithImage)
brands.patch('/:brandName/:_id/appbar/update-with-delete-image', authenticate(['admin']), updateAppBarWithDeleteImage)

brands.patch('/:brandName/:_id/articlestyle/update-values', authenticate(['admin']), updateArticleStyle)

brands.patch('/:brandName/:_id/business/update-values', authenticate(['admin']), updateBusinessValues)
brands.patch('/:brandName/:_id/business/update-with-image', authenticate(['admin']), updateBusinessWithImage)
brands.patch('/:brandName/:_id/business/update-with-delete-image', authenticate(['admin']), updateBusinessWithDeleteImage)

brands.patch('/:brandName/:_id/body/update-values', authenticate(['admin']), updateBodyValues)
brands.patch('/:brandName/:_id/body/update-with-background-image', authenticate(['admin']), updateBodyWithBackgroundImage)
brands.patch('/:brandName/:_id/body/update-with-delete-background-image', authenticate(['admin']), updateBodyWithDeleteBackgroundImage)

brands.patch('/:brandName/:_id/cardstyle/update-values', authenticate(['admin']), updateCardStyle)

brands.patch('/:brandName/:_id/footer/update-with-image-and-background-image', authenticate(['admin']), updateFooterWithImageAndBackgroundImage)
brands.patch('/:brandName/:_id/footer/update-with-image-and-delete-background-image', authenticate(['admin']), updateFooterWithImageAndDeleteBackgroundImage)
brands.patch('/:brandName/:_id/footer/update-with-background-image-and-delete-image', authenticate(['admin']), updateFooterWithBackgroundImageAndDeleteImage)
brands.patch('/:brandName/:_id/footer/update-with-delete-image-and-delete-background-image', authenticate(['admin']), updateFooterWithDeleteImageAndDeleteBackgroundImage)
brands.patch('/:brandName/:_id/footer/update-with-image', authenticate(['admin']), updateFooterWithImage)
brands.patch('/:brandName/:_id/footer/update-with-background-image', authenticate(['admin']), updateFooterWithBackgroundImage)
brands.patch('/:brandName/:_id/footer/update-with-delete-image', authenticate(['admin']), updateFooterWithDeleteImage)
brands.patch('/:brandName/:_id/footer/update-with-delete-background-image', authenticate(['admin']), updateFooterWithDeleteBackgroundImage)
brands.patch('/:brandName/:_id/footer/update-values', authenticate(['admin']), updateFooterValues)

brands.patch('/:brandName/:_id/herostyle/update-values', authenticate(['admin']), updateHeroStyle)
brands.patch('/:brandName/:_id/palette/update-values', authenticate(['admin']), updatePalette)
brands.patch('/:brandName/:_id/productstyle/update-values', authenticate(['admin']), updateProductStyle)
brands.patch('/:brandName/:_id/socialmedia/update-values', authenticate(['admin']), updateSocialMedia)
brands.patch('/:brandName/:_id/typography/update-values', authenticate(['admin']), updateTypography)
brands.delete('/:brandName/:_id', authenticate(['admin']), remove)

export default brands
