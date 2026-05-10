import { api } from './api'
import type { ChatbotLanguage, ChatbotMessage } from '../types/chatbot'

export async function sendChatMessage(input: {
  message: string
  history: ChatbotMessage[]
  language: ChatbotLanguage
  sessionId: string
  leadName?: string
  leadPhone?: string
}) {
  return api.post<{
    success: boolean
    reply: string
    conversationId: string
    sessionId: string
  }>('/chatbot', input)
}
