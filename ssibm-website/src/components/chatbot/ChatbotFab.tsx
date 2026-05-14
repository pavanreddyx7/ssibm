import { BotMessageSquare, LoaderCircle, Minimize2, Send, X } from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from '../../context/LanguageContext.tsx'
import { sendChatMessage } from '../../services/chatbot.ts'
import type { ChatbotMessage } from '../../types/chatbot.ts'

export function ChatbotFab() {
  const { t } = useTranslation()
  const { language } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatbotMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [userExchangeCount, setUserExchangeCount] = useState(0)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [chatError, setChatError] = useState('')
  const [serverWarmed, setServerWarmed] = useState(false)
  const sessionIdRef = useRef(createSessionId())
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const quickReplies = t('chatbot.quickReplies', { returnObjects: true }) as string[]
  const shouldShowLeadCapture = userExchangeCount >= 3 && !leadCaptured

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: t('chatbot.welcomeMessage'),
      },
    ])
  }, [language, t])

  useEffect(() => {
    function syncWithHash() {
      if (window.location.hash === '#chatbot') {
        setIsOpen(true)
      }
    }

    syncWithHash()
    window.addEventListener('hashchange', syncWithHash)

    return () => window.removeEventListener('hashchange', syncWithHash)
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping, shouldShowLeadCapture])

  async function submitUserMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed || isTyping) return

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(nextMessages)
    setInputValue('')
    setIsTyping(true)
    setChatError('')

    try {
      const response = await sendChatMessage({
        message: trimmed,
        history: messages,
        language,
        sessionId: sessionIdRef.current,
        leadName: leadCaptured ? leadName : undefined,
        leadPhone: leadCaptured ? leadPhone : undefined,
      })
      setServerWarmed(true)
      setMessages((current) => [...current, { role: 'assistant', content: response.data.reply }])
      setUserExchangeCount((current) => current + 1)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setChatError(String(error.response.data.message))
      } else {
        setChatError('Unable to reach the chat service. Please try again.')
      }
    } finally {
      setIsTyping(false)
    }
  }

  function submitLeadCapture() {
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadError(t('chatbot.leadError'))
      return
    }

    setLeadCaptured(true)
    setLeadError('')
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        content: t('chatbot.leadSuccess', { name: leadName.trim() }),
      },
    ])
  }

  return (
    <>
      <button
        id="chatbot"
        type="button"
        aria-label="Open SSIBM AI chatbot"
        className="fixed bottom-5 right-5 z-[70] inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/30"
        onClick={() => {
          setIsOpen((current) => !current)
          if (window.location.hash !== '#chatbot') {
            window.history.replaceState(null, '', '#chatbot')
          }
        }}
      >
        <BotMessageSquare className="size-6" />
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-end bg-slate-950/30 p-0 sm:p-6"
          onClick={() => {
            setIsOpen(false)
            if (window.location.hash === '#chatbot') {
              window.history.replaceState(null, '', window.location.pathname + window.location.search)
            }
          }}
        >
          <div
            className="flex h-[100svh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-[600px] sm:w-[380px] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
              <div className="flex items-center justify-between bg-primary px-5 py-4 text-white">
                <div>
                  <p className="font-display text-lg font-bold">Ask SSIBM AI</p>
                  <p className="text-sm text-slate-200">{t('chatbot.subheading')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Minimize chatbot"
                    className="rounded-full bg-white/10 p-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Minimize2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Close chatbot"
                    className="rounded-full bg-white/10 p-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl p-4 text-sm shadow-sm ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-primary text-white'
                          : 'rounded-bl-md bg-white text-slate-700'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isTyping ? (
                  <div className="flex justify-start">
                    <div className="inline-flex flex-col gap-1 rounded-3xl rounded-bl-md bg-white p-4 text-sm text-slate-600 shadow-sm">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="size-4 animate-spin text-primary" />
                        {t('chatbot.typing')}
                      </span>
                      {!serverWarmed && (
                        <span className="text-xs text-slate-400">
                          First response may take ~30s to wake up the server…
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      onClick={() => void submitUserMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {chatError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {chatError}
                  </div>
                ) : null}

                {shouldShowLeadCapture ? (
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {t('chatbot.leadPrompt')}
                    </p>
                    <div className="mt-3 grid gap-3">
                      <input
                        value={leadName}
                        onChange={(event) => setLeadName(event.target.value)}
                        placeholder={t('chatbot.namePlaceholder')}
                        className="rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none"
                      />
                      <input
                        value={leadPhone}
                        onChange={(event) => setLeadPhone(event.target.value)}
                        placeholder={t('chatbot.phonePlaceholder')}
                        className="rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none"
                      />
                      {leadError ? (
                        <p className="text-sm font-medium text-rose-600">{leadError}</p>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-full bg-secondary px-4 py-3 text-sm font-bold text-slate-950"
                        onClick={submitLeadCapture}
                      >
                        {t('chatbot.shareLead')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        void submitUserMessage(inputValue)
                      }
                    }}
                    className="min-w-0 flex-1 border-none bg-transparent outline-none"
                    placeholder={t('chatbot.placeholder')}
                  />
                  <button
                    type="button"
                    aria-label={t('chatbot.sendButton')}
                    className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-slate-950"
                    onClick={() => void submitUserMessage(inputValue)}
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function createSessionId() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
