const AWS = require('aws-sdk')

const bucketName = process.env.FILES_BUCKET_NAME

async function handler (event) {
  try {
    const { Records: records } = event
    const record = records[0]
    const { Sns: data } = record
    console.log(record)
    const { Message: message, MessageAttributes: attributes, MessageId: id } = data
    console.log(message, attributes, bucketName)

    const s3bucket = new AWS.S3({
      region: 'eu-west-2'
    })

    const params = {
      Bucket: bucketName,
      Key: `${id}.xml`,
      Body: message
    }

    await s3bucket.putObject(params).promise()

    return {
      statusCode: 200
    }
  } catch (err) {
    console.error(err)

    return {
      statusCode: 500
    }
  }
}

module.exports = { handler }
