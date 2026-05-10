import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { chatbotRequestSchema } from '../schemas/chatbot.js'
import {
  listChatbotConversations,
  replyToChatbot,
  upsertConversation,
} from '../services/chatbotService.js'

export const chatbotRouter = Router()

chatbotRouter.post('/', async (request, response) => {
  const payload = chatbotRequestSchema.parse(request.body)
  const reply = await replyToChatbot(payload.message, payload.language, payload.history)

  const conversation = await upsertConversation({
    history: payload.history,
    language: payload.language,
    leadName: payload.leadName,
    leadPhone: payload.leadPhone,
    message: payload.message,
    reply,
    sessionId: payload.sessionId,
  })

  response.json({
    success: true,
    reply,
    conversationId: conversation.id,
    sessionId: conversation.sessionId,
  })
})

chatbotRouter.get('/conversations', requireAuth(['admin']), async (_request, response) => {
  response.json({
    success: true,
    items: await listChatbotConversations(),
  })
})
