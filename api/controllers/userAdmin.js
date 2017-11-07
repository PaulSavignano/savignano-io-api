import { ObjectID } from 'mongodb'
import crypto from 'crypto'
import fetch from 'node-fetch'

import Address from '../models/Address'
import Brand from '../models/Brand'
import Order from '../models/Order'
import User from '../models/User'

export const adminAdd = async (req, res) => {
  const {
    body: {
      email,
      firstName,
      lastName,
      password
    },
    params: { clientName }
  } = req
  if ( !email || !firstName || !firstName || !password) {
    return res.status(422).send({ error: 'You must provide all fields' });
  }
  try {
    const existingUser = await User.findOne({ 'values.email': email, clientName })
    if (existingUser) {
      throw 'that user already exists'
    }
    const user = await new User({
      clientName,
      password,
      values: { email, firstName, lastName }
    }).save()
    res.send(user)
  } catch (error) {
    res.status(400).send({ error: { email: 'User already exists'}})
  }
}


export const adminGet = async (req, res) => {
  const { clientName } = req.params
  try {
    const users = await User.find({ clientName })
    if (users) return res.send(users)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}

export const adminUpdate = async (req, res) => {
  const {
    body: { values, type },
    params: { _id, clientName },
  } = req
  try {
    const existingUser = await User.findOne({ _id, clientName })
    if (!existingUser) throw 'User not found'
    switch(type) {
      case 'UPDATE_VALUES':
        return User.findOneAndUpdate(
          { _id, clientName },
          { $set: { values }},
          { new: true }
        )
        .populate('addresses')
        .then(user => res.send(user))
        .catch(error => { console.error(error); res.status(400).send({ error })})
      case 'UPDATE_ROLES':
        const roles = values.owner ?
        [ 'admin', 'owner', 'user' ]
        :
        values.admin ?
        [ 'admin', 'user' ]
        :
        [ 'user' ]
        return User.findOneAndUpdate(
            { _id },
            { $set: { roles: roles }},
            { new: true }
          )
          .populate('addresses')
          .then(user => res.send(user))
          .catch(error => { console.error(error); res.status(400).send({ error })})
      default:
        return
    }
  } catch (error) {
    console.error({ error })
    res.status(400).send({ error })
  }
}

export const adminRemove = (req, res) => {
  const {
    params: { _id, clientName }
  } = req
  User.findOneAndRemove({ _id, clientName })
  .then(doc => res.send(doc))
  .catch(error => { console.error({ error }); res.status(400).send({ error })})
}
