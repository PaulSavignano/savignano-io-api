import { ObjectID } from 'mongodb'

import ApiConfig from '../models/ApiConfig'

export const add = (req, res) => {
  console.log('inside add')
  const {
    body: { values },
    params: { clientName }
  } = req
  const newDoc = new ApiConfig({ values, clientName })
  newDoc.save()
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}

export const get = async (req, res) => {
  const { clientName } = req.params
  try {
    const config = await ApiConfig.findOne({ clientName })
    if (!config) throw 'No config found'
    res.send(config)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}


export const update = async (req, res) => {
  console.log('inside update')
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id' })
  const {
    body: { values },
    params: { _id, clientName },
  } = req
  console.log('updating', _id, clientName, values)
  try {
    const config = await ApiConfig.findOneAndUpdate(
      { _id, clientName },
      { $set: { values }},
      { new: true }
    )
    if (!config) throw 'Update failed, could not find the config'
    res.send(config)
  } catch (error) {
    console.error(error)
    res.status(400).send({ error })
  }
}



export const remove = (req, res) => {
  if (!ObjectID.isValid(req.params._id)) return res.status(404).send({ error: 'Invalid id'})
  const {
    params: { _id, clientName }
  } = req
  ApiConfig.findOneAndRemove({ _id, clientName })
  .then(doc => res.send(doc))
  .catch(error => { console.error(error); res.status(400).send({ error })})
}
