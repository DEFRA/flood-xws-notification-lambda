const AWS = require('aws-sdk')
const { parse } = require('caplib')
const { Feed } = require('feed')
const ddb = new AWS.DynamoDB.DocumentClient()
const filesBucketName = process.env.FILES_BUCKET_NAME
const filesBucketUrl = process.env.FILES_BUCKET_URL
const alertsTableName = process.env.ALERTS_TABLE_NAME
const s3 = new AWS.S3()

async function handler (event) {
  console.log(event, event.Records[0].s3)
  //= >
  // {
  //   Records: [
  //     {
  //       eventVersion: '2.1',
  //       eventSource: 'aws:s3',
  //       awsRegion: 'eu-west-2',
  //       eventTime: '2021-02-23T12:37:06.572Z',
  //       eventName: 'ObjectCreated:Put',
  //       userIdentity: [Object],
  //       requestParameters: [Object],
  //       responseElements: [Object],
  //       s3: [Object]
  //     }
  //   ]
  // } {
  //   s3SchemaVersion: '1.0',
  //   configurationId: 'xws-dev-register-f6ae83ff692d7e41e9ae36a3a5cf2905',
  //   bucket: {
  //     name: 'xws-files-dev',
  //     ownerIdentity: { principalId: 'AZVZNXKGQLYX1' },
  //     arn: 'arn:aws:s3:::xws-files-dev'
  //   },
  //   object: {
  //     key: '2507c54f-4adf-4ba9-baea-efe0cc663b69.xml',
  //     size: 933,
  //     eTag: '38a8a75cbbd5d97f87bcbbd054800d9d',
  //     sequencer: '006034F6F5243FF68F'
  //   }
  // }

  const { Records: records } = event
  const record = records[0]
  console.log(record)
  const { s3: data } = record
  console.log(data)
  const key = data.object.key
  console.log(key)

  const result = await s3.getObject({
    Key: key,
    Bucket: filesBucketName
  }).promise()

  console.log(result)
  // =>
  // {
  //   AcceptRanges: 'bytes',
  //   LastModified: 2021-02-23T12:51:03.000Z,
  //   ContentLength: 832,
  //   ETag: '"d4978636d146889dc66b083677f528b0"',
  //   ContentType: 'text/xml',
  //   Metadata: {},
  //   Body: <Buffer 3c 3f 78 6d 6c 20 76 65 72 73 69 6f... 782 more bytes>
  // }

  const { Body: body } = result
  const xml = body.toString()
  console.log(xml)
  const alert = parse(xml)
  console.log(alert)
  const { identifier, sender, source } = alert

  const info = alert.infos[0]
  const area = info.areas[0]
  const { areaDesc: areaName } = area
  const { value: areaCode } = area.geocodes[0]

  console.log(identifier, sender, source, areaName, areaCode)

  const { headline, description } = info

  const item = {
    area_code: `ALERT#${areaCode}`,
    area_name: areaName,
    identifier,
    sender,
    source,
    headline,
    description,
    updated_at: Date.now(),
    created_at: Date.now()
  }

  await ddb.put({
    TableName: alertsTableName,
    Item: item
  }).promise()

  const params = {
    TableName: alertsTableName
    // KeyConditionExpression: 'begins_with(area_code, :prefix)',
    // ExpressionAttributeValues: {
    //   ':prefix': 'ALERT#'
    // }
  }

  const result1 = await ddb.scan(params).promise()
  const alerts = result1.Items

  console.log(alerts)

  const rss = getRssFeed(alerts)

  // const s3bucket = new AWS.S3()

  const rssXml = rss.rss2()
  console.log(rssXml)

  const params1 = {
    Bucket: filesBucketName,
    Key: 'alerts.rss',
    Body: rssXml
  }

  const putObjectResult = await s3.putObject(params1).promise()

  console.log(putObjectResult)
}

function getRssFeed (alerts) {
  // {
  //   updated_at: 1614093300763,
  //   sender: 'www.gov.uk/environment-agency',
  //   created_at: 1614093300763,
  //   identifier: '2507c54f-4adf-4ba9-baea-efe0cc663b69',
  //   headline: 'Anderton',
  //   source: 'Flood warning service',
  //   area_name: 'River Weaver at Anderton',
  //   area_code: 'ALERT#013FWFCH40',
  //   description: 'Body'
  // }
  // Todo: pull titles, author etc. from service/publisher/source/sender
  const feed = new Feed({
    id: 'http://example.com/',
    title: 'Latest alerts from {TODO}',
    description: 'This is my personal feed!',
    generator: 'xws',
    link: 'http://example.com/',
    updated: new Date(),
    image: 'xws.png',
    favicon: './meta/favicon.ico',
    feedLinks: {
      json: 'https://example.com/json',
      atom: 'https://example.com/atom'
    },
    author: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      link: 'https://example.com/johndoe'
    }
  })

  alerts.forEach(alert => {
    feed.addItem({
      id: alert.identifier,
      title: alert.headline,
      link: `${filesBucketUrl}/${alert.identifier}.xml`,
      date: new Date(alert.created_at)
    })
  })

  return feed
}

// function addStylesheet (href, rss) {
//   const declaration = '<?xml version="1.0" encoding="utf-8"?>\n'
//   const decExists = rss.includes(declaration)
//   const insertIdx = decExists ? declaration.length : 0
//   const instruction = `<?xml-stylesheet type="text/xsl" href="${href}"?>\n`

//   return rss.substring(0, insertIdx) + instruction + rss.substring(insertIdx)
// }

module.exports = { handler }
