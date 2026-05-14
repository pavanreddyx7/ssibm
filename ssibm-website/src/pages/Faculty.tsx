import { useState } from 'react'
import { PageIntro } from './shared/PageIntro.tsx'

interface FacultyMember {
  name: string
  designation: string
  qualifications: string
  image: string | null
}

const facultyGroups = [
  {
    department: 'BBA',
    members: [
      {
        name: 'Mr. Harsharadhya H U',
        designation: 'Assistant Professor - BBA',
        qualifications: 'BBA, M.Com, PGDHRM',
        image: '/faculty/HARSHARADHYA H U.jpg',
      },
      {
        name: 'Mrs. Lakshmidevi N',
        designation: 'Assistant Professor - BBA',
        qualifications: 'BBA, M.Com, PGDHRM',
        image: '/faculty/LAKSHMIDEVI N.jpg',
      },
      {
        name: 'Mr. Jaisimha Rao B S',
        designation: 'Assistant Professor - BBA',
        qualifications: 'BBA, M.Com, KSET',
        image: '/faculty/JAISIMHA RAO B S.jpg',
      },
    ],
  },
  {
    department: 'B.Com',
    members: [
      {
        name: 'Mr. Muthuraj T R',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'B.Com, M.Com, NET, B.Ed',
        image: '/faculty/MUTHURAJ T R.jpg',
      },
      {
        name: 'Mrs. Geethashree',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'B.Com, M.Com, PGDHRM',
        image: '/faculty/Geethashree.jpg',
      },
      {
        name: 'Mr. Sagar A S',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'B.Com, M.Com, NET',
        image: '/faculty/SAGAR A S.jpg',
      },
      {
        name: 'Mrs. Pankaja N',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'B.Com, M.Com',
        image: '/faculty/PANKAJA N.jpg',
      },
      {
        name: 'Ms. Bhagyashree L',
        designation: 'Assistant Professor - B.Com',
        qualifications: 'B.Com, M.Com',
        image: '/faculty/Bhagyashree L.jpg',
      },
    ],
  },
  {
    department: 'BCA',
    members: [
      {
        name: 'Mrs. Shalika H S',
        designation: 'Head of Department - BCA',
        qualifications: 'MBA, Ph.D',
        image: '/faculty/Shalika H S.jpg',
      },
      {
        name: 'Mrs. Dhanya P M',
        designation: 'Assistant Professor - BCA',
        qualifications: 'BCA, ME',
        image: '/faculty/DHANYA P M.jpg',
      },
      {
        name: 'Mr. Shivakumar B',
        designation: 'Assistant Professor - BCA',
        qualifications: 'BCA, MCA',
        image: '/faculty/Shivakumar B.jpg',
      },
      {
        name: 'Ms. Nayana S Patel',
        designation: 'Assistant Professor - BCA',
        qualifications: 'BCA, MCA',
        image: '/faculty/Nayana S Patel.jpg',
      },
    ],
  },
  {
    department: 'M.Com',
    members: [
      {
        name: 'Mr. Chidananda V N',
        designation: 'Head of Department - M.Com',
        qualifications: 'MBA, M.Com, Ph.D',
        image: '/faculty/Chidanand V N.jpg',
      },
      {
        name: 'Mrs. Vanajakshamma C',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW, KSET',
        image: null,
      },
      {
        name: 'Ms. Shwetha G K',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW, KSET',
        image: '/faculty/SHWETHA G K.jpg',
      },
      {
        name: 'Ms. Banupriya K R',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, MSW',
        image: '/faculty/BANUPRIYA K R.jpg',
      },
      {
        name: 'Mrs. Dyamalamba G A',
        designation: 'Assistant Professor - M.Com',
        qualifications: 'M.Com, PGDFMP',
        image: '/faculty/DYAMALAMBA G A.jpg',
      },
    ],
  },
  {
    department: 'MSW',
    members: [
      {
        name: 'Dr. C V Guruprasad',
        designation: 'Head of Department - MSW',
        qualifications: 'MBA, M.Com, M.Phil, PGDHRM, PGDIBO, Ph.D',
        image: '/faculty/GURU PRASAD C V.jpg',
      },
      {
        name: 'Mr. Raghu P K',
        designation: 'Assistant Professor - MSW',
        qualifications: 'MSW, PGDHRM, MA (Eng)',
        image: '/faculty/RAGHU P K.jpg',
      },
      {
        name: 'Mrs. Svethana H K',
        designation: 'Assistant Professor - MSW',
        qualifications: 'MSW',
        image: '/faculty/SVETHANA.jpg',
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
        image: null,
      },
      {
        name: 'Dr. Renukaprasad P R',
        designation: 'Assistant Professor - Kannada Language',
        qualifications: 'MA, M.Phil, NET, Ph.D',
        image: '/faculty/Dr. RENUKAPRASAD P R.jpg',
      },
    ],
  },
] satisfies Array<{ department: string; members: FacultyMember[] }>

const departmentSummary = facultyGroups.map((group) => ({
  department: group.department,
  count: group.members.length,
}))

function FacultyCard({ faculty, department }: { faculty: FacultyMember; department: string }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_45%,#fef3c7_100%)]">
        {faculty.image && !imgError ? (
          <img
            src={faculty.image}
            alt={faculty.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-5">
            <div className="w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-5 py-12 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl font-extrabold text-slate-400">
                {faculty.name.charAt(faculty.name.indexOf(' ') + 1)}
              </div>
              <p className="font-display text-lg font-extrabold text-slate-700">
                {faculty.name}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          {department}
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
  )
}

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
                <FacultyCard
                  key={faculty.name}
                  faculty={faculty}
                  department={group.department}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
