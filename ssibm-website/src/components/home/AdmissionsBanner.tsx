import { motion } from 'framer-motion'
import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const milestones = [
  { value: '31', label: 'Days left' },
  { value: '2026', label: 'Intake year' },
  { value: '3', label: 'Languages ready' },
]

export function AdmissionsBanner() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-18">
      <motion.div
        className="mx-auto max-w-7xl overflow-hidden rounded-[2.4rem] bg-[linear-gradient(135deg,#0b1220_0%,#1e3a8a_55%,#10b981_150%)] p-8 text-white shadow-2xl shadow-primary/20 lg:p-10"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              <Clock3 className="size-4 text-secondary" />
              Admissions Open 2026-27
            </div>
            <h2 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Start the SSIBM application journey with a cleaner, guided experience
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100">
              The next build stage will turn this into a true multi-step admissions
              flow with eligibility, documents, counselling prompts, and payment support.
            </p>
            <Link
              to="/admissions"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-secondary/30"
            >
              Start Application
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {milestones.map((milestone) => (
              <div
                key={milestone.label}
                className="rounded-[1.6rem] border border-white/15 bg-white/10 p-5 backdrop-blur"
              >
                <p className="text-3xl font-extrabold text-white">{milestone.value}</p>
                <p className="mt-1 text-sm text-slate-100">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
