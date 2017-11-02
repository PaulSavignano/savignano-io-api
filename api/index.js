import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import mongoose from './db/mongoose'
import cors from 'cors'
import expressValidator from 'express-validator'
import helmet from 'helmet'

import addresses from './routes/addresses'
import articles from './routes/articles'
import brands from './routes/brands'
import cards from './routes/cards'
import carts from './routes/carts'
import contactForms from './routes/contactForms'
import forceSSL from './middleware/forceSSL'
import heros from './routes/heros'
import orders from './routes/orders'
import pages from './routes/pages'
import products from './routes/products'
import sections from './routes/sections'
import users from './routes/users'


const app = express()
const port = process.env.PORT

app.use(cors())

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/addresses', addresses)
app.use('/api/articles', articles)
app.use('/api/brands', brands)
app.use('/api/cards', cards)
app.use('/api/carts', carts)
app.use('/api/contact-forms', contactForms)
app.use('/api/heros', heros)
app.use('/api/orders', orders)
app.use('/api/pages', pages)
app.use('/api/products', products)
app.use('/api/sections', sections)
app.use('/api/users', users)

console.log('past routes')

app.get('/', (req, res) => {
  console.log('inside get req')
  res.send(`
    <div style="display: flex; flex-flow: column; justify-content: center; align-items: center; height: 85vh;">
      <h1 style="font-weight: 300;">Savignano.io API</h1>
    </div>
  `)
})

app.listen(port, () => console.log(`Started up at port: ${port}`))

export default app
