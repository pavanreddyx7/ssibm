import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { sendParentAlertsSchema } from '../schemas/notifications.js'
import { listNotifications } from '../services/notificationService.js'
import { sendParentAlerts } from '../services/parentNotificationService.js'

export const notificationsRouter = Router()

notificationsRouter.get('/logs', requireAuth(['admin']), async (_request, response) => {
  response.json({
    success: true,
    items: await listNotifications(),
  })
})

notificationsRouter.post(
  '/parent-alerts',
  async (request, response) => {
    const payload = sendParentAlertsSchema.parse(request.body)
    const result = await sendParentAlerts({
      facultyUid: payload.facultyUid,
      courseCode: payload.courseCode,
      courseName: payload.courseName,
      date: payload.date,
      recipients: payload.recipients,
      notifyType: payload.notifyType,
    })

    response.json({
      success: true,
      ...result,
    })
  },
)
