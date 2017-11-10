import { ObjectID } from 'mongodb'
import moment from 'moment'

import Page from '../models/Page'
import Section from '../models/Section'
import { deleteFile, uploadFile } from '../utils/s3'

export const add = (req, res) => {
  const {
    body: { pageId, pageSlug },
    params: { brandName }
  } = req
  const newDoc = new Section({
    brandName,
    page: ObjectID(pageId),
    pageSlug
  })
  newDoc.save()
  .then(doc => {
    Page.findOneAndUpdate(
      { _id: doc.page, brandName },
      { $push: { sections: doc._id }},
      { new: true }
    )
    .populate({
      path: 'sections',
      populate: { path: 'items.item' }
    })
    .then(page => res.send({ editItem: doc, page }))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}





export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  return Section.findOneAndUpdate(
    { _id, brandName },
    { $set: { values }},
    { new: true }
  )
  .then(doc => {
    Page.findOne({ _id: doc.page, brandName })
    .then(page => res.send({ page }))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const updateWithBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: {
      newBackgroundImage,
      oldBackgroundImageSrc,
      pageSlug,
      values
    },
    params: { _id, brandName }
  } = req
  const Key = `${brandName}/page-${pageSlug}/section-${_id}-background-image_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key }, newBackgroundImage.src, oldBackgroundImageSrc)
  .then(data => {
    Section.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        backgroundImage: {
          src: Key,
          width: newBackgroundImage.width,
          height: newBackgroundImage.height
        },
        values
      }},
      { new: true }
    )
    .then(doc => {
      Page.findOne({ _id: doc.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
}



export const updateWithDeleteBackgroundImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalide id'})
  const {
    body: {
      oldBackgroundImageSrc,
      pageSlug,
      type,
      values
    },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldBackgroundImageSrc })
  .then(deleteData => {
    console.log(deleteData)
    Section.findOneAndUpdate(
      { _id, brandName },
      { $set: { 'backgroundImage.src': null }},
      { new: true }
    )
    .then(doc => {
      Page.findOne({ _id: doc.page, brandName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, brandName }
  } = req
  Section.findOneAndRemove({ _id, brandName })
  .then(doc => {
    Page.findOneAndUpdate(
      { _id: doc.page, brandName },
      { $pull: { sections: doc._id }},
      { new: true }
    )
    .populate({
      path: 'sections',
      populate: { path: 'items.item' }
    })
    .then(page => res.send({ page }))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
