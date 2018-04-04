import fetch from 'node-fetch'

import sendGmail from '../../utils/sendGmail'
import ApiConfig from '../../models/ApiConfig'

export const requestEstimate = async (req, res) => {
  const {
    body,
    params: { brandName }
  } = req
  try {
    const config = await ApiConfig.findOne({ brandName })
    if (!config) throw 'Sorry, there was no config found'
    const auth = `Basic ${new Buffer(config.values.moverbaseKey + ':').toString('base64')}`
    const res = await fetch(`https://api.moverbase.com/v1/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify(body)
    })
    const { email, firstName, phone, note } = body
    const emailInfo = await sendGmail({
      brandName,
      to: email,
      toSubject: 'Thank you for contacting us for a free estimate',
      name: firstName,
      toBody: `<p>Thank you for requesting a free estimate.  We will contact you shortly!</p>`,
      fromSubject: `New Estimate Request`,
      fromBody: `
        <p>${firstName} just contacted you through ${brandName}.</p>
        ${phone && `<div>Phone: ${phone}</div>`}
        <div>Email: ${email}</div>
        <div>Note: ${note}</div>
      `
    })
    res.status(200).send()
  } catch (error) {
    console.error('Error is: ', error)
    res.status(400).send({ error })
  }
}
