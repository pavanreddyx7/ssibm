import { motion } from 'framer-motion'
import { BriefcaseBusiness, ChartColumn, Computer, HandHelping, Landmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const courseIcons = [BriefcaseBusiness, ChartColumn, Computer, Landmark, HandHelping]

const courseKeys = ['bba', 'bcom', 'bca', 'mcom', 'msw'] as const

export function CoursesShowcase() {
  const { t } = useTranslation()

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Academics
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
              {t('courses.title')}
            </h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-bold text-primary md:inline-flex">
            View all programs
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {courseKeys.map((courseKey, index) => {
            const Icon = courseIcons[index]

            return (
              <motion.article
                key={courseKey}
                className="group rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {t(`courses.courseList.${courseKey}.name`)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t(`courses.courseList.${courseKey}.duration`)}
                </p>
                <Link
                  to="/admissions"
                  className="mt-6 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition group-hover:bg-secondary group-hover:text-slate-950"
                >
                  {t('courses.learnMore')}
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
