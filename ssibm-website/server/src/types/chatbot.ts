export type ChatbotConversationEntry = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatbotConversationRecord = {
  id: string
  sessionId: string
  language: 'en' | 'kn' | 'hi'
  leadName?: string
  leadPhone?: string
  messages: ChatbotConversationEntry[]
  createdAt: string
  updatedAt: string
}
