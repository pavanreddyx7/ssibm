import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { SectionHeading } from './SectionHeading.tsx'

const testimonials = [
  {
    quote:
      'SSIBM gave me the confidence to communicate clearly, think practically, and take my first serious step into the corporate world.',
    name: 'Aishwarya R',
    role: 'Alumni, Business Operations',
  },
  {
    quote:
      'The strongest part of my journey was the support system. Faculty were approachable and genuinely interested in helping us grow.',
    name: 'Rahul M',
    role: 'Alumni, Technology Services',
  },
  {
    quote:
      'I want the redesigned website to feel like the campus did for us: welcoming, ambitious, and easy to navigate for families.',
    name: 'Nandini K',
    role: 'Alumni, Community Programs',
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Alumni Speak"
          title="Human proof points for the brand direction"
          description="These testimonials are presentation-ready placeholders until official alumni stories and designations are confirmed."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.name}
              className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <Quote className="size-8 text-secondary" />
              <p className="mt-5 text-base leading-8 text-slate-700">
                “{testimonial.quote}”
              </p>
              <footer className="mt-6">
                <p className="font-display text-xl font-extrabold text-slate-950">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
