import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function AboutStrip() {
  const { t } = useTranslation()

  return (
    <motion.section
      className="px-4 py-10 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-200/50 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
          {t('about.title')}
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          {t('about.paragraph')}
        </p>
        <Link
          to="/about"
          className="mt-5 inline-flex text-sm font-bold text-primary underline decoration-primary/30 underline-offset-4"
        >
          {t('about.readMore')}
        </Link>
      </div>
    </motion.section>
  )
}
