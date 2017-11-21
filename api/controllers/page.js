import { ObjectID } from 'mongodb'
import url from 'url'
import moment from 'moment'

import { deleteFile, uploadFile } from '../utils/s3'
import Page from '../models/Page'
import slugIt from '../utils/slugIt'


export const add = (req, res) => {
  console.log('trying to add page')
  const {
    body: {
      values: { name }
    },
    params: { brandName }
  } = req
  console.log('name', name, 'brandName', brandName)
  Page.findOne({ 'values.name': name, brandName })
  .then(page => {
    if (!page) {
      const newPage = new Page({
        brandName,
        slug: slugIt(name),
        values: { name }
      })
      newPage.save()
      .then(page => res.send(page))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    } else {
      return res.status(400).send({ error: 'That name already exists' })
    }
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const get = async (req, res) => {
  const { brandName } = req.params
  try {
    const pages = await Page.find({ brandName })
    if (!pages) throw 'There were no pages found'
    res.send(pages)
  } catch (error) {
    console.error({ error });
    res.status(400).send({ error })
  }
}

export const update = async (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    body: { values },
    params: { _id, brandName }
  } = req
  try {
    const existingPage = await Page.findOne({ brandName, 'values.name': values.name })
    if (nameAlreadyExists) throw 'Try a different name, that page already exists'
    const slug = slugIt(values.name)
    const page = await Page.findOneAndUpdate(
      { _id, brandName },
      { $set: { slug, values }},
      { new: true }
    )
    .populate({
      path: 'sections',
      populate: { path: 'items.item' }
    })
    res.send(page)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}


export const updateWithBackgroundImage = async (req, res) => {
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
  try {
    const existingPage = await Page.findOne({ _id, brandName })
    if (existingPage.values.name !== values.name) {
      const nameAlreadyExists = await Page.findOne({ 'values.name': values.name, brandName })
      if (nameAlreadyExists) throw 'That page name already exists'
    }
    const slug = slugIt(values.name)
    const Key = `${brandName}/page-${pageSlug}-background-image-${_id}_${moment(Date.now()).format("YYYY-MM-DD_h-mm-ss-a")}.${newBackgroundImage.ext}`
    const data = await uploadFile({ Key }, newBackgroundImage.src, oldBackgroundImageSrc)
    const page = await Page.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        backgroundImage: {
          src: Key,
          width: newBackgroundImage.width,
          height: newBackgroundImage.height
        },
        slug,
        values
      }},
      { new: true }
    )
    .populate({
      path: 'sections',
      populate: { path: 'items.item' }
    })
    res.send(page)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const updateWithDeleteBackgroundImage = async (req, res) => {
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
  try {
    const existingPage = await Page.findOne({ _id, brandName })
    if (existingPage.values.name !== values.name) {
      const nameAlreadyExists = await Page.findOne({ 'values.name': values.name, brandName })
      if (nameAlreadyExists) throw 'That page name already exists'
    }
    const slug = slugIt(values.name)
    await deleteFile({ Key: oldBackgroundImageSrc })
    const page = await Page.findOneAndUpdate(
      { _id, brandName },
      { $set: {
        'backgroundImage.src': null,
        slug,
        values
      }},
      { new: true }
    )
    .populate({
      path: 'sections',
      populate: { path: 'items.item' }
    })
    res.send(page)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, brandName }
  } = req
  Page.findOneAndRemove({ _id, brandName })
  .then(page => res.send(page))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
