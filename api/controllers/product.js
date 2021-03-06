import { ObjectID } from 'mongodb'
import moment from 'moment'

import Page from '../models/Page'
import Product from '../models/Product'
import Section from '../models/Section'
import { deleteFile, uploadFile } from '../utils/s3'

export const add = (req, res) => {
  const {
    body: { pageId, pageSlug, sectionId },
    params: { brandName }
  } = req
  const newDoc = new Product({
    brandName,
    page: ObjectID(pageId),
    pageSlug,
    section: ObjectID(sectionId),
    values: {}
  })
  newDoc.save()
  .then(product => {
    Section.findOneAndUpdate(
      { _id: product.section, brandName },
      { $push: { items: { kind: 'Product', item: product._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, brandName })
      .then(page => res.send({ editItem: product, page, product }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const get = async (req, res) => {
  const { brandName } = req.params
  try {
    const products = await Product.find({ brandName })
    if (!products) throw 'No products found'
    res.send(products)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  Product.findOneAndUpdate(
    { _id, brandName },
    { $set: { values }},
    { new: true }
  )
  .then(product => {
    Page.findOne({ _id: product.page, brandName })
    .then(page => res.send({ page, product }))
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
  const Key = `${brandName}/page-${pageSlug}/product-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newImage.ext}`
  return uploadFile({ Key }, newImage.src, oldImageSrc)
  .then(data => {
    Product.findOneAndUpdate(
      { _id, brandName },
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
    .then(product => {
      Page.findOne({ _id: product.page, brandName })
      .then(page => res.send({ page, product }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const updateWithDeleteImage = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { oldImageSrc, type, values },
    params: { _id, brandName }
  } = req
  return deleteFile({ Key: oldImageSrc })
  .then(() => {
    Product.findOneAndUpdate(
      { _id, brandName },
      { $set: { 'image.src': null }},
      { new: true }
    )
    .then(product => {
      Page.findOne({ _id: product.page, brandName })
      .then(page => res.send({ page, product }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, brandName }
  } = req
  Product.findOneAndRemove({ _id, brandName })
  .then(product => {
    Section.findOneAndUpdate(
      { _id: product.section, brandName },
      { $pull: { items: { kind: 'Product', item: product._id }}},
      { new: true }
    )
    .then(section => {
      Page.findOne({ _id: section.page, brandName })
      .then(page => res.send({ page, product }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
