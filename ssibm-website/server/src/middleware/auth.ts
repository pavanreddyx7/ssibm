import type { NextFunction, Request, Response } from 'express'
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

export function requireAuth(allowedRoles?: Role[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader?.startsWith('Bearer ')) {
      response.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    const token = authorizationHeader.slice('Bearer '.length)
    const user = verifySessionToken(token)

    if (!user) {
      response.status(401).json({
        success: false,
        message: 'Invalid or expired session.',
      })
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      response.status(403).json({
        success: false,
        message: 'You do not have access to this resource.',
      })
      return
    }

    request.authUser = user
    next()
  }
}
