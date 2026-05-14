import type { NextFunction, Request, Response } from 'express'
import { demoUsers } from '../config/demoUsers.js'
import { verifySessionToken } from '../services/authService.js'

type Role = 'admin' | 'faculty' | 'student' | 'parent'

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string
        role: Role
        name: string
        email: string
      }
    }
  }
}

// Decode a Firebase ID token (JWT with 3 parts) by base64-decoding the payload
// and looking up the email in demoUsers. No Admin SDK required.
function resolveFirebaseToken(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8')
    const payload = JSON.parse(payloadJson) as { email?: string; exp?: number }

    if (!payload.email) return null
    if (payload.exp && payload.exp * 1000 < Date.now()) return null

    const user = demoUsers.find(
      (u) => u.email.toLowerCase() === payload.email!.toLowerCase(),
    )

    if (!user) return null

    return { id: user.id, role: user.role as Role, name: user.name, email: user.email }
  } catch {
    return null
  }
}

export function requireAuth(allowedRoles?: Role[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader?.startsWith('Bearer ')) {
      response.status(401).json({ success: false, message: 'Authentication required.' })
      return
    }

    const token = authorizationHeader.slice('Bearer '.length)

    // Try custom HMAC token (2-part) first, then Firebase ID token (3-part JWT)
    const user = verifySessionToken(token) ?? resolveFirebaseToken(token)

    if (!user) {
      response.status(401).json({ success: false, message: 'Invalid or expired session.' })
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      response.status(403).json({ success: false, message: 'You do not have access to this resource.' })
      return
    }

    request.authUser = user
    next()
  }
}
