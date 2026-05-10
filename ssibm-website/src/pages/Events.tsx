import { PageIntro } from './shared/PageIntro.tsx'

const featuredEvents = [
  'INSPIRO',
  'GUTS n GLORY',
  'Appeeture',
  'Varada Katha Kuta',
]

export function Events() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="Events"
          title="A campus events page designed for energy, memory, and participation"
          description="The structure below supports featured events, visual galleries, upcoming calendars, and outside registrations."
        />

        <section className="grid gap-5 lg:grid-cols-2">
          {featuredEvents.map((event, index) => (
            <article
              key={event}
              className={`rounded-[2rem] p-8 text-white shadow-xl ${
                index % 2 === 0
                  ? 'bg-[linear-gradient(135deg,#1e3a8a_0%,#1d4ed8_55%,#38bdf8_140%)]'
                  : 'bg-[linear-gradient(135deg,#f59e0b_0%,#f97316_55%,#ea580c_120%)]'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.24em] text-white/80">Featured Event</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold">{event}</h2>
              <p className="mt-4 text-sm leading-7 text-white/85">
                Prepared for photography, event summaries, and registration details
                once official content is added.
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr,0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Gallery Layout
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`gallery-${index + 1}`}
                  className="aspect-[4/3] rounded-[1.5rem] bg-[linear-gradient(135deg,#e2e8f0_0%,#f8fafc_50%,#dbeafe_100%)]"
                />
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Upcoming and Registration
            </p>
            <div className="mt-6 grid gap-4">
              {[
                'Upcoming calendar integration',
                'External visitor registration form',
                'Faculty coordinator details',
                'Event guidelines and deadlines',
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
