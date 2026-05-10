import { CoursesShowcase } from '../components/home/CoursesShowcase.tsx'
import { PageIntro } from './shared/PageIntro.tsx'

const courseDetails = [
  {
    name: 'BBA',
    level: 'Undergraduate',
    overview: 'A management-focused program for students interested in business, leadership, and communication.',
    eligibility: 'PUC / 12th standard or equivalent.',
    careers: 'Marketing, HR, operations, entrepreneurship.',
  },
  {
    name: 'B.Com',
    level: 'Undergraduate',
    overview: 'Built for finance, commerce, accounting, and business fundamentals.',
    eligibility: 'PUC / 12th standard or equivalent.',
    careers: 'Accounting, banking, business support, tax services.',
  },
  {
    name: 'BCA',
    level: 'Undergraduate',
    overview: 'A technology-oriented degree for computing, software basics, and digital careers.',
    eligibility: 'PUC / 12th standard or equivalent.',
    careers: 'Software support, web development, IT services.',
  },
  {
    name: 'M.Com',
    level: 'Postgraduate',
    overview: 'Advanced commerce study with emphasis on academic depth and business analysis.',
    eligibility: 'Relevant undergraduate degree.',
    careers: 'Teaching, finance roles, higher studies, corporate support.',
  },
  {
    name: 'MSW',
    level: 'Postgraduate',
    overview: 'Focused on social work practice, community engagement, and people-centered development.',
    eligibility: 'Relevant undergraduate degree.',
    careers: 'NGOs, counseling support, development programs, field coordination.',
  },
] as const

export function Courses() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="Courses"
          title="Programs designed for business, commerce, technology, and social impact"
          description="This page now establishes the structure for detailed course information, admissions messaging, and future per-course drill-down pages."
        />
        <CoursesShowcase />

        <section className="grid gap-5 lg:grid-cols-2">
          {courseDetails.map((course) => (
            <article
              key={course.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                    {course.level}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">
                    {course.name}
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  Fee details pending
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">{course.overview}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Eligibility</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{course.eligibility}</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Career paths</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{course.careers}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
