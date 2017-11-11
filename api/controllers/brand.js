import express from 'express'
import { ObjectID } from 'mongodb'
import url from 'url'
import moment from 'moment'

import ApiConfig from '../models/ApiConfig'
import Brand from '../models/Brand'
import Page from '../models/Page'
import { uploadFile, deleteFile } from '../utils/s3'

export const add = async (req, res) => {
  const { brandName } = req.params
  try {
    const apiConfig = await new ApiConfig({ brandName }).save()
    const brand = await new Brand({ brandName }).save()
    const page = await new Page({ brandName, 'values.name': 'Home', slug: 'home' }).save()
    res.send({ apiConfig, brand, page })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}


export const get = async (req, res) => {
  const { brandName } = req.params
  try {
    const brand = await Brand.find({ brandName })
    if (!brand) throw 'No brand found'
    res.send(brand)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const updateAppBarWithImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newImage,
      pageSlug,
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const imageKey = `${brandName}/brand-${_id}-appbar-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
  .then(() => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'appBar.image': {
          src: imageKey,
          width: newImage.width,
          height: newImage.height
        },
        'appBar.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const updateAppBarWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'appBar.image.src': null,
        'appBar.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateAppBarValues = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      values
    },
    params: { _id, brandName },
  } = req
  return Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: {
      'appBar.values': values
    }},
    { new: true }
  )
  .then(brand => res.send(brand))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const updateArticleStyle = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { articleStyle: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send()})
}



export const updateBodyWithBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newBackgroundImage,
      pageSlug,
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const backgroundImageKey = `${brandName}/brand-${_id}-body-background-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
  .then(data => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'body.backgroundImage': {
          src: Key,
          width: newBackgroundImage.width,
          height: newBackgroundImage.height
        },
        'body.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateBodyWithDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(() => {
    Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'body.backgroundImage.src': null,
        'body.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateBodyValues = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  return Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: {
      'body.values': values
    }},
    { new: true }
  )
  .then(brand => res.send(brand))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const updateBusinessWithImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newImage,
      pageSlug,
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const imageKey = `${brandName}/brand-${_id}-business-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
  .then(data => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'business.image': {
          src: Key,
          width: newImage.width,
          height: newImage.height
        },
        'business.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateBusinessWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'business.image.src': null,
        'business.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateBusinessValues = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, brandName },
  } = req
  return Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: {
      'business.values': values
    }},
    { new: true }
  )
  .then(brand => res.send(brand))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}





export const updateCardStyle = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: { values },
    params: { _id, brandName },
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { cardStyle: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send()})
}




export const updateFooterWithImageAndBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newImage,
      newBackgroundImage,
      pageSlug,
      oldImageSrc,
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const imageKey = `${brandName}/brand-${_id}-footer-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  const backgroundImageKey = `${brandName}/brand-${_id}-footer-background-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
  .then(imageData => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'footer.image': {
          src: imageKey,
          width: newImage.width,
          height: newImage.height
        },
      }},
      { new: true }
    )
    .then(() => {
      return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
      .then(backgroundImageData => {
        return Brand.findOneAndUpdate(
          { _id, brandName },
          { $set: {
            'footer.backgroundImage': {
              src: backgroundImageKey,
              width: newBackgroundImage.width,
              height: newBackgroundImage.height
            },
            'footer.values': values
          }},
          { new: true }
        )
        .then(brand => res.send(brand))
        .catch(error => { console.error(error); res.status(400).send({ error })})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithImageAndDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newImage,
      pageSlug,
      oldImageSrc,
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const imageKey = `${brandName}/brand-${_id}-footer-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(() => {
    return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
    .then(data => {
      return Brand.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          'footer.backgroundImage': {
            src: Key,
            width: newBackgroundImage.width,
            height: newBackgroundImage.height
          },
          'footer.image.src': null,
          'footer.values': values
        }},
        { new: true }
      )
      .then(brand => res.send(brand))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithBackgroundImageAndDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newBackgroundImage,
      pageSlug,
      oldImageSrc,
      oldBackgroundImageSrc,
      type,
      values
    },
    params: { _id, brandName }
  } = req
  const backgroundImageKey = `${brandName}/brand-${_id}-footer-background-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
    .then(data => {
      return Brand.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          'footer.backgroundImage': {
            src: Key,
            width: newBackgroundImage.width,
            height: newBackgroundImage.height
          },
          'footer.image.src': null,
          'footer.values': values
        }},
        { new: true }
      )
      .then(brand => res.send(brand))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithDeleteImageAndDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldImageSrc,
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return deleteFile({ Key: oldBackgroundImageSrc })
    .then(() => {
      return Brand.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          'footer.backgroundImage.src': null,
          'footer.image.src': null,
          'footer.values': values
        }},
        { new: true }
      )
      .then(brand => res.send(brand))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newImage,
      pageSlug,
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const Key = `${brandName}/brand-${_id}-footer-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key }, newImage.src, oldImageSrc)
  .then(data => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'footer.image': {
          src: Key,
          width: newImage.width,
          height: newImage.height
        },
        'footer.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      newBackgroundImage,
      pageSlug,
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  const backgroundImageKey = `${brandName}/brand-${_id}-footer-background-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
  .then(data => {
    return Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'footer.backgroundImage': {
          src: Key,
          width: newBackgroundImage.width,
          height: newBackgroundImage.height
        },
        'footer.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'footer.image.src': null,
        'footer.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterWithDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldBackgroundImageSrc,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(() => {
    Brand.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'footer.backgroundImage.src': null,
        'footer.values': values
      }},
      { new: true }
    )
    .then(brand => res.send(brand))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateFooterValues = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      values
    },
    params: { _id, brandName }
  } = req
  return Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: {
      'footer.values': values
    }},
    { new: true }
  )
  .then(brand => res.send(brand))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}




export const updateHeroStyle = (req, res) => {
  console.log('inside update heroStyle')
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: {
      values
    },
    params: { _id, brandName }
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { heroStyle: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const updatePalette = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { palette: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateProductStyle = (req, res) => {
  if (!ObjectID.isValid(_id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { productStyle: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const updateTypography = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  Brand.findOneAndUpdate(
    { _id, brandName },
    { $set: { typography: { values }}},
    { new: true }
  )
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



// Delete
export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send()
  const { _id, brandName } = req.params
  Brand.findOneAndRemove({ _id, brandName })
  .then(_id => res.send(_id))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
