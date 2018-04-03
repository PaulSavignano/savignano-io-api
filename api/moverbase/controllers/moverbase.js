import fetch from 'node-fetch'

import sendGmail from '../../utils/sendGmail'
import ApiConfig from '../../models/ApiConfig'

export const requestEstimate = async (req, res) => {
  const {
    body,
    params: { brandName }
  } = req
  const moverbaseApiKey = await ApiConfig.findOne({ brandName })
  if (!moverbaseApiKey) throw 'Sorry, there was no moverbase api key found'
  const auth = 'Basic ' + new Buffer(moverbaseApiKey.values.moverbaseKey + ':').toString('base64')
  try {
    const response = await fetch(`https://api.moverbase.com/v1/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify({ ...body })
    })
    console.log('moverbase res: ', response)
    const json = await response.json()
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
    console.error(error)
    res.status(400).send({ error })
  }
}
