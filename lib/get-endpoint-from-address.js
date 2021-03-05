const { parsePhoneNumber, types } = require('xws-shared/util/phonenumber')

function getEndpointFromAddress (address, channelType) {
  let endpointId = address

  if (channelType === 'SMS') {
    // Parse number
    const parsed = parsePhoneNumber(address)
    const { type, e164 } = parsed

    // Only allow FIXED_LINE and MOBILE
    const isCorrectType = type === types.MOBILE

    if (!isCorrectType) {
      throw new Error('Incorrect address type for SMS channel', type)
    }

    endpointId = e164
  } else if (channelType === 'VOICE') {
    // Parse number
    const parsed = parsePhoneNumber(address)
    const { type, e164 } = parsed

    // Only allow FIXED_LINE and MOBILE
    const isCorrectType = type === types.FIXED_LINE

    if (!isCorrectType) {
      throw new Error('Incorrect address type for VOICE channels', type)
    }

    endpointId = e164
  }

  return endpointId
}

module.exports = getEndpointFromAddress
