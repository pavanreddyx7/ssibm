const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { initializeApp } = require('firebase-admin/app')
const twilio = require('twilio')

initializeApp()

function toE164(phone) {
  const digits = String(phone).replace(/\D/g, '')
  if (String(phone).startsWith('+')) return '+' + digits
  if (digits.length === 10) return '+91' + digits
  return '+' + digits
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

exports.sendAbsenceNotification = onDocumentCreated(
  'parentNotifications/{docId}',
  async (event) => {
    const data = event.data?.data()
    if (!data) return

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken  = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio env vars not set')
      return
    }

    const client = twilio(accountSid, authToken)
    const to = toE164(data.parentPhone)
    const ref = event.data.ref
    const notifyType = data.notifyType ?? 'sms'  // 'sms' | 'call' | 'both'
    const results = {}

    // ── SMS ──────────────────────────────────────────────────────────────────
    if (notifyType === 'sms' || notifyType === 'both') {
      try {
        const msg = await client.messages.create({
          body: data.message,
          from: fromNumber,
          to,
        })
        results.smsSent = true
        results.twilioSmsSid = msg.sid
        console.log(`SMS sent to ${to} — SID: ${msg.sid}`)
      } catch (err) {
        console.error('SMS error:', err.message)
        results.smsSent = false
        results.smsError = err.message
      }
    }

    // ── Voice call ────────────────────────────────────────────────────────────
    if (notifyType === 'call' || notifyType === 'both') {
      const twiml = `<Response>
        <Say voice="alice" language="en-IN">
          Hello. This is an automated message from S S I B M college.
          ${escapeXml(data.message)}
          We repeat: ${escapeXml(data.message)}
          Please contact the college for more information. Thank you.
        </Say>
      </Response>`

      try {
        const call = await client.calls.create({
          twiml,
          from: fromNumber,
          to,
        })
        results.callMade = true
        results.twilioCallSid = call.sid
        console.log(`Call initiated to ${to} — SID: ${call.sid}`)
      } catch (err) {
        console.error('Call error:', err.message)
        results.callMade = false
        results.callError = err.message
      }
    }

    await ref.update({ ...results, processedAt: new Date().toISOString() })
  },
)
