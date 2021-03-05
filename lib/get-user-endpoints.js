const AWS = require('aws-sdk')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()

async function getUserEnpoints (userId) {
  const params = {
    ApplicationId: pinpointApplicationId,
    UserId: userId
  }

  const pinpointResult = await pinpoint.getUserEndpoints(params).promise()

  return {
    pinpointResult
  }
}

module.exports = getUserEnpoints
