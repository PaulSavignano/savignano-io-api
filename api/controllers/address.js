import { ObjectID } from 'mongodb'

import Address from '../models/Address'
import User from '../models/User'

export const add = (req, res) => {
  const {
    params: { clientName },
    user
  } = req
  const newDoc = new Address({
    clientName,
    user: ObjectID(user._id),
    values: {}
  })
  newDoc.save()
  .then(address => {
    User.findOneAndUpdate(
      { _id: address.user, clientName },
      { $push: { addresses: address._id }},
      { new: true }
    )
    .populate({ path: 'addresses' })
    .then(user => {
      res.send({ user })
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const adminAdd = (req, res) => {
  const {
    params: { clientName, userId },
    user
  } = req
  const newAddress = new Address({
    clientName,
    user: ObjectID(userId),
    values: {}
  })
  newAddress.save()
  .then(address => {
    User.findOneAndUpdate(
      { _id: address.user, clientName },
      { $push: { addresses: address._id }},
      { new: true }
    )
    .populate('addresses')
    .then(user => res.send(user))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}



export const get = async (req, res) => {
  const {
    params: { clientName },
    user
  } = req
  const isAdmin = user.roles.some(role => role === 'admin')
  if (isAdmin) {
    try {
      const addresses = await Address.find({ clientName })
      if (!addresses) throw 'No addresses found'
      res.send(addresses)
    } catch (error) {
      console.error({ error });
      res.status(400).send({ error })
    }
  } else {
    try {
      const address = await Address.find({ user: user._id, clientName })
      if (!address) throw 'No address found'
      res.send(addresses)
    } catch (error) {
      console.error(error)
      res.status(400).send({ error })
    }
  }
}



export const update = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: {
      values
    },
    params: { _id, clientName },
    user
  } = req
  Address.findOneAndUpdate(
    { _id, user: user._id, clientName },
    { $set: { values }},
    { new: true }
  )
  .then(address => {
    User.findOne({ _id: address.user, clientName })
    .then(user => res.send(user))
    .catch(error => { console.log({ error }); res.status(400).send({ error })})
  })
  .catch(error => { console.log(error); res.status(400).send({ error })})
}

export const adminUpdate = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, clientName },
    user
  } = req
  const isOwner = user.roles.some(role => role === 'owner')
  if (!isOwner) return res.status(400).send({ error: 'umauthorized'})
  Address.findOneAndUpdate(
    { _id, clientName },
    { $set: { values }},
    { new: true }
  )
  .then(address => {
    User.findOne({ _id: address.user, clientName })
    .then(user => res.send(user))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.log(error); res.status(400).send({ error })})
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, clientName }
  } = req
  Address.findOneAndRemove({ _id })
  .then(address => {
    return User.findOneAndUpdate(
      { _id: address.user, clientName },
      { $pull: { addresses:  address._id }},
      { new: true }
    )
    .then(() => {
      User.findOne({ _id: req.user._id, clientName })
      .then(user => res.send({ user }))
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const adminRemove = (req, res) => {
  if (!ObjectID.isValid(req.params._id) || !ObjectID.isValid(req.params.userId)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, clientName, userId },
    user
  } = req
  Address.findOneAndRemove({ _id, clientName })
  .then(address => {
    User.findOneAndUpdate(
      { _id: address.user, clientName },
      { $pull: { addresses:  address._id }},
      { new: true }
    )
    .then(user => res.send({ address, user }))
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
