import express from 'express'
import bodyParser from 'body-parser'
import dns from 'dns'
import expressValidator from 'express-validator'
import helmet from 'helmet'
import path from 'path'

import mongoose from './db/mongoose'

import addresses from './routes/addresses'
import apiConfigs from './routes/apiConfigs'
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

import moverbase from './moverbase/routes/moverbase'

const app = express()
const port = process.env.PORT

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, cart, Authorization")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token, cart, Authorization')
  next()
})

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/addresses', addresses)
app.use('/api/api-configs', apiConfigs)
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

app.use('/api/moverbase', moverbase)

app.get('/', (req, res) => {
  res.send(`
    <div style="display: flex; flex-flow: column; justify-content: center; align-items: center; height: 85vh;">
      <h1 style="font-weight: 300;">Savignano.io API</h1>
    </div>
  `)
})

app.listen(port, () => console.info(`Api running at port: ${port}`))

export default app
