export type ChatbotRole = 'user' | 'assistant'

export type ChatbotMessage = {
  role: ChatbotRole
  content: string
}

export type ChatbotLanguage = 'en' | 'kn' | 'hi'
