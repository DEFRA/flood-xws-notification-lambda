const AWS = require('aws-sdk')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()

async function deleteUserEnpoints (userId) {
  const params = {
    ApplicationId: pinpointApplicationId,
    UserId: userId
  }

  const pinpointResult = await pinpoint.deleteUserEndpoints(params).promise()

  return {
    pinpointResult
  }
}

module.exports = deleteUserEnpoints
