const getEndpoint = require('./lib/get-endpoint')

async function handler (event) {
  console.log(event)

  const { pathParameters = {} } = event
  const { channel_type: channelType, endpoint_id: endpointId } = pathParameters

  const pinpointResult = await getEndpoint(endpointId, channelType)

  return {
    statusCode: 200,
    body: JSON.stringify(pinpointResult)
  }
}

module.exports = { handler }
