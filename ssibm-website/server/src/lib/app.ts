import cors from 'cors'
import express from 'express'
import { env } from '../config/env.js'
import { errorHandler, notFoundHandler } from './http.js'
import { admissionsRouter } from '../routes/admissions.js'
import { authRouter } from '../routes/auth.js'
import { attendanceRouter } from '../routes/attendance.js'
import { chatbotRouter } from '../routes/chatbot.js'
import { dashboardRouter } from '../routes/dashboard.js'
import { healthRouter } from '../routes/health.js'
import { notificationsRouter } from '../routes/notifications.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.use('/api/health', healthRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/admissions', admissionsRouter)
  app.use('/api/attendance', attendanceRouter)
  app.use('/api/chatbot', chatbotRouter)
  app.use('/api/dashboard', dashboardRouter)
  app.use('/api/notifications', notificationsRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
