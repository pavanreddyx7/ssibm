import { useContext } from 'react'
import { ChevronDown } from 'lucide-react'
import { LanguageContext } from '../../context/LanguageContext.tsx'

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'kn', label: 'ಕನ್ನಡ', short: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिंदी', short: 'हिंदी' },
] as const

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <label className="relative inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
      <span className="sr-only">Select language</span>
      <select
        aria-label="Select language"
        className="appearance-none bg-transparent pr-6 outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value as 'en' | 'kn' | 'hi')}
      >
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.short}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4" />
    </label>
  )
}
