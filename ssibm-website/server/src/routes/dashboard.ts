import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getFacultyAttendanceOverview,
  getParentAttendanceOverview,
  getStudentAttendanceOverview,
} from '../services/attendanceService.js'

export const dashboardRouter = Router()

dashboardRouter.get('/faculty', requireAuth(['faculty']), async (request, response) => {
  response.json({
    success: true,
    user: request.authUser,
    data: await getFacultyAttendanceOverview(request.authUser!.id),
  })
})

dashboardRouter.get('/student', requireAuth(['student']), async (request, response) => {
  response.json({
    success: true,
    user: request.authUser,
    data: await getStudentAttendanceOverview(request.authUser!.id),
  })
})

dashboardRouter.get('/parent', requireAuth(['parent']), async (request, response) => {
  response.json({
    success: true,
    user: request.authUser,
    data: await getParentAttendanceOverview(request.authUser!.id),
  })
})
