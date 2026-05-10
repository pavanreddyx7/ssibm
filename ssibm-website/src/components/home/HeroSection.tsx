import { motion } from 'framer-motion'
import { ArrowRight, BotMessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_top_left,rgba(30,58,138,0.18),transparent_35%)]" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
            Admissions Open 2026-27
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
            {t('hero.headline')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {t('hero.subheadline')}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25"
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#chatbot"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-800 backdrop-blur"
            >
              {t('hero.ctaSecondary')}
              <BotMessageSquare className="size-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,#1e3a8a_0%,#10214f_55%,#0b1220_100%)] p-8 text-white shadow-2xl shadow-primary/20">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.24em] text-secondary">
                Future-ready campus
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatCard value="65+" label="Years" />
                <StatCard value="84" label="Institutions" />
                <StatCard value="5000+" label="Alumni" />
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-200">
                Built for a modern admissions experience with multilingual
                support, student services, and a guided enquiry flow.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-200">{label}</p>
    </div>
  )
}
