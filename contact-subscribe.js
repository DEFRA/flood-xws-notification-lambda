// const AWS = require('aws-sdk')
// const sqs = new AWS.SQS()
// const queueUrl = process.env.MESSAGES_QUEUE_URL

async function handler (event) {
  console.log(event, event.Records[0].Sns)
}

module.exports = { handler }
