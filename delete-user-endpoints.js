const deleteUserEndpoints = require('./lib/delete-user-endpoints')

async function handler (event) {
  console.log(event)

  const { pathParameters = {} } = event
  const { user_id: userId } = pathParameters

  const pinpointResult = await deleteUserEndpoints(userId)

  return {
    statusCode: 200,
    body: JSON.stringify(pinpointResult)
  }
}

module.exports = { handler }
