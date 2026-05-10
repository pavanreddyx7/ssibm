import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading.tsx'

const recruiters = ['Oracle', 'IBM', 'Infosys', 'Wipro', 'Indian Army', 'IAF', 'Navy']

export function RecruitersSection() {
  return (
    <section className="overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Placements"
          title="Brands and institutions that reflect SSIBM aspirations"
          description="This stage uses a polished logo-wall treatment as a placement showcase placeholder until verified placement data and brand assets are added."
        />

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {recruiters.map((recruiter, index) => (
              <motion.div
                key={recruiter}
                className="flex min-h-28 items-center justify-center rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#eef4ff_100%)] p-5 text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <span className="font-display text-lg font-extrabold tracking-[0.08em] text-primary">
                  {recruiter}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
