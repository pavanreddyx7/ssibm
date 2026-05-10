import { PageIntro } from './shared/PageIntro.tsx'

const facultyGroups = [
  {
    department: 'BBA',
    members: [
      {
        name: 'Mr. Harsharadhya H U',
        designation: 'Assistant Professor - BBA',
        qualifications: 'M.Com, PGDHRM',
      },
      {
        name: 'Mrs. Lakshmidevi N',
        designation: 'Assistant Professor - BBA',
        qualifications: 'M.Com, PGDHRM',
      },
      {
        name: 'Mr. Jaisimha Rao B S',
        designation: 'Assistant Professor - BBA',
        qualifications: 'M.Com, KSET',
      },
    ],
  },
  {
    department: 'B.Com',
    members: [
      {
        name: 'Mr. Muthuraj T R',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'M.Com, NET, B.Ed',
      },
      {
        name: 'Mrs. Geethashree',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'M.Com, PGDHRM',
      },
      {
        name: 'Mr. Sagar A S',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'M.Com, NET',
      },
      {
        name: 'Mrs. Pankaja N',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'M.Com',
      },
      {
        name: 'Ms. Bhagyashree L',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'M.Com',
      },
    ],
  },
  {
    department: 'BCA',
    members: [
      {
        name: 'Mrs. Shalika H S',
        designation: 'HoD - BCA',
        qualifications: 'MBA, (Ph.D)',
      },
      {
        name: 'Mrs. Dhanya P M',
        designation: 'Assistant Professor - BCA',
        qualifications: 'ME',
      },
      {
        name: 'Mr. Shivakumar B',
        designation: 'Assistant Professor - BCA',
        qualifications: 'MCA',
      },
      {
        name: 'Ms. Varsha U',
        designation: 'Assistant Professor - BCA',
        qualifications: 'MCA',
      },
      {
        name: 'Ms. Nayana S Patel',
        designation: 'Assistant Professor - BCA',
        qualifications: 'MCA',
      },
    ],
  },
  {
    department: 'M.Com',
    members: [
      {
        name: 'Mr. Chidananda V N',
        designation: 'HoD - M.Com',
        qualifications: 'MBA, M.Com, (Ph.D)',
      },
      {
        name: 'Mrs. Vanajakshamma C',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW, KSET',
      },
      {
        name: 'Ms. Shwetha G K',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW, KSET',
      },
      {
        name: 'Ms. Banupriya K R',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW',
      },
      {
        name: 'Mrs. Dyamalamba G A',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, PGDFMP',
      },
    ],
  },
  {
    department: 'MSW',
    members: [
      {
        name: 'Dr. C V Guruprasad',
        designation: 'HoD - MSW',
        qualifications: 'MBA, M.Com, M.Phil, PGDHRM, PGDIBO, PhD.',
      },
      {
        name: 'Mr. Raghu P K',
        designation: 'Assistant Professor - MSW',
        qualifications: 'MSW, PGDHRM, MA (Eng)',
      },
      {
        name: 'Mrs. Svethana H K',
        designation: 'Assistant Professor - MSW',
        qualifications: 'MSW',
      },
    ],
  },
  {
    department: 'Languages and Foundation',
    members: [
      {
        name: 'Mrs. Kalpana A S',
        designation: 'Assistant Professor - English',
        qualifications: 'MA, MSW',
      },
      {
        name: 'Dr. Renukaprasad P R',
        designation: 'Assistant Professor - Kannada Language',
        qualifications: 'MA, M.Phil, NET, Ph.D',
      },
    ],
  },
] as const

const departmentSummary = facultyGroups.map((group) => ({
  department: group.department,
  count: group.members.length,
}))

export function Faculty() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8">
        <PageIntro
          eyebrow="Faculty"
          title="Meet the SSIBM faculty team across management, commerce, computer applications, social work, and languages"
          description="This page presents the current teaching team with department-wise grouping and dedicated space for profile images, making it easy to grow into a richer academic profile directory later."
        />

        <section className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
          {departmentSummary.map((item) => (
            <article
              key={item.department}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                {item.department}
              </p>
              <p className="mt-3 font-display text-4xl font-extrabold text-slate-950">
                {item.count}
              </p>
              <p className="mt-2 text-sm text-slate-500">Faculty members listed</p>
            </article>
          ))}
        </section>

        {facultyGroups.map((group) => (
          <section key={group.department} className="grid gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                  Department
                </p>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-950">
                  {group.department}
                </h2>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                {group.members.length} profiles
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.members.map((faculty) => (
                <article
                  key={faculty.name}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_45%,#fef3c7_100%)] p-5">
                    <div className="w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-5 py-12 text-center">
                      <p className="font-display text-xl font-extrabold text-slate-900">
                        {faculty.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Image placeholder
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                      {group.department}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-extrabold text-slate-950">
                      {faculty.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {faculty.designation}
                    </p>
                    <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Qualifications
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        {faculty.qualifications}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
