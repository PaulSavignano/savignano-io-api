import mongoose, { Schema } from 'mongoose'

import Address from './Address'
import ApiConfig from './ApiConfig'
import Article from './Article'
import Card from './Card'
import Cart from './Cart'
import ContactForm from './ContactForm'
import Hero from './Hero'
import Order from './Order'
import Page from './Page'
import Product from './Product'
import Section from './Section'
import User from './User'
import { deleteFile, deleteFiles } from '../utils/s3'

const BrandSchema = new Schema({
  appBar: {
    image: {
      src: { type: String, trim: true, maxlength: 150 },
      width: { type: Number, trim: true, default: 128, max: 5000 },
      height: { type: Number, trim: true, default: 128, max: 5000 }
    },
    values: {
      backgroundColor: { type: String, trim: true, default: 'rgb(0, 188, 212)', maxlength: 25},
      color: { type: String, trim: true, default: 'rgb(255, 255, 255)', maxlength: 25 },
      fontFamily: { type: String, trim: true, default: 'Roboto, sans-serif', maxlength: 50 },
      fontSize: { type: String, trim: true, default: '24px', maxlength: 15 },
      fontWeight: { type: String, trim: true, default: '300', maxlength: 15 },
      imageBorderRadius: { type: String, trim: true, maxlength: 15 },
      imageElevation: { type: Number, trim: true, max: 24, min: 0 },
      imagePosition: { type: String, trim: true, default: 'relative', maxlength: 12 },
      imageWidth: { type: String, trim: true, maxlength: 15 },
      letterSpacing: { type: String, trim: true, maxlength: 15 },
      name: { type: String, trim: true, default: 'Brand', maxlength: 50 },
      navColor: { type: String, trim: true, default: 'rgb(255, 255, 255)', maxlength: 25 },
      phoneSize: { type: String, trim: true, maxlength: 25 },
      showPhone: { type: String, enum: ['false', 'true'], default: ['false'], maxlength: 25 },
      textShadow: { type: String, trim: true, maxlength: 100 },
    }
  },
  articleStyle: {
    values: {
      button1BackgroundColor: { type: String, trim: true, maxlength: 25 },
      button2BackgroundColor: { type: String, trim: true, maxlength: 25 },
      button1Border: { type: String, trim: true, maxlength: 50 },
      button2Border: { type: String, trim: true, maxlength: 50 },
      button1Color: { type: String, trim: true, maxlength: 50 },
      button2Color: { type: String, trim: true, maxlength: 50 },
      h1Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h1Color: { type: String, trim: true, maxlength: 25 },
      h1TextShadow: { type: String, trim: true, maxlength: 100 },
      h2Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h2Color: { type: String, trim: true, maxlength: 25 },
      h2TextShadow: { type: String, trim: true, maxlength: 100 },
      h3Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h3Color: { type: String, trim: true, maxlength: 50 },
      h3TextShadow: { type: String, trim: true, maxlength: 100 },
      pColor: { type: String, trim: true, maxlength: 25 },
      mediaBorder: { type: String, trim: true, maxlength: 50 },
      mediaElevation: { type: Number, trim: true, default: 3, max: 24, min: 0 }
    }
  },
  body: {
    backgroundImage: {
      src: { type: String, trim: true, maxlength: 150 },
      width: { type: Number, trim: true, default: 1920, max: 10000, min: 0 },
      height: { type: Number, trim: true, default: 1080, max: 10000, min: 0 }
    },
    values: {
      backgroundColor: { type: String, trim: true, default: 'rgb(255, 255, 255)', maxlength: 25 },
      color: { type: String, trim: true, maxlength: 25 },
    }
  },
  brandName: { type: String, maxlength: 90, required: true, unique: true },
  business: {
    image: {
      src: { type: String, trim: true, maxlength: 150 },
      width: { type: Number, trim: true, default: 128, max: 10000 },
      height: { type: Number, trim: true, default: 128, max: 10000 }
    },
    values: {
      city: { type: String, trim: true, maxlength: 100 },
      description: { type: String, trim: true, maxlength: 1000 },
      email: { type: String, trim: true, maxlength: 100 },
      facebook: { type: String, trim: true, maxlength: 150 },
      github: { type: String, trim: true, maxlength: 150 },
      google: { type: String, trim: true, maxlength: 150 },
      googleAnalyticsUA: { type: String, trim: true, maxlength: 150 },
      imageBorderRadius: { type: String, trim: true, maxlength: 50 },
      instagram: { type: String, trim: true, maxlength: 150 },
      keywords: { type: String, trim: true, maxlength: 1000 },
      license: { type: String, trim: true, maxlength: 100 },
      linkedin: { type: String, trim: true, maxlength: 150 },
      name: { type: String, trim: true, default: 'Brand', maxlength: 100 },
      phone: { type: String, trim: true, maxlength: 50 },
      phoneStyle: { type: String, trim: true, maxlength: 1000 },
      state: { type: String, trim: true, maxlength: 25 },
      street: { type: String, trim: true, maxlength: 100 },
      stripePk: { type: String, trim: true, maxlength: 500 },
      twitter: { type: String, trim: true, maxlength: 150 },
      yelp: { type: String, trim: true, maxlength: 150 },
      youtube: { type: String, trim: true, maxlength: 150 },
      zip: { type: String, trim: true, maxlength: 50 },
    }
  },
  cardStyle: {
    values: {
      button1BackgroundColor: { type: String, trim: true, maxlength: 50 },
      button2BackgroundColor: { type: String, trim: true, maxlength: 50 },
      button1Border: { type: String, trim: true, maxlength: 50 },
      button2Border: { type: String, trim: true, maxlength: 50 },
      button1Color: { type: String, trim: true, maxlength: 50 },
      button2Color: { type: String, trim: true, maxlength: 50 },
      elevation: { type: Number, trim: true, default: 3, max: 24, min: 0 },
      flex: { type: String, trim: true, default: '1 1 300px', maxlength: 50 },
      h1Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h1Color: { type: String, trim: true, maxlength: 50 },
      h1TextShadow: { type: String, trim: true, maxlength: 50 },
      h2Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h2Color: { type: String, trim: true, maxlength: 50 },
      h2TextShadow: { type: String, trim: true, maxlength: 50 },
      h3Align: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
      h3Color: { type: String, trim: true, maxlength: 50 },
      h3TextShadow: { type: String, trim: true, maxlength: 50 },
      pColor: { type: String, trim: true, maxlength: 50 },
      margin: { type: String, trim: true, default: '16px', maxlength: 50 },
      mediaBorder: { type: String, trim: true, maxlength: 50 },
    }
  },
  footer: {
    backgroundImage: {
      src: { type: String, trim: true, maxlength: 150 },
      width: { type: Number, trim: true, default: 1920, max: 10000, min: 0 },
      height: { type: Number, trim: true, default: 1080, max: 10000, min: 0 }
    },
    image: {
      src: { type: String, trim: true, maxlength: 150 },
      width: { type: Number, trim: true, default: 128, max: 10000, min: 0 },
      height: { type: Number, trim: true, default: 128, max: 10000, min: 0 }
    },
    values: {
      alignItems: { type: String, enum: ['baseline','center','flex-end','flex-start','stretch']},
      backgroundColor: { type: String, trim: true, default: 'rgb(0, 188, 212)', maxlength: 50 },
      borderBottom: { type: String, trim: true, maxlength: 50 },
      borderTop: { type: String, trim: true, maxlength: 50 },
      boxShadow: { type: String, trim: true, maxlength: 100 },
      color: { type: String, trim: true, default: '#ffffff', maxlength: 50 },
      flexFlow: { type: String, enum: ['column nowrap','column wrap-reverse', 'column wrap','row nowrap','row wrap-reverse','row wrap']},
      imageBorderRadius: { type: String, trim: true, maxlength: 50 },
      imageElevation: { type: Number, trim: true, max: 24, min: 0 },
      imageMargin: { type: String, trim: true, maxlength: 100 },
      imageMargin: { type: String, trim: true, maxlength: 25 },
      imagePadding: { type: String, trim: true, maxlength: 100 },
      justifyContent: { type: String, enum: ['center','flex-end','flex-start','space-around','space-between']},
      textAlign: { type: String, enum: ['center','end','justify','left','match-parent','right','start']},
    }
  },
  heroStyle: {
    values: {
      alignItems: { type: String, enum: ['baseline','center','flex-end','flex-start','stretch']},
      button1Color: { type: String, trim: true, maxlength: 50 },
      button2Color: { type: String, trim: true, maxlength: 50 },
      button1BackgroundColor: { type: String, trim: true, maxlength: 50 },
      button2BackgroundColor: { type: String, trim: true, maxlength: 50 },
      button1Border: { type: String, trim: true, maxlength: 50 },
      button2Border: { type: String, trim: true, maxlength: 50 },
      h1Align: { type: String, trim: true, default: 'center', maxlength: 50 },
      h1Color: { type: String, trim: true, default: 'rgba(255, 255, 255, .87)', maxlength: 50},
      h1TextShadow: { type: String, trim: true, maxlength: 50 },
      h2Align: { type: String, trim: true, default: 'center', maxlength: 50 },
      h2Color: { type: String, trim: true, default: 'rgba(255, 255, 255, .87)', maxlength: 50 },
      h2TextShadow: { type: String, trim: true, maxlength: 50 },
      h3Align: { type: String, trim: true, default: 'center', maxlength: 50 },
      h3Color: { type: String, trim: true, default: 'rgba(255, 255, 255, .87)', maxlength: 50 },
      h3TextShadow: { type: String, trim: true, maxlength: 50 },
      pColor: { type: String, trim: true, default: 'rgba(0, 0, 0, .87)', maxlength: 50 },
      minHeight: { type: String, trim: true, default: '85vh', maxlength: 50 }
    }
  },
  palette: {
    values: {
      primary1Color: { type: String, trim: true, default: '#00BCD4', maxlength: 50 },
      primary2Color: { type: String, trim: true, default: '#0097A7', maxlength: 50 },
      primary3Color: { type: String, trim: true, default: '#BDBDBD', maxlength: 50 },
      accent1Color: { type: String, trim: true, default: '#FF4081', maxlength: 50 },
      accent2Color: { type: String, trim: true, default: '#F5F5F5', maxlength: 50 },
      accent3Color: { type: String, trim: true, default: '#9E9E9E', maxlength: 50 },
      textColor: { type: String, trim: true, default: 'rgba(0, 0, 0, 0.87)', maxlength: 50 },
      secondaryTextColor: { type: String, trim: true, default: 'rgba(0, 0, 0, 0.87)', maxlength: 50 },
      alternateTextColor: { type: String, trim: true, default: '#ffffff', maxlength: 50 },
      canvasColor: { type: String, trim: true, default: '#ffffff', maxlength: 50 },
      borderColor: { type: String, trim: true, default: '#E0E0E0', maxlength: 50 },
      disabledColor: { type: String, trim: true, default: 'rgba(0, 0, 0, .3)', maxlength: 50 },
      pickerHeaderColor: { type: String, trim: true, default: '#00BCD4', maxlength: 50 },
      clockCircleColor: { type: String, trim: true, default: 'rgba(0, 0, 0, .7)', maxlength: 50 },
      shadowColor: { type: String, trim: true, default: 'rgba(0, 0, 0, 1)', maxlength: 50 }
    }
  },
  productStyle: {
    values: {
      descriptionColor: { type: String, trim: true, maxlength: 50 },
      detailColor: { type: String, trim: true, maxlength: 50 },
      detailPageBackgroundColor: { type: String, trim: true, maxlength: 50 },
      flex: { type: String, trim: true, default: '1 1 auto', maxlength: 50 },
      margin: { type: String, trim: true, default: '16px', maxlength: 50 },
      mediaElevation: { type: Number, trim: true, default: 3, max: 24, min: 0 },
      nameColor: { type: String, trim: true, maxlength: 50 },
      nameTextShadow: { type: String, trim: true, maxlength: 50 }
    }
  },
  typography: {
    values: {
      fontFamily: { type: String, trim: true, default: 'Roboto, sans-serif', maxlength: 50 },
      fontWeight: { type: String, trim: true, default: '300', maxlength: 50},
      h1FontFamily: { type: String, trim: true, maxlength: 50},
      h1FontSize: { type: String, trim: true, default: 'calc(2em + 1vw)', maxlength: 50 },
      h1LetterSpacing: { type: String, trim: true, default: '1px', maxlength: 50 },
      h1Margin: { type: String, trim: true, maxlength: 50 },
      h2FontFamily: { type: String, trim: true, maxlength: 50 },
      h2FontSize: { type: String, trim: true, default: 'calc(1.5em + 1vw)', maxlength: 50 },
      h2LetterSpacing: { type: String, trim: true, default: '1px', maxlength: 50 },
      h2Margin: { type: String, trim: true, maxlength: 50 },
      h3FontFamily: { type: String, trim: true, maxlength: 50 },
      h3FontSize: { type: String, trim: true, default: 'calc(1.17em + 1vw)', maxlength: 50 },
      h3LetterSpacing: { type: String, trim: true, default: '1px', maxlength: 50 },
      h3LineHeight: { type: String, trim: true, maxlength: 50 },
      h3Margin: { type: String, trim: true, maxlength: 50 },
      lineHeight: { type: String, trim: true, maxlength: 50},
      pFontFamily: { type: String, trim: true, maxlength: 50 },
      pFontSize: { type: String, trim: true, default: '16px', maxlength: 50 },
      pLetterSpacing: { type: String, trim: true, maxlength: 50 },
      pMargin: { type: String, trim: true, maxlength: 50 },
    }
  }
},{
  timestamps: true
})

