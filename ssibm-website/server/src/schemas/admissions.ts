import { z } from 'zod'

export const admissionApplicationSchema = z.object({
  course: z.enum(['bba', 'bcom', 'bca', 'mcom', 'msw']),
  applicantName: z.string().min(2),
  email: z.email(),
  phone: z.string().min(10),
  dateOfBirth: z.string().min(1),
  previousQualification: z.string().min(2),
  percentage: z.string().min(1),
  city: z.string().min(2),
  state: z.string().min(2),
  documentsConfirmed: z.literal(true),
  consentToContact: z.literal(true),
})
