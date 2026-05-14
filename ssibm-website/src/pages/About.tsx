import { PageIntro } from './shared/PageIntro.tsx'

const milestones = [
  '1959: Sri Siddhartha Education Society was established by Late Dr. H. M. Gangadhariah with the blessings of Acharya Vinobha Bhave.',
  '2006: SSIBM launched the undergraduate management programme, then known through BBM, with modern facilities and experienced faculty.',
  '2011: M.Com was introduced, creating a strong postgraduate pathway in commerce education.',
  '2013: M.S.W was added to prepare students for professional social welfare and administration practice.',
  '2014: Bachelor of Commerce expanded the institution into broader trade and business education.',
  '2018: B.C.A. marked the institution’s technical expansion into computer applications.',
]

const ssesInstitutions = [
  'Medical College and Dental College',
  'Engineering College and College of Education',
  'First Grade College and D.Ed. College',
  'Nursing College and Junior Colleges',
  'Industrial Training Institutions',
  'Sanskrit Schools, Pali Schools, High Schools, and Residential Hostels',
]

const principalsMessage = `"To reach the unreached" is our aim. To provide quality education to build the character and to mark the footprints of Siddhartha Institutions in building the nation is our direction. Our college treats the existing students and old students as assets of our education society. Students can come to the Principal chamber at all the time to solve their problems. So, feel free and be a part of the growth of institution continuously. I am proud that, "I am the Principal of my nearest and dearest students". My motto is to serve the students to grow beyond their limitations.`

