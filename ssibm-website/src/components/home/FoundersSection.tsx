import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading.tsx'

const founders = [
  {
    name: 'Late Dr H M Gangadharaiah',
    role: 'Founder of SSES',
    image: '/about/gangadharaiah.jpeg',
    description:
      'Remembered for establishing a mission-driven educational movement focused on opportunity, dignity, and access.',
  },
  {
    name: 'Late Dr G Shivaprasad',
    role: 'Founder Chancellor, SSAHE',
    image: '/about/shivvaprasad.jpeg',
    description:
      'Associated with strengthening institutional direction and helping expand educational culture across the network.',
  },
  {
    name: 'Dr G Parameshwara',
    role: 'Chancellor, SSAHE',
    image: '/about/parameshwara.jpeg',
    description:
      'Represents continuity, scale, and the public-facing leadership that connects the institution to its wider impact.',
  },
]

export function FoundersSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Legacy"
          title="The visionaries behind Sri Siddhartha Education Society"
          description="Three generations of leadership that built one of Karnataka's most respected educational institutions."
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
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="h-full w-full object-cover object-top"
                />
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
