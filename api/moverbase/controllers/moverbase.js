import fetch from 'node-fetch'

import sendGmail from '../../utils/sendGmail'
import ApiConfig from '../../models/ApiConfig'

export const requestEstimate = async (req, res) => {
  const {
    body,
    params: { brandName }
  } = req
  try {
    const moverbaseApiKey = await ApiConfig.findOne({ brandName })
    if (!moverbaseApiKey) throw 'Sorry, there was no moverbase api key found'
    const auth = 'Basic ' + new Buffer(moverbaseApiKey.values.moverbaseKey + ':').toString('base64')
    console.log('moverbase api key: ', moverbaseApiKey.values.moverbaseKey)
    console.log('moverbase auth: ', auth)
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
    console.log('moverbase json: ', json)
    const emailInfo = await sendGmail({
      brandName,
      to: body.email,
      toSubject: 'Thank you for contacting us for a free estimate',
      name: body.firstName,
      toBody: `<p>Thank you for requesting a free estimate.  We will contact you shortly!</p>`,
      fromSubject: `New Estimate Request`,
      fromBody: `
        <p>${bod.firstName} just contacted you through ${brandName}.</p>
        ${body.phone && `<div>Phone: ${body.phone}</div>`}
        <div>Email: ${body.email}</div>
        <div>Note: ${body.note}</div>
      `
    })
    res.status(200).send()
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}