export function About() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="About SSIBM"
          title="A legacy of reaching the unreached through education, service, and institutional growth"
          description="SSIBM stands within the long educational journey of Sri Siddhartha Education Society, carrying forward a mission shaped by rural upliftment, women’s access to education, academic excellence, and social responsibility."
        />

        <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Our Education Society
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">
              Sri Siddhartha Education Society
            </h2>
            <div className="mt-5 space-y-5 text-sm leading-8 text-slate-600">
              <p>
                Sri Siddartha Education Society was established by Late Dr. H. M.
                Gangadhariah, a strong Gandhian and Buddhist, in the year 1959 with
                the warm blessings of Acharya Vinobha Bhave, the father of the
                Bhoodan Movement. The objective was clear and powerful: to provide
                education to the student community coming from rural areas, backward
                classes, and women folk.
              </p>
              <p>
                Today, SSES is considered one among Karnataka&apos;s premier education
                establishments. It has educational institutions spread across the
                southern part of Karnataka and has built a strong network covering
                professional, general, technical, and heritage-oriented learning.
              </p>
              <p>
                The society includes institutions in medicine, dentistry,
                engineering, teacher education, nursing, first-grade education,
                junior colleges, industrial training, Sanskrit studies, Pali
                studies, high schools, and residential hostels. Together they
                promote excellent training from primary education to professional
                postgraduate courses, while also helping preserve the ancient
                heritage of India.
              </p>
            </div>
          </article>

          <aside className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Institutional Reach
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] bg-white/10 p-5">
                <p className="font-display text-4xl font-extrabold">84+</p>
                <p className="mt-2 text-sm text-slate-100">
                  Educational establishments across Karnataka.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-5">
                <p className="font-display text-4xl font-extrabold">16,000+</p>
                <p className="mt-2 text-sm text-slate-100">
                  Students supported through the wider SSES educational network.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-5">
                <p className="font-display text-4xl font-extrabold">1,800+</p>
                <p className="mt-2 text-sm text-slate-100">
                  Staff members contributing to teaching, mentoring, and support.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr,1.08fr]">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src="/about/gangadharaiah.jpeg"
              alt="Late Dr. H. M. Gangadharaiah — Founder, Sri Siddhartha Education Society"
              className="w-full object-cover object-top"
              style={{ height: 'auto', maxHeight: '520px', display: 'block' }}
            />
            <div className="p-5 text-center">
              <p className="font-display text-lg font-extrabold text-slate-900">Late Dr. H. M. Gangadharaiah</p>
              <p className="mt-1 text-sm text-slate-500">Founder, Sri Siddhartha Education Society</p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Our Founder
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">
              Shikshana Bhishma, Late Dr. H. M. Gangadharaiah
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Founder, Sri Siddhartha Education Society, Tumkur
            </p>
            <div className="mt-5 space-y-5 text-sm leading-8 text-slate-600">
              <p>
                SRI SIDDHARTHA EDUCATION SOCIETY was founded by Shikshana Bhishma,
                Late Sri H. M. Gangadhariah, the founder secretary of the society,
                with the blessings of saint and seer Sri Vinobha Bhave in 1959. What
                began as a residential school in a village near Tumkur grew into a
                major educational movement.
              </p>
              <p>
                The Society expanded steadily from nursery, primary, and high
                schools, including Pali schools, into technical, medical, and dental
                education. Its guiding objective has remained unchanged:
                <span className="font-semibold text-slate-900"> REACH THE UNREACHED </span>
                in the field of education.
              </p>
              <p>
                The year 1947 saw India win its freedom, and rebuilding the nation
                through education became a historic responsibility. Late Dr. H. M.
                Gangadharaiah envisioned an educational establishment that would
                disperse the seeds of knowledge and help shape a more intelligent,
                just, and capable society.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Society Growth
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-5 text-sm leading-8 text-slate-600">
              <p>
                Sri Siddhartha Education Society has grown to become a hub of higher
                education with excellent teaching facilities and highly qualified,
                experienced faculty. The range of professional and academic
                programmes gives meaningful choice to students seeking admission
                across disciplines.
              </p>
              <p>
                The society also supports health care access in the rural regions of
                Karnataka, including Tumkur, Chitradurga, and the rural belt of
                northwest Bangalore. This reflects the broader social purpose that
                has always defined the institution.
              </p>
              <p>
                Leadership has played a vital role in this growth. The society has
                been strengthened by the commitment of the founder&apos;s illustrious
                sons, Late Dr. G. Shivaprasad, an eminent ophthalmologist and
                Founder Chancellor of SSAHE, and Dr. G. Parameshwara, a reputed
                agricultural scientist and Hon&apos;ble Chancellor of Sri Siddhartha
                Academy of Higher Education.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-slate-50 p-6">
              <p className="font-display text-2xl font-extrabold text-slate-950">
                Institutions under the SSES umbrella
              </p>
              <div className="mt-5 grid gap-3">
                {ssesInstitutions.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Leadership
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-100">
                <img
                  src="/about/shivvaprasad.jpeg"
                  alt="Late Dr. G. Shivaprasad"
                  className="h-52 w-full object-cover object-top"
                />
                <div className="p-4 text-center">
                  <p className="font-display text-base font-extrabold text-slate-900">Late Dr. G. Shivaprasad</p>
                  <p className="mt-1 text-xs text-slate-500">Founder Chancellor, SSAHE</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-100">
                <img
                  src="/about/parameshwara.jpeg"
                  alt="Dr. G. Parameshwara"
                  className="h-52 w-full object-cover object-top"
                />
                <div className="p-4 text-center">
                  <p className="font-display text-base font-extrabold text-slate-900">Dr. G. Parameshwara</p>
                  <p className="mt-1 text-xs text-slate-500">Chancellor, SSAHE</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Leadership and Vision
            </p>
            <div className="mt-5 space-y-5 text-sm leading-8 text-slate-100">
              <p>
                The world of education is witnessing a paradigm shift. Adaptive
                learning solutions, futuristic trends, and industry-ready training
                methodologies are shaping the way education is delivered.
              </p>
              <p>
                Over the years, Sri Siddhartha Academy of Higher Education has
                emerged as a trusted destination for quality education in medicine,
                dental sciences, engineering, and technology. It nurtures students
                through strong foundational skills, a spirit of enquiry and
                enterprise, and a value-based, society-centric outlook.
              </p>
              <p>
                Sri Siddhartha Institute of Technology, as a constituent college of
                SSAHE, has been among the best-performing technical institutions of
                the country, known for qualified faculty, strong infrastructure, and
                a much-valued learning ambience spread across a serene green campus.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
            Message from Principal
          </p>
          <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-6">
            <p className="text-base leading-8 text-slate-700">{principalsMessage}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              SSIBM Journey
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">
              Milestones in institutional growth
            </h2>
            <div className="mt-6 grid gap-4">
              {milestones.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
              Expanded Vision
            </p>
            <div className="mt-5 space-y-5 text-sm leading-8 text-slate-600">
              <p>
                In the SSES journey, the year 2006 is remembered as a golden year
                because it marked the beginning of undergraduate management
                education at SSIBM with well-equipped facilities and eminent
                teaching faculty.
              </p>
              <p>
                In 2011, the institution added M.Com, creating a valuable
                opportunity for students to become Masters of Commerce. In 2013,
                M.S.W broadened the institution&apos;s social and administrative
                orientation. In 2014, B.Com strengthened business education, and in
                2018, B.C.A. marked a major technical transition.
              </p>
              <p>
                The institution continues to hold a broader vision of providing
                ample avenues to future generations by expanding its wings across
                multiple disciplines of study, always with a focus on opportunity,
                growth, and meaningful careers.
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
