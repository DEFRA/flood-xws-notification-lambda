const getUserEndpoints = require('./lib/get-user-endpoints')

async function handler (event) {
  console.log(event)

  const { pathParameters = {} } = event
  const { user_id: userId } = pathParameters

  const pinpointResult = await getUserEndpoints(userId)

  return {
    statusCode: 200,
    body: JSON.stringify(pinpointResult)
  }
}

module.exports = { handler }
