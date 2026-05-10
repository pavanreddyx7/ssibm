import { Router } from 'express'
import { loginSchema } from '../schemas/auth.js'
import { authenticateUser } from '../services/authService.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

authRouter.post('/login', (request, response) => {
  const payload = loginSchema.parse(request.body)
  const result = authenticateUser(payload.email, payload.password)

  if (!result) {
    response.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    })
    return
  }

  response.json({
    success: true,
    token: result.token,
    user: result.user,
  })
})

authRouter.get('/me', requireAuth(), (request, response) => {
  response.json({
    success: true,
    user: request.authUser,
  })
})

authRouter.get('/demo-users', (_request, response) => {
  response.json({
    success: true,
    items: [
      { role: 'admin', email: 'admin@ssibm.demo', password: 'Admin@123' },
      { role: 'faculty', email: 'faculty@ssibm.demo', password: 'Faculty@123' },
      { role: 'student', email: 'student@ssibm.demo', password: 'Student@123' },
      { role: 'parent', email: 'parent@ssibm.demo', password: 'Parent@123' },
    ],
  })
})
