import { AdmissionsApplication } from '../components/admissions/AdmissionsApplication.tsx'
import { AttendancePreview } from '../components/attendance/AttendancePreview.tsx'
import { PageIntro } from './shared/PageIntro.tsx'

const steps = [
  'Choose your course and review eligibility.',
  'Prepare academic records and required documents.',
  'Submit the online application form.',
  'Complete counselling and verification.',
  'Confirm admission and fee payment.',
]

const documents = [
  'Marks cards / transcripts',
  'Transfer certificate',
  'Passport-size photographs',
  'ID proof and address proof',
  'Caste / category certificates if applicable',
]

export function Admissions() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="Admissions"
          title="A cleaner, step-by-step application experience"
          description="This page now lays out the admissions journey in a clear order so the future application flow can be built directly on top of it."
        />

        <AdmissionsApplication />

        <section className="grid gap-5 lg:grid-cols-[1fr,0.9fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Admission Process
            </p>
            <div className="mt-6 grid gap-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Documents Checklist
            </p>
            <div className="mt-6 grid gap-3">
              {documents.map((document) => (
                <div key={document} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-sm text-slate-100">
                  {document}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Eligibility Snapshot
            </p>
            <div className="mt-6 grid gap-4">
              {[
                'BBA, B.Com, BCA: 12th / PUC or equivalent.',
                'M.Com and MSW: relevant undergraduate qualification.',
                'Final eligibility, seat availability, and dates should be verified with the admissions office.',
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              FAQs and Support
            </p>
            <div className="mt-6 grid gap-4">
              {[
                'Fee structures will be listed after verification.',
                'Razorpay integration can be added in the online application stage.',
                'The AI counselor and callback lead capture will connect here in the next system pass.',
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <AttendancePreview />
      </div>
    </div>
  )
}
