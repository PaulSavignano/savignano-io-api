import mongoose, { Schema } from 'mongoose'

import Section from './Section'
import { deleteFile } from '../utils/s3'

const PageSchema = new Schema({
  backgroundImage: {
    src: { type: String, trim: true, maxlength: 150 },
    width: { type: Number, trim: true, default: 1920, max: 10000, min: 0 },
    height: { type: Number, trim: true, default: 1080, max: 10000, min: 0 }
  },
  brandName: { type: String, maxlength: 90, required: true, },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  slug: { type: String },
  values: {
    name: { type: String, trim: true, minlength: 1, maxlength: 1000 },
    backgroundColor: { type: String, trim: true, minlength: 1, default: 'rgb(255,255,255)', maxlength: 50 },
    backgroundPosition: { type: String, trim: true, maxlength: 50 }
  },
}, {
  timestamps: true
})

function autopopulate(next) {
  this.populate({
    path: 'sections',
    populate: { path: 'items.item' }
  })
  next();
}

PageSchema.pre('find', autopopulate)
PageSchema.pre('findOne', autopopulate)

PageSchema.pre('save', async function(next) {
  const page = this
  try {
    const existingPage = await Page.findOne({ brandName: page.brandName, slug: page.slug })
    if (existingPage) throw 'try a different name, that page already exists'
  } catch (error) {
    Promise.reject(error)
  }
  next()
})

PageSchema.post('findOneAndRemove', function(doc, next) {
  if (doc.backgroundImage && doc.backgroundImage.src) {
    deleteFile({ Key: doc.backgroundImage.src })
    .catch(err => console.error(err))
  }
  doc.sections.forEach(section => {
    return Section.findOneAndRemove({ _id: section })
    .then(data => console.info('Section findOneAndRemove: ', data))
    .catch(error => console.error(error))
  })
  next()
})

const Page = mongoose.model('Page', PageSchema)

export default Page
