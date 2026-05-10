import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading.tsx'

const founders = [
  {
    name: 'Late Dr H M Gangadhariah',
    role: 'Founder of SSES',
    description:
      'Remembered for establishing a mission-driven educational movement focused on opportunity, dignity, and access.',
  },
  {
    name: 'Late Dr G Shivaprasad',
    role: 'Institution Builder',
    description:
      'Associated with strengthening institutional direction and helping expand educational culture across the network.',
  },
  {
    name: 'Dr G Parameshwara',
    role: 'Educational Leader',
    description:
      'Represents continuity, scale, and the public-facing leadership that connects the institution to its wider impact.',
  },
]

export function FoundersSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Founders"
          title="A homepage section anchored in institutional legacy"
          description="These cards are structured for real photographs and fuller biographies once verified content is collected."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {founders.map((founder, index) => (
            <motion.article
              key={founder.name}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="flex aspect-[4/3] items-end bg-[linear-gradient(135deg,#1e3a8a_0%,#294aa8_48%,#f59e0b_140%)] p-6">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  SSIBM Legacy
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                  {founder.role}
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-slate-950">
                  {founder.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{founder.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
