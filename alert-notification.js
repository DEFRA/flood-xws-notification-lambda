// const AWS = require('aws-sdk')

async function handler (event) {
  // console.log({ event })
  const { Records: records } = event
  const record = records[0]
  // console.log({ record })
  const { Sns: data } = record
  console.log({ data })

  const message = JSON.parse(data.Message)

  console.log({ message })

  // get alert url from event
  // get alert from s3
  // create campaign for target area
}

module.exports = { handler }
