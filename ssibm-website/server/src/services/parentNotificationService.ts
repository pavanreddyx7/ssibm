import twilio from 'twilio'
import { env } from '../config/env.js'

type NotifyType = 'sms' | 'call' | 'both'

type ParentAlertRecipient = {
  studentUid: string
  studentName: string
  rollNumber: string
  parentPhone: string
}

type SendParentAlertsInput = {
  facultyUid: string
  courseCode: string
  courseName: string
  date: string
  recipients: ParentAlertRecipient[]
  notifyType: NotifyType
}

export async function sendParentAlerts(input: SendParentAlertsInput) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio environment variables are not configured on the server.')
  }

  const accountSid = env.TWILIO_ACCOUNT_SID
  const authToken = env.TWILIO_AUTH_TOKEN
  const fromNumber = env.TWILIO_PHONE_NUMBER
  const client = twilio(accountSid, authToken)
  const results = await Promise.all(
    input.recipients.map(async (recipient) =>
      sendAlertForStudent(client, {
        ...input,
        recipient,
        fromNumber,
      }),
    ),
  )

  return {
    sentCount: results.filter((item) => item.sent).length,
    skippedCount: results.filter((item) => !item.sent).length,
    results,
  }
}

async function sendAlertForStudent(
  client: ReturnType<typeof twilio>,
  input: SendParentAlertsInput & { recipient: ParentAlertRecipient; fromNumber: string },
) {
  if (!input.recipient.parentPhone) {
    return {
      studentUid: input.recipient.studentUid,
      sent: false,
      reason: 'Parent phone number is missing.',
    }
  }

  const studentName = input.recipient.studentName
  const rollNumber = input.recipient.rollNumber
  const to = toE164(input.recipient.parentPhone)
  const message = `Dear Parent, your ward ${studentName} (${rollNumber}) was absent for ${input.courseName} on ${input.date}. Please ensure regular attendance. - SSIBM`

  const result: {
    studentUid: string
    sent: boolean
    smsSent: boolean
    callMade: boolean
    smsSid?: string
    callSid?: string
    reason?: string
  } = {
    studentUid: input.recipient.studentUid,
    sent: false,
    smsSent: false,
    callMade: false,
  }

  if (input.notifyType === 'sms' || input.notifyType === 'both') {
    try {
      const sms = await client.messages.create({
        body: message,
        from: input.fromNumber,
        to,
      })
      result.smsSent = true
      result.smsSid = sms.sid
      console.log(`SMS sent to ${to} — SID: ${sms.sid}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`SMS failed to ${to}: ${msg}`)
      result.reason = msg
    }
  }

  if (input.notifyType === 'call' || input.notifyType === 'both') {
    try {
      const call = await client.calls.create({
        twiml: buildTwiml(message),
        from: input.fromNumber,
        to,
      })
      result.callMade = true
      result.callSid = call.sid
      console.log(`Call initiated to ${to} — SID: ${call.sid}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Call failed to ${to}: ${msg}`)
      result.reason = msg
    }
  }

  result.sent = result.smsSent || result.callMade

  return result
}

function toE164(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (phone.startsWith('+')) return `+${digits}`
  if (digits.length === 10) return `+91${digits}`

  return `+${digits}`
}

function buildTwiml(message: string) {
  return `<Response><Say voice="alice" language="en-IN">Hello. This is an automated message from S S I B M college. ${escapeXml(message)}. We repeat: ${escapeXml(message)}. Please contact the college for more information. Thank you.</Say></Response>`
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
