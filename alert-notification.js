const AWS = require('aws-sdk')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()
const campaignTemplate = require('./campaign-template.json')
const parse = require('json-templates')

async function createCampaign (areaCode, headline, description) {
  const template = parse(campaignTemplate)

  const body = `<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body><p>${description}</p></body></html>`

  const params = template({
    applicationId: pinpointApplicationId,
    headline,
    body,
    name: areaCode,
    segmentId: '31a8bccb8cfe4f48a0184ef2e932cbf7',
    segmentVersion: 1
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
  // console.log({ record })
  const { Sns: data } = record
  console.log({ data })

  const message = JSON.parse(data.Message)

  console.log({ message })

  // get alert url from event
  // get alert from s3
  // create campaign for target area
  await createCampaign(message.area_code, message.headline, message.description)
}

module.exports = { handler }
