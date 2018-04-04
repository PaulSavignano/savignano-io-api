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
    console.log('auth: ', auth)
    const res = await fetch(`https://api.moverbase.com/v1/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify({...body})
    })
    console.log('res: ', res)
    const json = await response.json()
    console.log('json: ', json)
    res.status(200).send()
  } catch (error) {
    console.error('Error is: ', error)
    res.status(400).send({ error })
  }
}
