import { ObjectID } from 'mongodb'
import moment from 'moment'

import Page from '../models/Page'
import ContactForm from '../models/ContactForm'
import Section from '../models/Section'

export const add = (req, res) => {
  const {
    body: { pageId, pageSlug, sectionId },
    params: { brandName }
  } = req
  const newDoc = new ContactForm({
    brandName,
    page: ObjectID(pageId),
    pageSlug,
    section: ObjectID(sectionId),
    image: null,
    values: {}
  })
  newDoc.save()
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, brandName },
      { $push: { items: { kind: 'ContactForm', item: doc._id }}},
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


export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { type, values },
    params: { _id, brandName },
  } = req
  return ContactForm.findOneAndUpdate(
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



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, brandName },
  } = req
  ContactForm.findOneAndRemove({ _id, brandName })
  .then(doc => {
    Section.findOneAndUpdate(
      { _id: doc.section, brandName },
      { $pull: { items: { kind: 'ContactForm', item: doc._id }}},
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
