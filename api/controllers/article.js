import { ObjectID } from 'mongodb'
import moment from 'moment'

import Article from '../models/Article'
import Section from '../models/Section'
import Page from '../models/Page'
import { deleteFile, uploadFile } from '../utils/s3'

export const add = (req, res) => {
  const {
    body: {
      pageId,
      pageSlug,
      sectionId
    },
    params: { clientName }
  } = req
  const newDoc = new Article({
    clientName,
    page: ObjectID(pageId),
    pageSlug,
    section: ObjectID(sectionId),
    image: null,
    values: {}
  })
  newDoc.save()
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, clientName },
      { $push: { items: { kind: 'Article', item: doc._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, clientName })
      .then(page => res.send({ editItem: doc, page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, clientName },
  } = req
  Article.findOneAndUpdate(
    { _id, clientName },
    { $set: { values }},
    { new: true }
  )
  .then(doc => {
    Page.findOne({ _id: doc.page, clientName })
    .then(page => res.send({ page }))
    .catch(error => { console.error(error); res.status(400).send({ error: error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error: error })})
}



export const updateWithImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      pageSlug,
      newImage,
      oldImageSrc,
      values
    },
    params: { _id, clientName }
  } = req
  const Key = `${clientName}/page-${pageSlug}/article-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}`
  return uploadFile({ Key }, newImage.src, oldImageSrc)
  .then(data => {
    Article.findOneAndUpdate(
      { _id, clientName },
      { $set: {
        image: {
          src: Key,
          width: newImage.width,
          height: newImage.height
        },
        values
      }},
      { new: true }
    )
    .then(doc => {
      Page.findOne({ _id: doc.page, clientName })
      .then(page => res.send({ page }))
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const updateWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      oldImageSrc,
      type,
      values
    },
    params: { _id, clientName },
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(data => {
    console.log(data)
    Article.findOneAndUpdate(
      { _id, clientName },
      { $set: { 'image.src': null }},
      { new: true }
    )
    .then(doc => {
      Page.findOne({ _id: doc.page, clientName })
      .then(page => res.send({ page }))
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, clientName }
  } = req
  Article.findOneAndRemove({ _id, clientName })
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, clientName },
      { $pull: { items: { kind: 'Article', item: doc._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, clientName })
      .then(page => res.send({ page }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
