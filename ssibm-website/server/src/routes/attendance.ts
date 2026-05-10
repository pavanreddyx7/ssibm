import { Router } from 'express'
import { markAttendanceSchema } from '../schemas/attendance.js'
import { markAttendance } from '../services/attendanceService.js'

export const attendanceRouter = Router()

attendanceRouter.post('/mark', async (request, response) => {
  const payload = markAttendanceSchema.parse(request.body)
  const result = await markAttendance({
    facultyUserId: payload.facultyUid,
    courseCode: payload.courseCode,
    date: payload.date,
    entries: payload.entries,
  })

  response.json(result)
})
