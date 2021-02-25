const AWS = require('aws-sdk')
const sqs = new AWS.SQS()
const queueUrl = process.env.MESSAGES_QUEUE_URL

const db = {
  '013FWFCH34': [
    {
      type: 'email',
      value: 'neil.mclaughlin@defra.gov.uk'
    },
    {
      type: 'email',
      value: 'david.stone1@environment-agency.gov.uk'
    },
    {
      type: 'sms',
      value: '+447500093752'
    },
    {
      type: 'sms',
      value: '+447393268215'
    }
  ],
  '122FWF407': [
    {
      type: 'email',
      value: 'neil.mclaughlin@defra.gov.uk'
    },
    {
      type: 'email',
      value: 'david.stone1@environment-agency.gov.uk'
    },
    {
      type: 'sms',
      value: '+447500093752'
    },
    {
      type: 'sms',
      value: '+447393268215'
    }
  ]
}

async function getContacts (areaCode) {
  return Promise.resolve(db[areaCode] || [])
}

async function handler (event) {
  console.log(event, event.Records[0].Sns)

  const { Records: records } = event
  const record = records[0]
  console.log(record)

  const { Sns: data } = record
  console.log(data)

  const areaCode = data.MessageAttributes.area_code.Value
  const messageId = data.MessageId
  const message = JSON.parse(data.Message)
  const { headline, description } = message
  console.log('Message ID', messageId, 'Message', message)

  // Get the contacts that are subscribed to the area code
  const contacts = await getContacts(areaCode)

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]
    const { type, value } = contact

    const params = {
      MessageBody: JSON.stringify({ value, headline, description }),
      QueueUrl: queueUrl,
      MessageAttributes: {
        type: { DataType: 'String', StringValue: type }
      }
    }

    await sqs.sendMessage(params).promise()
  }
  console.log(event, db)
}

module.exports = { handler }
