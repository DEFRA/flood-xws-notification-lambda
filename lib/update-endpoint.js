const AWS = require('aws-sdk')
const getEndpointFromAddress = require('./get-endpoint-from-address')
const pinpointApplicationId = process.env.PINPOINT_APPLICATION_ID
const pinpoint = new AWS.Pinpoint()

async function updateEndpoint (address, channelType, lists) {
  const endpointId = getEndpointFromAddress(address, channelType)

  const params = {
    ApplicationId: pinpointApplicationId,
    EndpointId: endpointId,
    EndpointRequest: {
      Address: endpointId,
      ChannelType: channelType,
      //   Attributes: {
      //     '<__string>': [
      //       'STRING_VALUE'
      //       /* more items */
      //     ]
      //     /* '<__string>': ... */
      //   },
      //   Demographic: {
      //     AppVersion: 'STRING_VALUE',
      //     Locale: 'STRING_VALUE',
      //     Make: 'STRING_VALUE',
      //     Model: 'STRING_VALUE',
      //     ModelVersion: 'STRING_VALUE',
      //     Platform: 'STRING_VALUE',
      //     PlatformVersion: 'STRING_VALUE',
      //     Timezone: 'STRING_VALUE'
      //   },
      //   EffectiveDate: 'STRING_VALUE',
      //   EndpointStatus: 'STRING_VALUE',
      //   Location: {
      //     City: 'STRING_VALUE',
      //     Country: 'STRING_VALUE',
      //     Latitude: 'NUMBER_VALUE',
      //     Longitude: 'NUMBER_VALUE',
      //     PostalCode: 'STRING_VALUE',
      //     Region: 'STRING_VALUE'
      //   },
      //   Metrics: {
      //     '<__string>': 'NUMBER_VALUE'
      //     /* '<__string>': ... */
      //   },
      //   OptOut: 'STRING_VALUE',
      //   RequestId: 'STRING_VALUE',
      User: {
        UserAttributes: { lists },
        UserId: endpointId
      }
    }
  }

  const pinpointResult = await pinpoint.updateEndpoint(params).promise()

  return {
    pinpointResult
  }
}

module.exports = updateEndpoint
