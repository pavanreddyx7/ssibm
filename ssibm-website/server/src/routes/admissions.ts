import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { admissionApplicationSchema } from '../schemas/admissions.js'
import {
  createAdmissionApplication,
  listAdmissionApplications,
} from '../services/admissionsService.js'

export const admissionsRouter = Router()

admissionsRouter.post('/apply', async (request, response) => {
  const payload = admissionApplicationSchema.parse(request.body)
  const result = await createAdmissionApplication(payload)

  response.status(201).json(result)
})

admissionsRouter.get('/applications', requireAuth(['admin']), async (_request, response) => {
  response.json({
    success: true,
    items: await listAdmissionApplications(),
  })
})
