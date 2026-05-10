import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'
import i18n from '../i18n'

type SupportedLanguage = 'en' | 'kn' | 'hi'

type LanguageContextValue = {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => undefined,
})

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.resolvedLanguage as SupportedLanguage) || 'en',
  )

  useEffect(() => {
    document.body.dataset.lang = language
    void i18n.changeLanguage(language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage: SupportedLanguage) => setLanguageState(nextLanguage),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
