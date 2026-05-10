import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
        <div className="space-y-5">
          <p className="font-display text-2xl font-extrabold tracking-[0.2em] text-white">
            SSIBM
          </p>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Sri Siddhartha Institute of Business Management is building a more
            accessible, multilingual, student-friendly digital experience for
            admissions, academics, and campus life.
          </p>
          <div className="grid gap-3 text-sm text-slate-300">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-secondary" />
              {t('footer.address')}
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-secondary" />
              {t('footer.phone')}
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-secondary" />
              {t('footer.email')}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Next Build Step
          </p>
          <h3 className="mt-3 font-display text-2xl font-bold text-white">
            Admissions and student systems
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This first pass focuses on the public website shell. The next phase
            is the admissions flow, chatbot backend, and role-based dashboards.
          </p>
          <p className="mt-6 text-sm text-slate-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