BrandSchema.post('findOneAndRemove', function(doc) {
  const { appBar, footer } = doc
  if (appBar.image.src) {
    deleteFile({ Key: appBar.image.src })
    .catch(err => console.error(err))
  }
  if (footer.image.src) {
    deleteFile({ Key: footer.image.src })
    .catch(err => console.error(err))
  }
  if (footer.backgroundImage.src) {
    deleteFile({ Key: footer.backgroundImage.src })
    .catch(err => console.error(err))
  }
  if (body.backgroundImage.src) {
    deleteFile({ Key: body.backgroundImage.src })
    .catch(err => console.error(err))
  }



  Address.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('Address deleteMany', deletes)).catch(error => console.error(error))
  ApiConfig.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('ApiConfig deleteMany', deletes)).catch(error => console.error(error))

  Article.find({ brandName: doc.brandName })
  .then(items => items.length && items.forEach(item => Article.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  Card.find({ brandName: doc.brandName })
  .then(items => items.length && items.forEach(item => Card.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  Cart.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('Cart deleteMany', deletes)).catch(error => console.error(error))
  ContactForm.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('ContactForm deleteMany', deletes)).catch(error => console.error(error))

  Hero.find({ brandName: doc.brandName })
  .then(items => items.length && items.forEach(item => Hero.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  Order.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('Order deleteMany', deletes)).catch(error => console.error(error))
  Page.find({ brandName: doc.brandName })
  .then(items => items.length && items.forEach(item => Page.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  Product.find({ brandName: doc.brandName })
  .then(items => items.length && items.forEach(item => Hero.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  Section.find({ brandName: doc.brandName })
  .then(items => items.forEach(item => Hero.findOneAndRemove({ _id: item._id })))
  .catch(error => console.error(error))

  User.deleteMany({ brandName: doc.brandName }).then(deletes => console.info('User deleteMany', deletes)).catch(error => console.error(error))
})

const Brand = mongoose.model('Brand', BrandSchema)

export default Brand
