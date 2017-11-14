import { ObjectID } from 'mongodb'
import moment from 'moment'

import Page from '../models/Page'
import Section from '../models/Section'
import Hero from '../models/Hero'
import { deleteFile, uploadFile } from '../utils/s3'

// Find out why req is empty
export const add = (req, res) => {
  const {
    body: { pageId, pageSlug, sectionId },
    params: { brandName }
  } = req
  const newDoc = new Hero({
    brandName,
    page: ObjectID(pageId),
    pageSlug,
    section: ObjectID(sectionId),
    values: {}
  })
  newDoc.save()
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, brandName },
      { $push: { items: { kind: 'Hero', item: doc._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, brandName })
      .then(page => res.send({ editItem: doc, page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const updateWithImageAndBackgroundImage = (req, res) => {
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
  const imageKey = `${brandName}/page-${pageSlug}/hero-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newImage.ext}`
  const backgroundImageKey = `${brandName}/page-${pageSlug}/hero-background-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newBackgroundImage.ext}`
  return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
  .then(imageData => {
    return Hero.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        image: {
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
        return Hero.findOneAndUpdate(
          { _id, brandName },
          { $set: {
            backgroundImage: {
              src: backgroundImageKey,
              width: newBackgroundImage.width,
              height: newBackgroundImage.height
            },
            values
          }},
          { new: true }
        )
        .then(hero => {
          return Page.findOne({ _id: hero.page, brandName })
          .then(page => res.send({ page }))
          .catch(error => { console.error(error); res.status(400).send({ error })})
        })
        .catch(error => { console.error(error); res.status(400).send({ error })})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithImageAndDeleteBackgroundImage = (req, res) => {
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
  const imageKey = `${brandName}/page-${pageSlug}/hero-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newImage.ext}`
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(() => {
    return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
    .then(data => {
      return Hero.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          image: {
            src: imageKey,
            width: newImage.width,
            height: newImage.height
          },
          'backgroundImage.src': null,
          values
        }},
        { new: true }
      )
      .then(hero => {
        return Page.findOne({ _id: hero.page, brandName })
        .then(page => res.send({ page }))
        .catch(error => { console.error(error); res.status(400).send({ error })})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithBackgroundImageAndDeleteImage = (req, res) => {
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
  const backgroundImageKey = `${brandName}/page-${pageSlug}/hero-background-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newBackgroundImage.ext}`
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
    .then(data => {
      return Hero.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          backgroundImage: {
            src: backgroundImageKey,
            width: newBackgroundImage.width,
            height: newBackgroundImage.height
          },
          'image.src': null,
          values
        }},
        { new: true }
      )
      .then(hero => {
        return Page.findOne({ _id: hero.page, brandName })
        .then(page => res.send({ page }))
        .catch(error => { console.error(error); res.status(400).send({ error })})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithDeleteImageAndDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { oldImageSrc, oldBackgroundImageSrc, values },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return deleteFile({ Key: oldBackgroundImageSrc })
    .then(() => {
      return Hero.findOneAndUpdate(
        { _id, brandName },
        { $set: {
          'backgroundImage.src': null,
          'image.src': null,
          values
        }},
        { new: true }
      )
      .then(hero => {
        return Page.findOne({ _id: hero.page, brandName })
        .then(page => res.send({ page }))
        .catch(error => { console.error(error); res.status(400).send({ error })})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithImage = (req, res) => {
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
  const imageKey = `${brandName}/page-${pageSlug}/hero-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newImage.ext}`
  return uploadFile({ Key: imageKey }, newImage.src, oldImageSrc)
  .then(() => {
    Hero.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        image: {
          src: imageKey,
          width: newImage.width,
          height: newImage.height
        },
        values
      }},
      { new: true }
    )
    .then(hero => {
      return Page.findOne({ _id: hero.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithBackgroundImage = (req, res) => {
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
  const backgroundImageKey = `${brandName}/page-${pageSlug}/hero-background-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newBackgroundImage.ext}`
  return uploadFile({ Key: backgroundImageKey }, newBackgroundImage.src, oldBackgroundImageSrc)
  .then(data => {
    return Hero.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        backgroundImage: {
          src: backgroundImageKey,
          width: newBackgroundImage.width,
          height: newBackgroundImage.height
        },
        values
      }},
      { new: true }
    )
    .then(hero => {
      return Page.findOne({ _id: hero.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { oldImageSrc, values },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    return Hero.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'image.src': null,
        values
      }},
      { new: true }
    )
    .then(hero => {
      return Page.findOne({ _id: hero.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateWithDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { oldBackgroundImageSrc, values },
    params: { _id, brandName },
  } = req
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(() => {
    return Hero.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'backgroundImage.src': null,
        values
      }},
      { new: true }
    )
    .then(hero => {
      return Page.findOne({ _id: hero.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const updateValues = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  return Hero.findOneAndUpdate(
    { _id, brandName },
    { $set: {
      values
    }},
    { new: true }
  )
  .then(hero => {
    return Page.findOne({ _id: hero.page, brandName })
    .then(page => res.send({ page }))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, brandName }
  } = req
  Hero.findOneAndRemove({ _id, brandName })
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, brandName },
      { $pull: { items: { kind: 'Hero', item: doc._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
