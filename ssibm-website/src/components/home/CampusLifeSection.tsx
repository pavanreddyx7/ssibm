import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading.tsx'

const events = [
  {
    name: 'INSPIRO',
    description: 'A high-energy student platform for ideas, presentation, and entrepreneurial confidence.',
    palette: 'from-primary via-sky-900 to-cyan-700',
  },
  {
    name: 'GUTS n GLORY',
    description: 'Competitive spirit, leadership, and teamwork brought into a bold campus celebration.',
    palette: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    name: 'Appeeture',
    description: 'Creative expression, stage presence, and community energy across student talent showcases.',
    palette: 'from-emerald-500 via-teal-500 to-cyan-600',
  },
  {
    name: 'Varada Katha Kuta',
    description: 'A culturally rooted gathering that highlights storytelling, belonging, and shared identity.',
    palette: 'from-fuchsia-600 via-violet-600 to-primary',
  },
]

export function CampusLifeSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Campus Life"
          title="Events that give the institution its personality"
          description="The final site can swap these stylized cards with real event photography and galleries. For now, this gives the homepage strong rhythm and a clear preview of student life."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {events.map((event, index) => (
            <motion.article
              key={event.name}
              className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${event.palette} p-8 text-white shadow-xl`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_28%)]" />
              <div className="relative flex h-full min-h-64 flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/80">Featured event</p>
                  <h3 className="mt-4 font-display text-3xl font-extrabold">{event.name}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/85">
                    {event.description}
                  </p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Explore event story
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
