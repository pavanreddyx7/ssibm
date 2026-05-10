import { z } from 'zod'

export const markAttendanceSchema = z.object({
  facultyUid: z.string().min(1),
  courseCode: z.string().min(1),
  date: z.string().min(1),
  entries: z.array(
    z.object({
      studentUserId: z.string().min(1),
      status: z.enum(['present', 'absent', 'late', 'leave']),
    }),
  ).min(1),
})
