import { ObjectID } from 'mongodb'

import Address from '../models/Address'
import ApiConfig from '../models/ApiConfig'
import User from '../models/User'
import Order from '../models/Order'
import sendGmail from '../utils/sendGmail'

const formatPrice = (cents) => `$${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

export const add = (req, res, next) => {
  const {
    body: {
      stripeToken,
      fullAddress,
      name,
      phone,
      street,
      city,
      state,
      zip,
      cart
    },
    params: { brandName },
    user: { _id }
  } = req
  if (fullAddress === 'newAddress') {
    const newAddress = new Address({
      brandName,
      user: ObjectID(_id),
      values: {
        name,
        phone,
        street,
        city,
        zip,
        state
      }
    })
    newAddress.save()
    .then(address => {
      return User.findOneAndUpdate(
        { _id, brandName },
        { $push: { addresses: address._id }},
        { new: true }
      )
      .then(user => createCharge({
        address,
        cart,
        stripeToken,
        res,
        req,
        user
      }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  } else {
    return Address.findOne({ _id: fullAddress, brandName })
    .then(address => {
      return User.findOne({ _id })
      .then(user => createCharge({
        address,
        cart,
        stripeToken,
        res,
        req,
        user
      }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  }
}

const createCharge = async ({
  address,
  cart,
  req: { params: { brandName }},
  res,
  stripeToken,
  user
}) => {
  const {
    _id,
    values: { firstName, lastName, email }
  } = user
  try {
    const apiConfig = await ApiConfig.findOne({ brandName })
    const { values: { stripeSkLive, stripeSkTest }} = apiConfig
    if (!stripeSkLive && !stripeSkTest) throw 'Unable to create charge, no stripe api keys found'
    const stripe = require("stripe")(stripeSkLive || stripeSkTest)
    const charge = await stripe.charges.create({
      amount: Math.round(cart.total),
      currency: "usd",
      source: stripeToken,
      description: `${brandName} Order`
    })
    if (!charge) throw 'Unable to create charge,'
    const order = await new Order({
      address: address.values,
      cart,
      email,
      firstName,
      brandName,
      lastName,
      paymentId: charge.id,
      total: cart.total,
      user: _id,
    }).save()

    const { name, phone, street, city, state, zip } = address

    const htmlOrder = `
      <div style="font-weight: 900">Order Summary</div>
      <div>Order: ${order._id}</div>
      <div>Total: ${formatPrice(order.cart.total)}</div>
      <div>Quantity: ${order.cart.quantity}</div>
      <div>Items:</div>
      <ol>
        ${order.cart.items.map(item => (
          `<li style="display:flex;flex-flow:row wrap;align-items:center;font-family:inherit;">
            ${item.productQty} of <img src=${item.image.src} alt="order item" height="32px" width="auto" style="margin-left:8px;margin-right:8px"/> ${item.name} ${item.productId}
          </li>`
        ))}
      </ol>
      <div style="font-weight: 900">Delivery Summary</div>
      <div>${name}</div>
      <div>${phone}</div>
      <div>${street}</div>
      <div>${city}, ${state} ${zip}</div>
    `
    const mailData = await sendGmail({
      brandName,
      to: email,
      toSubject: 'Thank you for your order!',
      toBody: `
        <p>Hi ${firstName},</p>
        <p>Thank you for your recent order ${order._id}.  We are preparing your order for delivery and will send you a confirmation once it has shipped.  Please don't hesitate to reach out regarding anything we can with in the interim.</p>
        ${htmlOrder}
      `,
      fromSubject: `New order received!`,
      fromBody: `
        <p>${firstName} ${lastName} just placed order an order!</p>
        ${htmlOrder}
        <p>Once shipped, you can mark the item as shipped in at <a href="${brandName}/admin/orders">${brandName}/admin/orders</a> to send confirmation to ${firstName}.</p>
      `
    })
    res.send({ order, user })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}


export const get = async (req, res) => {
  const {
    params: { brandName },
    user
  } = req
  try {
    const orders = await Order.find({ user: user._id, brandName })
    if (!orders) throw 'No orders found'
    res.send(orders)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}

export const getAdmin = async (req, res) => {
  const { brandName } = req
  try {
    const orders = await Order.find({ brandName })
    if (!orders) throw 'No orders found'
    res.send(orders)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    body: { type },
    params: { _id, brandName }
  } = req
  switch (type) {
    case 'SHIPPED':
      Order.findOneAndUpdate(
        { _id, brandName },
        { $set: { shipped: true, shipDate: new Date() }},
        { new: true }
      )
      .then(order => {
        const { email, firstName, lastName, cart, address } = order
        const { name, phone, street, city, state, zip } = address
        res.send(order)
        sendGmail({
          brandName,
          to: email,
          toSubject: 'Your order has shipped!',
          toBody: `
            <p>Hi ${firstName},</p>
            <p>Order ${order._id} is on it's way!</p>
          `,
          fromSubject: `Order shipped!`,
          fromBody: `
            <p>Order ${order._id} has been changed to shipped!</p>
            <div>Order: ${order._id}</div>
            <div>Total: ${formatPrice(order.cart.total)}</div>
            <div>Quantity: ${order.cart.quantity}</div>
            <div>Items:</div>
            <ul>
              ${order.cart.items.map(item => `<li>${item.productQty} of ${item.name} ${item.productId}</li>`)}
            </ul>
            <div>Address:</div>
            <div>${name}</div>
            <div>${phone}</div>
            <div>${street}</div>
            <div>${city}, ${state} ${zip}</div>
          `})
        })
        .catch(error => { console.error(error); res.status(400).send({ error })})
      break
    default:
      return
  }
}
