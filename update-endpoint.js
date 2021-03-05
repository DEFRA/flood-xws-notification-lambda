const updateEndpoint = require('./lib/update-endpoint')

async function handler (event) {
  console.log(event)

  const { pathParameters = {}, body = '' } = event
  const payload = JSON.parse(body)
  const { lists } = payload
  const { channel_type: channelType, endpoint_id: endpointId } = pathParameters

  const pinpointResult = await updateEndpoint(endpointId, channelType, lists)

  return {
    statusCode: 200,
    body: JSON.stringify(pinpointResult)
  }
}

module.exports = { handler }
