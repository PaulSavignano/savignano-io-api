import { ObjectID } from 'mongodb'
import crypto from 'crypto'
import fetch from 'node-fetch'
import bcrypt from 'bcryptjs'

import Address from '../models/Address'
import Brand from '../models/Brand'
import Order from '../models/Order'
import ResetToken from '../models/ResetToken'
import User from '../models/User'
import sendGmail from '../utils/sendGmail'
import createTokens from '../utils/createTokens'
import createUserResponse from '../utils/createUserResponse'


export const add = async (req, res) => {
  const {
    body: {
      email,
      firstName,
      lastName,
      password
    },
    params: { clientName }
  } = req
  console.log('req.params', req.params)
  console.log('clientName', clientName)
  if ( !email || !firstName || !firstName || !password) {
    return res.status(422).send({ error: 'You must provide all fields' });
  }
  try {
    const existingUser = await User.findOne({ 'values.email': email, clientName })
    if (existingUser) {
      throw 'That user already exists'
    }
    const user = await new User({
      clientName,
      password,
      values: { email, firstName, lastName }
    }).save()
    const { newAccessToken, newRefreshToken } = await createTokens(user, clientName)
    const { values } = user
    sendGmail({
      clientName,
      to: values.email,
      toSubject: `Welcome to ${clientName}!`,
      toBody: `
        <p>Hi ${values.firstName},</p>
        <p>Thank you for joining ${clientName}!</p>
        <p>I hope you enjoy our offerings.  You may modify your profile settings at <a href="${clientName}/user/profile">${clientName}/user/profile</a>.</p>
        <p>Please let us know if there is anything we can do to better help you.</p>
      `,
      fromSubject: `New ${clientName} user!`,
      fromBody: `
        <p>New user ${values.firstName} ${values.lastName} just signed up at ${clientName}.</p>
        `
    })
    res.set('x-access-token', newAccessToken)
    res.set('x-refresh-token', newRefreshToken)
    res.send({ user })
  } catch (error) {
    console.error({ error })
    res.status(400).send({ error: { email: 'that user already exists' }})
  }
}



export const get = (req, res) => {
  const {
    params: { clientName },
    user
  } = req
  return createUserResponse(user, clientName)
  .then(({ user, users, orders }) => {
    res.send({ user, users, orders })
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const update = (req, res) => {
  const {
    body: { type, values },
    user
  } = req
  user.values = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone
  }
  user.save()
  .then(() => res.send(user))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}


export const remove = (req, res) => {
  const { params: { clientName }, user } = req
  User.findOneAndRemove(
    { _id: user._id, clientName }
  )
  .then(user => res.status(200).send(user))
  .catch(error => {
    console.error('User remove()', error)
    res.status(400).send({ error: 'user delete failed' })
  })
}



export const signin = async (req, res) => {
  const {
    body: { email, password },
    params: { clientName }
  } = req
  console.log(clientName)
  const user = await User.findOne({ 'values.email': email, clientName })
  if (!user) {
    return res.status(400).send({ error: { email: 'email not found' }})
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(400).send({ error: { password: 'password does not match' }})
  }
  const { newAccessToken, newRefreshToken } = await createTokens(user, clientName)
  console.log('newAccessToken: ', newAccessToken)
  console.log('newRefreshToken: ', newRefreshToken)
  const response = await createUserResponse(user, clientName)
  res.set('x-access-token', newAccessToken);
  res.set('x-refresh-token', newRefreshToken);
  console.log('res headrers', res.headers)
  res.send(response)
}




export const recovery = (req, res, next) => {
  const {
    body: { email },
    params: { clientName }
  } = req
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (error, buf) => {
      if (error) return reject(error)
      resolve(buf.toString('hex'));
    })
  })
  .then(resetToken => {
    User.findOne({ 'values.email': email.toLowerCase(), clientName })
    .then(user => {
      if (!user) return Promise.reject({ email: 'User not found.' })
      const path = `${clientName}user/reset/${resetToken}`
      const newResetToken = new ResetToken({
        clientName,
        resetToken,
        user: user._id
      })
      newResetToken.save()
      .then(() => {
        const { firstName, email } = user.values
        sendGmail({
          clientName,
          to: email,
          toSubject: 'Reset Password',
          toBody: `
            <p>Hi ${firstName},</p>
            <p>Click the link below to recover your password.</p>
            <a href="${path}" style="color: black; text-decoration: none;">
              ${path}
            </a>
            `
        })
        res.send({ message: `A password recovery email has been sent to ${email}.`})
      })
      .catch(error => { console.error(error); res.status(400).send({ error })})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
}


export const reset = async (req, res) => {
  const {
    body: { password },
    params: { clientName, resetToken }
  } = req
  try {
    const { user } = await ResetToken.findOne({ resetToken, clientName }).populate('user')
    if (!user) return Promise.reject('your reset token has expired')
    user.password = password
    await user.save()
    const { newAccessToken, newRefreshToken } = await createTokens(user, clientName)
    const response = await createUserResponse(user, clientName)
    res.set('x-access-token', newAccessToken);
    res.set('x-refresh-token', newRefreshToken);
    res.send(response)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}




export const contact = (req, res) => {
  const {
    body: {
      email,
      firstName,
      message,
      phone
    },
    params: { clientName }
  } = req
  if (!firstName || !email || !message) {
    return res.status(422).send({ error: 'You must provide all fields' });
  }
  Brand.findOne({ clientName })
  .then(brand => {
    if (!brand) return Promise.reject('brand not found')
    const { name } = brand.business.values
    sendGmail({
      clientName,
      to: email,
      toSubject: `Thank you for contacting ${name}!`,
      name: firstName,
      toBody: `<p>Thank you for contacting ${name}.  We will respond to your request shortly!</p>`,
      fromSubject: `New Contact Request`,
      fromBody: `
        <p>${firstName} just contacted you through ${clientName}.</p>
        <div>Phone: ${phone ? phone : 'not provided'}</div>
        <div>Email: ${email}</div>
        <div>Message: ${message}</div>
      `
    })
    .then(info => {
      res.send({ message: 'Thank you for contacting us, we will respond to you shortly!'})
    })
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })

}


export const requestEstimate = (req, res) => {
  const {
    body: {
      date,
      firstName,
      lastName,
      phone,
      email,
      from,
      to,
      size,
      note
    },
    params: { clientName }
  } = req
  var auth = 'Basic ' + new Buffer(process.env.MOVERBASE_KEY + ':').toString('base64')
  return fetch(`https://api.moverbase.com/v1/leads/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify({
     date,
     firstName,
     lastName,
     phone,
     email,
     from: { postalCode: from },
     to: { postalCode: to },
     size: { title: size },
     note
    })
  })
  .then(res => res.json())
  .then(json => {
    sendGmail({
      clientName,
      to: email,
      toSubject: 'Thank you for contacting us for a free estimate',
      name: firstName,
      toBody: `<p>Thank you for requesting a free estimate.  We will contact you shortly!</p>`,
      fromSubject: `New Estimate Request`,
      fromBody: `
        <p>${firstName} just contacted you through ${clientName}.</p>
        ${phone && `<div>Phone: ${phone}</div>`}
        <div>Email: ${email}</div>
        <div>Note: ${note}</div>
      `
    })
    .then(info => res.status(200).send())
    .catch(error => { console.error(error); res.status(400).send({ error })})
  })
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
