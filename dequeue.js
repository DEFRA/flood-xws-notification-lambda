const { NotifyClient } = require('notifications-node-client')
const notify = new NotifyClient(process.env.NOTIFY_API_KEY)
const notifySmsTemplateId = process.env.NOTIFY_SMS_TEMPLATE_ID
const notifyEmailTemplateId = process.env.NOTIFY_EMAIL_TEMPLATE_ID

async function handler (event) {
  const { Records } = event
  const record = Records[0]
  console.log(record, record.messageAttributes)

  const { messageId } = record
  const type = record.messageAttributes.type.stringValue
  const { value, headline, description } = JSON.parse(record.body)

  console.log({ messageId, type, value, headline, description })

  let result

  switch (type) {
    case 'sms':
      result = await notify.sendSms(notifySmsTemplateId, value, {
        reference: messageId,
        personalisation: { body: description }
      })
      break
    case 'email':
      result = await notify.sendEmail(notifyEmailTemplateId, value, {
        reference: messageId,
        personalisation: { headline, body: description }
      })
      break
    default:
      break
  }

  console.log(result)
}

module.exports = { handler }
