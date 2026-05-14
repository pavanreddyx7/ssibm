import { randomUUID } from 'node:crypto'
import { env } from '../config/env.js'
import { readDatabase, updateDatabase } from '../db/database.js'
import type {
  ChatbotConversationEntry,
  ChatbotConversationRecord,
} from '../types/chatbot.js'

type ChatbotLanguage = 'en' | 'kn' | 'hi'

export async function replyToChatbot(
  message: string,
  language: ChatbotLanguage,
  history: ChatbotConversationEntry[] = [],
) {
  if (!env.GEMINI_API_KEY) {
    return fallbackReply(language)
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: buildSystemPrompt(language),
              },
            ],
          },
          contents: toGeminiContents(history, message),
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 350,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`)
    }

    const data = (await response.json()) as GeminiGenerateContentResponse
    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim() ?? ''

    return reply || fallbackReply(language)
  } catch {
    return fallbackReply(language)
  }
}

export async function upsertConversation(input: {
  history: ChatbotConversationEntry[]
  language: ChatbotLanguage
  leadName?: string
  leadPhone?: string
  message: string
  reply: string
  sessionId: string
}) {
  const database = await readDatabase()
  const existing = database.chatbotConversations.find(
    (conversation) => conversation.sessionId === input.sessionId,
  )

  const timestamp = new Date().toISOString()
  const messages = [
    ...input.history,
    { role: 'user' as const, content: input.message },
    { role: 'assistant' as const, content: input.reply },
  ]

  if (existing) {
    const updated: ChatbotConversationRecord = {
      ...existing,
      messages,
      language: input.language,
      updatedAt: timestamp,
      leadName: input.leadName ?? existing.leadName,
      leadPhone: input.leadPhone ?? existing.leadPhone,
    }

    await updateDatabase((current) => ({
      ...current,
      chatbotConversations: current.chatbotConversations.map((conversation) =>
        conversation.sessionId === input.sessionId ? updated : conversation,
      ),
    }))

    return updated
  }

  const record: ChatbotConversationRecord = {
    id: randomUUID(),
    sessionId: input.sessionId,
    language: input.language,
    leadName: input.leadName,
    leadPhone: input.leadPhone,
    messages,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  await updateDatabase((current) => ({
    ...current,
    chatbotConversations: [record, ...current.chatbotConversations],
  }))

  return record
}

export async function listChatbotConversations() {
  const database = await readDatabase()
  return database.chatbotConversations
}

function fallbackReply(language: ChatbotLanguage) {
  return localize(
    language,
    'I can help with admissions, courses, campus information, placements, fees, and website guidance. Please ask about SSIBM and I will assist you.',
    'ನಾನು ಪ್ರವೇಶ, ಕೋರ್ಸ್‌ಗಳು, ಕ್ಯಾಂಪಸ್ ಮಾಹಿತಿ, ಪ್ಲೇಸ್ಮೆಂಟ್, ಶುಲ್ಕ, ಮತ್ತು ವೆಬ್‌ಸೈಟ್ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ದಯವಿಟ್ಟು SSIBM ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ, ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    'मैं admissions, courses, campus information, placements, fees और website guidance में मदद कर सकता हूँ। कृपया SSIBM के बारे में पूछें, मैं सहायता करूँगा।',
  )
}

function buildSystemPrompt(language: ChatbotLanguage) {
  const languageInstruction =
    language === 'kn'
      ? 'Reply primarily in Kannada.'
      : language === 'hi'
        ? 'Reply primarily in Hindi.'
        : 'Reply primarily in English.'

  return [
    'You are the SSIBM college enquiry chatbot for the official website.',
    languageInstruction,
    'Your role is to help prospective students, parents, and visitors with college and website questions.',
    'Stay focused on SSIBM admissions, courses, campus, contact details, placements, fees, faculty, and navigation around the website.',

    // ── College identity ──────────────────────────────────────────────────────
    'College full name: Sri Siddhartha Institute of Business Management (SSIBM).',
    'Parent body: Sri Siddhartha Education Society (SSES) and Sri Siddhartha Academy of Higher Education (SSAHE).',
    'Location: SSIT Campus, Maralur, Tumakuru, Karnataka 572105, India.',
    'Admissions phone: +91 9742689866.',
    'Admissions email: principal.ssibm2006@gmail.com.',

    // ── Founders / leadership ─────────────────────────────────────────────────
    'Founder of SSES: Late Dr H M Gangadharaiah — established the mission-driven educational movement.',
    'Founder Chancellor of SSAHE: Late Dr G Shivaprasad — strengthened institutional direction and educational culture.',
    'Chancellor, SSAHE: Dr G Parameshwara — current leadership representing continuity and scale.',

    // ── Courses and fee structure ─────────────────────────────────────────────
    'BBA (Bachelor of Business Administration): 3-year undergraduate, fee ₹55,000 per year. Eligibility: PUC/12th. Careers: Marketing, HR, Operations, Entrepreneurship.',
    'B.Com (Bachelor of Commerce): 3-year undergraduate, fee ₹52,000 per year. Eligibility: PUC/12th. Careers: Accounting, Banking, Tax services.',
    'BCA (Bachelor of Computer Applications): 3-year undergraduate, fee ₹58,000 per year. Eligibility: PUC/12th. Careers: Software, Web development, IT services.',
    'M.Com (Master of Commerce): 2-year postgraduate, fee ₹54,000 per year. Eligibility: relevant undergraduate degree. Careers: Teaching, Finance, Higher studies.',
    'MSW (Master of Social Work): 2-year postgraduate, fee ₹56,000 per year. Eligibility: relevant undergraduate degree. Careers: NGOs, Counseling, Community development.',

    // ── Faculty ───────────────────────────────────────────────────────────────
    'BBA Department: Mr. Harsharadhya H U (Asst Prof), Mrs. Lakshmidevi N (Asst Prof), Mr. Jaisimha Rao B S (Asst Prof).',
    'B.Com Department: Mr. Muthuraj T R (Asst Prof), Mrs. Geethashree (Asst Prof), Mr. Sagar A S (Asst Prof), Mrs. Pankaja N (Asst Prof), Ms. Bhagyashree L (Asst Prof).',
    'BCA Department: Mrs. Shalika H S (Head of Dept, MBA PhD), Mrs. Dhanya P M (Asst Prof), Mr. Shivakumar B (Asst Prof), Ms. Nayana S Patel (Asst Prof).',
    'M.Com Department: Mr. Chidananda V N (Head of Dept, MBA MCom PhD), Mrs. Vanajakshamma C (Asst Prof), Ms. Shwetha G K (Asst Prof), Ms. Banupriya K R (Asst Prof), Mrs. Dyamalamba G A (Asst Prof).',
    'MSW Department: Dr. C V Guruprasad (Head of Dept, MBA MCom MPhil PhD), Mr. Raghu P K (Asst Prof), Mrs. Svethana H K (Asst Prof).',
    'Languages & Foundation: Mrs. Kalpana A S (English), Dr. Renukaprasad P R (Kannada Language, MA MPhil NET PhD).',

    // ── Admissions process ────────────────────────────────────────────────────
    'Admission steps: (1) Choose course and review eligibility, (2) Prepare documents — marks cards, TC, photographs, ID proof, caste certificate if applicable, (3) Submit online application, (4) Attend counselling and verification, (5) Confirm admission and pay fees.',

    // ── Behaviour rules ───────────────────────────────────────────────────────
    'When users ask how to apply, guide them to the Admissions page and ask which course they are interested in.',
    'If asked about scholarships or fee waivers, advise contacting admissions at +91 9742689866.',
    'Keep answers concise, clear, and useful for a website chatbot. Use plain text only.',
  ].join(' ')
}

function toGeminiContents(history: ChatbotConversationEntry[], latestMessage: string) {
  const contents = history.map((entry) => ({
    role: entry.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: entry.content }],
  }))

  contents.push({
    role: 'user',
    parts: [{ text: latestMessage }],
  })

  return contents
}

function localize(language: ChatbotLanguage, en: string, kn: string, hi: string) {
  if (language === 'kn') return kn
  if (language === 'hi') return hi
  return en
}

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}
