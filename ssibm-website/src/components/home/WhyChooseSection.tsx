import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const stats = [
  { value: '90%', label: 'Student support journey mapped' },
  { value: '5', label: 'Core programs highlighted' },
  { value: '3', label: 'Languages prepared in the interface' },
]

export function WhyChooseSection() {
  const { t } = useTranslation()
  const reasons = t('whyChoose.reasons', { returnObjects: true }) as string[]

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <motion.div
          className="rounded-[2rem] bg-primary p-8 text-white shadow-2xl shadow-primary/25"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Why SSIBM
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {t('whyChoose.title')}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason}
              className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <p className="text-base font-semibold text-slate-800">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
