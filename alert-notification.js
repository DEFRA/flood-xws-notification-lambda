const AWS = require('aws-sdk')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()
const campaignTemplate = require('./campaign-template.json')
const segmentTemplate = require('./segment-template.json')
const parse = require('json-templates')

async function createSegment (areaCode) {
  const template = parse(segmentTemplate)
  const params = template({
    applicationId: pinpointApplicationId,
    name: areaCode,
    areaCode
  })
  console.log(JSON.stringify(params, null, 4))
  try {
    const { SegmentResponse: { Id: id, Version: version } } = await pinpoint.createSegment(params).promise()
    console.log({ error: false, id, version })
    return { id, version }
  } catch (err) {
    console.log({ error: true, err })
  }
}

async function createCampaign (segmentId, segmentVersion, areaCode, headline, description) {
  const template = parse(campaignTemplate)

  const body = `<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body><p>${description}</p></body></html>`

  const params = template({
    applicationId: pinpointApplicationId,
    headline,
    body,
    name: areaCode,
    segmentId,
    segmentVersion
  })

  console.log(JSON.stringify(params, null, 4))

  try {
    const pinpointResult = await pinpoint.createCampaign(params).promise()
    console.log({ error: false, pinpointResult })
    return {
      pinpointResult
    }
  } catch (err) {
    console.log({ error: true, err })
  }
}

async function handler (event) {
  // console.log({ event })
  const { Records: records } = event
  const record = records[0]
  const { Sns: data } = record
  console.log({ data })

  const message = JSON.parse(data.Message)

  console.log({ message })

  const { id, version } = await createSegment(message.area_code)
  await createCampaign(id, version, message.area_code, message.headline, message.description)
}

module.exports = { handler }
