import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '../config/env.js'
import { demoUsers, type DemoUser, type DemoUserRole } from '../config/demoUsers.js'

type SessionPayload = {
  userId: string
  role: DemoUserRole
  name: string
  email: string
  exp: number
}

export function authenticateUser(email: string, password: string) {
  const user = demoUsers.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
  )

  if (!user) {
    return null
  }

  const token = signSession(user)

  return {
    token,
    user: serializeUser(user),
  }
}

export function verifySessionToken(token: string) {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionPayload

  if (payload.exp < Date.now()) {
    return null
  }

  return {
    id: payload.userId,
    role: payload.role,
    name: payload.name,
    email: payload.email,
  }
}

export function serializeUser(user: DemoUser) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  }
}

function signSession(user: DemoUser) {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

function sign(value: string) {
  return createHmac('sha256', env.AUTH_SECRET).update(value).digest('hex')
}
