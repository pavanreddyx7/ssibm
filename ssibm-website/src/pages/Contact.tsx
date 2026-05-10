import { PageIntro } from './shared/PageIntro.tsx'

export function Contact() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="Contact"
          title="Reach the admissions and campus team through a clearer contact experience"
          description="This page is now shaped for a real enquiry workflow, with the current contact details already placed into a polished layout."
        />

        <section className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
          <form className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Enquiry Form
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Full name" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Phone number" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none md:col-span-2" placeholder="Email address" />
              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none md:col-span-2" defaultValue="Admissions">
                <option>Admissions</option>
                <option>Courses</option>
                <option>Events</option>
                <option>General enquiry</option>
              </select>
              <textarea
                className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3 outline-none md:col-span-2"
                placeholder="Tell us how we can help"
              />
            </div>
            <button
              type="submit"
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              Submit enquiry
            </button>
          </form>

          <div className="grid gap-5">
            <article className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                Contact Details
              </p>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-100">
                <p>SSIT Campus, Maralur, Tumakuru, Karnataka 572105</p>
                <p>+91 9742689866</p>
                <p>+91 9008323967</p>
                <p>Office: 0816-2201008</p>
                <p>principal.ssibm2006@gmail.com</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                Office Hours and Map
              </p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                  Monday to Saturday: 9:00 AM to 5:30 PM
                </div>
                <div className="aspect-[4/3] rounded-[1.5rem] bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_50%,#dbeafe_100%)]" />
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}
