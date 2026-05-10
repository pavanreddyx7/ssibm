import { z } from 'zod'

export const sendParentAlertsSchema = z.object({
  facultyUid: z.string().min(1),
  courseCode: z.string().min(1),
  courseName: z.string().min(1),
  date: z.string().min(1),
  recipients: z.array(
    z.object({
      studentUid: z.string().min(1),
      studentName: z.string().min(1),
      rollNumber: z.string(),
      parentPhone: z.string().min(1),
    }),
  ).min(1),
  notifyType: z.enum(['sms', 'call', 'both']).default('sms'),
})
