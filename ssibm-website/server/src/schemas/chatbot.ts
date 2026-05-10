import { z } from 'zod'

export const chatbotMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
})

export const chatbotRequestSchema = z.object({
  message: z.string().min(1),
  history: z.array(chatbotMessageSchema).default([]),
  language: z.enum(['en', 'kn', 'hi']).default('en'),
  sessionId: z.string().min(1),
  leadName: z.string().optional(),
  leadPhone: z.string().optional(),
})
