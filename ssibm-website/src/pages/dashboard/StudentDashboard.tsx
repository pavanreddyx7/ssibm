import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  TrendingUp,
  User,
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {
  fetchAssignments,
  fetchAttendance,
  fetchComplaints,
  fetchFees,
  fetchMarks,
  fetchMaterials,
  fetchNotices,
  fetchStudentProfile,
  fetchTimetable,
  submitAssignment,
  submitComplaint,
  updateStudentProfile,
} from '../../services/student'
import type {
  Assignment,
  AttendanceRecord,
  AttendanceSummary,
  Complaint,
  FeeRecord,
  MarksRecord,
  Notice,
  StudentProfile,
  StudyMaterial,
  TimetableSlot,
} from '../../types/student'

type Tab =
  | 'overview'
  | 'attendance'
  | 'timetable'
  | 'marks'
  | 'fees'
  | 'assignments'
  | 'materials'
  | 'notices'
  | 'complaints'
  | 'profile'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'timetable', label: 'Timetable', icon: ClipboardList },
  { id: 'marks', label: 'Marks & Results', icon: TrendingUp },
  { id: 'fees', label: 'Fee Payment', icon: CreditCard },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'materials', label: 'Study Materials', icon: FileText },
  { id: 'notices', label: 'Notices', icon: Bell },
  { id: 'complaints', label: 'Support', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
]

const DAYS: TimetableSlot['day'][] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

function buildAttendanceSummary(records: AttendanceRecord[]): AttendanceSummary[] {
  const map = new Map<string, AttendanceSummary>()
  for (const r of records) {
    const key = r.courseCode
    if (!map.has(key)) {
      map.set(key, { courseCode: r.courseCode, courseName: r.courseName, total: 0, present: 0, percentage: 0 })
    }
    const entry = map.get(key)!
    entry.total++
    if (r.status === 'present' || r.status === 'late') entry.present++
  }
  for (const entry of map.values()) {
    entry.percentage = entry.total === 0 ? 0 : Math.round((entry.present / entry.total) * 100)
  }
  return Array.from(map.values())
}

export function StudentDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchStudentProfile(user.id)
      .then(setProfile)
      .catch(() => null)
      .finally(() => setIsLoadingProfile(false))
  }, [user])

  function handleProfileUpdate(updated: StudentProfile) {
    setProfile(updated)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">SSIBM</p>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLoadingProfile ? (
              <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
            ) : (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">{profile?.name ?? user?.name}</p>
                <p className="text-xs text-slate-500">
                  {profile?.rollNumber} · {profile?.course}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6 lg:items-start">
          {/* Sidebar — desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-24 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Mobile tabs — horizontal scroll */}
          <div className="w-full lg:hidden">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            {activeTab === 'overview' && (
              <OverviewTab profile={profile} isLoading={isLoadingProfile} onTabChange={setActiveTab} />
            )}
            {activeTab === 'attendance' && user && (
              <AttendanceTab uid={user.id} />
            )}
            {activeTab === 'timetable' && profile && (
              <TimetableTab course={profile.course} semester={profile.semester} />
            )}
            {activeTab === 'marks' && user && (
              <MarksTab uid={user.id} profile={profile} />
            )}
            {activeTab === 'fees' && user && (
              <FeesTab uid={user.id} />
            )}
            {activeTab === 'assignments' && user && profile && (
              <AssignmentsTab uid={user.id} course={profile.course} />
            )}
            {activeTab === 'materials' && profile && (
              <MaterialsTab course={profile.course} />
            )}
            {activeTab === 'notices' && (
              <NoticesTab />
            )}
            {activeTab === 'complaints' && user && (
              <ComplaintsTab uid={user.id} studentName={user.name ?? profile?.name ?? ''} />
            )}
            {activeTab === 'profile' && user && profile && (
              <ProfileTab
                uid={user.id}
                profile={profile}
                onUpdated={handleProfileUpdate}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{title}</h2>
    </div>
  )
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
      {message}
    </p>
  )
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-rose-100 text-rose-700',
    late: 'bg-amber-100 text-amber-700',
    leave: 'bg-slate-100 text-slate-600',
    open: 'bg-rose-100 text-rose-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    paid: 'bg-emerald-100 text-emerald-700',
    partial: 'bg-amber-100 text-amber-700',
    unpaid: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewTab({
  profile,
  isLoading,
  onTabChange,
}: {
  profile: StudentProfile | null
  isLoading: boolean
  onTabChange: (tab: Tab) => void
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Student Dashboard" title={`Welcome back, ${profile?.name ?? '…'}`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Program</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">
            {isLoading ? '…' : (profile?.course ?? 'N/A')}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? '' : `Sem ${profile?.semester} · Sec ${profile?.section}`}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Roll No</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">
            {isLoading ? '…' : (profile?.rollNumber ?? 'N/A')}
          </p>
          <p className="mt-1 text-sm text-slate-500">Student ID</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</p>
          <p className="mt-2 text-xl font-bold text-slate-950 break-all">
            {isLoading ? '…' : (profile?.phone ?? 'N/A')}
          </p>
          <p className="mt-1 text-sm text-slate-500">Parent: {isLoading ? '…' : (profile?.parentPhone ?? 'N/A')}</p>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Quick Links</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'View Attendance', desc: 'Check subject-wise attendance', tab: 'attendance' as Tab },
            { label: "Today's Timetable", desc: 'Classes and sessions', tab: 'timetable' as Tab },
            { label: 'Latest Marks', desc: 'Semester results', tab: 'marks' as Tab },
            { label: 'Fee Status', desc: 'Dues and payment history', tab: 'fees' as Tab },
            { label: 'Assignments', desc: 'Pending & submitted', tab: 'assignments' as Tab },
            { label: 'Raise a Complaint', desc: 'Get support from admin', tab: 'complaints' as Tab },
          ].map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              className="rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100"
            >
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Attendance ───────────────────────────────────────────────────────────────

function AttendanceTab({ uid }: { uid: string }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAttendance(uid)
      .then(setRecords)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [uid])

  const summaries = buildAttendanceSummary(records)
  const overall =
    summaries.length === 0
      ? 0
      : Math.round(summaries.reduce((acc, s) => acc + s.percentage, 0) / summaries.length)

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Attendance" title="Your attendance record" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Overall Attendance
          </p>
          <p
            className={`mt-2 text-5xl font-extrabold ${overall >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {isLoading ? '…' : `${overall}%`}
          </p>
          <p className="mt-1 text-sm text-slate-500">Minimum required: 75%</p>
          {!isLoading && overall < 75 && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              Warning: Below required attendance. Contact your class teacher.
            </p>
          )}
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Total Classes
          </p>
          <p className="mt-2 text-5xl font-extrabold text-slate-950">
            {isLoading ? '…' : records.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Present: {records.filter((r) => r.status === 'present').length} · Absent:{' '}
            {records.filter((r) => r.status === 'absent').length}
          </p>
        </Card>
      </div>

      {/* Subject-wise */}
      <Card>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Subject-wise Breakdown
        </p>
        {isLoading ? (
          <Skeleton />
        ) : summaries.length === 0 ? (
          <Empty message="No attendance records found. Records will appear once faculty marks attendance." />
        ) : (
          <div className="grid gap-4">
            {summaries.map((s) => (
              <div key={s.courseCode}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{s.courseName}</p>
                    <p className="text-xs text-slate-500">{s.courseCode} · {s.present}/{s.total} classes</p>
                  </div>
                  <p
                    className={`text-lg font-bold ${s.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {s.percentage}%
                  </p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${s.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent records */}
      <Card>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Recent Records
        </p>
        {isLoading ? (
          <Skeleton />
        ) : records.length === 0 ? (
          <Empty message="No records yet." />
        ) : (
          <div className="grid gap-2">
            {records.slice(0, 20).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.courseName}</p>
                  <p className="text-xs text-slate-500">{r.date}</p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Timetable ────────────────────────────────────────────────────────────────

function TimetableTab({ course, semester }: { course: string; semester: string }) {
  const [slots, setSlots] = useState<TimetableSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimetable(course, semester)
      .then(setSlots)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [course, semester])

  const today = DAYS[new Date().getDay() - 1]

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Timetable" title="Weekly class schedule" />

      {isLoading ? (
        <Card><Skeleton rows={5} /></Card>
      ) : slots.length === 0 ? (
        <Card><Empty message="No timetable published yet. Check back after the semester begins." /></Card>
      ) : (
        <div className="grid gap-4">
          {DAYS.map((day) => {
            const daySlots = slots
              .filter((s) => s.day === day)
              .sort((a, b) => a.time.localeCompare(b.time))
            const isToday = day === today
            return (
              <Card key={day} className={isToday ? 'border-primary/30 bg-primary/5' : ''}>
                <div className="mb-3 flex items-center gap-3">
                  <p className="font-bold text-slate-900">{day}</p>
                  {isToday && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                      Today
                    </span>
                  )}
                </div>
                {daySlots.length === 0 ? (
                  <p className="text-sm text-slate-400">No classes</p>
                ) : (
                  <div className="grid gap-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="grid grid-cols-[80px,1fr,auto] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
                      >
                        <p className="text-xs font-semibold text-slate-500">{slot.time}</p>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                          <p className="text-xs text-slate-500">{slot.faculty}</p>
                        </div>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {slot.room}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Marks ────────────────────────────────────────────────────────────────────

function downloadMarksPdf(marks: MarksRecord[], profile: StudentProfile | null) {
  const semesters = [...new Set(marks.map((m) => m.semester))].sort()
  const semSections = semesters.map((sem) => {
    const semMarks = marks.filter((m) => m.semester === sem)
    const totalObtained = semMarks.reduce((a, m) => a + m.total, 0)
    const totalMax = semMarks.reduce((a, m) => a + m.maxTotal, 0)
    const pct = totalMax === 0 ? 0 : Math.round((totalObtained / totalMax) * 100)
    const rows = semMarks.map((m) => `
      <tr>
        <td>${m.subject}</td>
        <td>${m.courseCode}</td>
        <td style="text-align:center">${m.internal}/${m.maxInternal}</td>
        <td style="text-align:center">${m.external}/${m.maxExternal}</td>
        <td style="text-align:center;font-weight:700">${m.total}/${m.maxTotal}</td>
        <td style="text-align:center;font-weight:700;color:${m.grade === 'F' ? '#dc2626' : '#059669'}">${m.grade}</td>
      </tr>`).join('')
    return `
      <div class="sem-block">
        <div class="sem-header">
          <span>Semester ${sem}</span>
          <span>${totalObtained}/${totalMax} &nbsp;·&nbsp; ${pct}%</span>
        </div>
        <table>
          <thead><tr>
            <th>Subject</th><th>Code</th>
            <th style="text-align:center">Internal</th>
            <th style="text-align:center">External</th>
            <th style="text-align:center">Total</th>
            <th style="text-align:center">Grade</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`
  }).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Result Card — ${profile?.name ?? 'Student'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1e293b; padding: 32px; }
  .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { font-size: 20px; font-weight: 800; letter-spacing: .05em; }
  .header h2 { font-size: 14px; font-weight: 600; margin-top: 4px; color: #475569; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 24px; font-size: 12px; }
  .info-grid span { color: #64748b; }
  .info-grid strong { color: #0f172a; }
  .sem-block { margin-bottom: 24px; }
  .sem-header { display: flex; justify-content: space-between; background: #1e293b; color: #fff; padding: 8px 12px; font-weight: 700; border-radius: 4px 4px 0 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
  tr:last-child td { border-bottom: none; }
  .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  @media print { body { padding: 16px; } }
</style></head><body>
<div class="header">
  <h1>SSIBM — Sri Sairam Institute of Business Management</h1>
  <h2>Student Result Card</h2>
</div>
<div class="info-grid">
  <div><span>Name: </span><strong>${profile?.name ?? '—'}</strong></div>
  <div><span>Roll No: </span><strong>${profile?.rollNumber ?? '—'}</strong></div>
  <div><span>Course: </span><strong>${profile?.course ?? '—'}</strong></div>
  <div><span>Section: </span><strong>${profile?.section ?? '—'}</strong></div>
  <div><span>Email: </span><strong>${profile?.email ?? '—'}</strong></div>
  <div><span>Generated: </span><strong>${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></div>
</div>
${semSections}
<div class="footer">
  <span>This is a computer-generated document.</span>
  <span>SSIBM Student Portal</span>
</div>
</body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank', 'width=900,height=700')
  if (!win) { URL.revokeObjectURL(url); return }
  win.addEventListener('load', () => { win.print(); URL.revokeObjectURL(url) })
}

function MarksTab({ uid, profile }: { uid: string; profile: StudentProfile | null }) {
  const [marks, setMarks] = useState<MarksRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMarks(uid)
      .then(setMarks)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [uid])

  // Only show published results (treat missing `published` field as published for backward compat)
  const visibleMarks = marks.filter((m) => m.published !== false)
  const semesters = [...new Set(visibleMarks.map((m) => m.semester))].sort()

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle eyebrow="Marks & Results" title="Semester-wise performance" />
        {visibleMarks.length > 0 && (
          <button
            type="button"
            onClick={() => downloadMarksPdf(visibleMarks, profile)}
            className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
          >
            Download PDF
          </button>
        )}
      </div>

      {isLoading ? (
        <Card><Skeleton rows={4} /></Card>
      ) : visibleMarks.length === 0 ? (
        <Card><Empty message="No results published yet. Results appear after exams are evaluated." /></Card>
      ) : (
        semesters.map((sem) => {
          const semMarks = visibleMarks.filter((m) => m.semester === sem)
          const totalObtained = semMarks.reduce((a, m) => a + m.total, 0)
          const totalMax = semMarks.reduce((a, m) => a + m.maxTotal, 0)
          const pct = totalMax === 0 ? 0 : Math.round((totalObtained / totalMax) * 100)
          return (
            <Card key={sem}>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-slate-900">Semester {sem}</p>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-primary">{pct}%</p>
                  <p className="text-xs text-slate-500">{totalObtained}/{totalMax}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>
                      <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Internal
                      </th>
                      <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        External
                      </th>
                      <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total
                      </th>
                      <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {semMarks.map((m) => (
                      <tr key={m.id} className="border-b border-slate-50">
                        <td className="py-3">
                          <p className="font-semibold text-slate-900">{m.subject}</p>
                          <p className="text-xs text-slate-400">{m.courseCode}</p>
                        </td>
                        <td className="py-3 text-center text-slate-700">
                          {m.internal}/{m.maxInternal}
                        </td>
                        <td className="py-3 text-center text-slate-700">
                          {m.external}/{m.maxExternal}
                        </td>
                        <td className="py-3 text-center font-bold text-slate-900">
                          {m.total}/{m.maxTotal}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              m.grade === 'F'
                                ? 'bg-rose-100 text-rose-700'
                                : m.grade === 'A' || m.grade === 'O'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {m.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

function FeesTab({ uid }: { uid: string }) {
  const [fees, setFees] = useState<FeeRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFees(uid)
      .then(setFees)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [uid])

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Fee Payment" title="Fee status and history" />

      {isLoading ? (
        <Card><Skeleton rows={3} /></Card>
      ) : !fees ? (
        <Card><Empty message="No fee record found. Contact the accounts office." /></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Total Fee</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                ₹{fees.totalFee.toLocaleString('en-IN')}
              </p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Paid</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                ₹{fees.paidAmount.toLocaleString('en-IN')}
              </p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Due</p>
              <p className={`mt-2 text-3xl font-extrabold ${fees.dueAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{fees.dueAmount.toLocaleString('en-IN')}
              </p>
              {fees.dueAmount > 0 && (
                <p className="mt-1 text-xs text-slate-500">Due by {fees.dueDate}</p>
              )}
            </Card>
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Status
              </p>
              <Badge status={fees.status} />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.round((fees.paidAmount / fees.totalFee) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 text-right">
              {Math.round((fees.paidAmount / fees.totalFee) * 100)}% paid
            </p>

            {fees.dueAmount > 0 && (
              <div className="mt-6 rounded-2xl bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Ready to pay?</p>
                <p className="mt-1 text-xs text-slate-600">
                  Visit the accounts office or contact at 0816-2201008 to pay via DD/NEFT. Online
                  payment integration coming soon.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Payment History
            </p>
            {fees.transactions.length === 0 ? (
              <Empty message="No payment transactions recorded yet." />
            ) : (
              <div className="grid gap-2">
                {fees.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {tx.date} · {tx.method}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">#{tx.receiptNo}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

// ─── Assignments ──────────────────────────────────────────────────────────────

function AssignmentsTab({ uid, course }: { uid: string; course: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAssignments(uid, course)
      .then(setAssignments)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [uid, course])

  async function handleSubmit(id: string) {
    setSubmittingId(id)
    try {
      await submitAssignment(id, uid, 'submitted-via-portal')
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, submitted: true, submittedAt: new Date().toISOString() } : a,
        ),
      )
    } catch {
      // handle silently
    } finally {
      setSubmittingId(null)
    }
  }

  const pending = assignments.filter((a) => !a.submitted)
  const submitted = assignments.filter((a) => a.submitted)

  return (
    <div className="grid gap-5">
      <SectionTitle
        eyebrow="Assignments"
        title={`${pending.length} pending · ${submitted.length} submitted`}
      />

      {isLoading ? (
        <Card><Skeleton rows={3} /></Card>
      ) : assignments.length === 0 ? (
        <Card><Empty message="No assignments posted yet." /></Card>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
                Pending
              </p>
              {pending.map((a) => {
                const isOverdue = new Date(a.dueDate) < new Date()
                return (
                  <Card key={a.id}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900">{a.title}</p>
                          {isOverdue && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {a.courseName} · {a.courseCode}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">{a.description}</p>
                        <p className="mt-3 text-xs text-slate-500">
                          Due: <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>{a.dueDate}</span>
                          {' · '}Max marks: {a.maxMarks}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleSubmit(a.id)}
                        disabled={submittingId === a.id}
                        className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {submittingId === a.id ? 'Submitting…' : 'Mark Submitted'}
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {submitted.length > 0 && (
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Submitted
              </p>
              {submitted.map((a) => (
                <Card key={a.id} className="opacity-80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{a.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{a.courseName}</p>
                      {a.submittedAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          Submitted {new Date(a.submittedAt).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge status="present" />
                      {a.obtainedMarks !== undefined && (
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {a.obtainedMarks}/{a.maxMarks}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Study Materials ──────────────────────────────────────────────────────────

function MaterialsTab({ course }: { course: string }) {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchMaterials(course)
      .then(setMaterials)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [course])

  const typeIcon: Record<string, string> = {
    pdf: '📄',
    video: '🎬',
    doc: '📝',
    link: '🔗',
  }

  const filtered = filter === 'all' ? materials : materials.filter((m) => m.type === filter)

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Study Materials" title="Notes, videos & resources" />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'pdf', 'video', 'doc', 'link'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              filter === f
                ? 'bg-primary text-white'
                : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Card><Skeleton rows={4} /></Card>
      ) : filtered.length === 0 ? (
        <Card><Empty message="No materials uploaded yet." /></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((m) => (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{typeIcon[m.type] ?? '📁'}</span>
                  <div>
                    <p className="font-bold text-slate-900">{m.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {m.courseName} · {new Date(m.uploadedAt).toLocaleDateString('en-IN')}
                    </p>
                    {m.description && (
                      <p className="mt-1 text-sm text-slate-600">{m.description}</p>
                    )}
                  </div>
                </div>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition"
                >
                  Open
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Notices ──────────────────────────────────────────────────────────────────

function NoticesTab() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
      .then(setNotices)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Notices" title="Announcements from faculty & admin" />

      {isLoading ? (
        <Card><Skeleton rows={4} /></Card>
      ) : notices.length === 0 ? (
        <Card><Empty message="No notices posted yet. Check back later." /></Card>
      ) : (
        <div className="grid gap-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Bell className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {n.createdByName} · {new Date(n.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{n.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Complaints / Support ─────────────────────────────────────────────────────

function ComplaintsTab({ uid, studentName }: { uid: string; studentName: string }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('Academic')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    load()
  }, [uid])

  function load() {
    setIsLoading(true)
    fetchComplaints(uid)
      .then(setComplaints)
      .catch(() => null)
      .finally(() => setIsLoading(false))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return
    setIsSubmitting(true)
    try {
      await submitComplaint(uid, { subject, category, description, studentName })
      setSuccess(true)
      setSubject('')
      setDescription('')
      setShowForm(false)
      load()
    } catch {
      // handle silently
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle eyebrow="Support" title="Complaints & grievances" />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white"
        >
          {showForm ? 'Cancel' : '+ New Complaint'}
        </button>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Complaint submitted successfully. The admin team will respond within 3 working days.
        </div>
      )}

      {showForm && (
        <Card>
          <p className="mb-4 text-sm font-bold text-slate-900">Raise a new complaint</p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {['Academic', 'Fee', 'Facility', 'Attendance', 'Faculty', 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject of your complaint"
                required
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the issue in detail…"
                required
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Complaint'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><Skeleton rows={3} /></Card>
      ) : complaints.length === 0 ? (
        <Card><Empty message="No complaints raised yet. Use the button above to raise one." /></Card>
      ) : (
        <div className="grid gap-3">
          {complaints.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-900">{c.subject}</p>
                    <Badge status={c.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {c.category} · {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{c.description}</p>
                  {(c.adminResponse ?? c.response) && (
                    <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2">
                      <p className="text-xs font-semibold text-emerald-700">Admin Response:</p>
                      <p className="mt-1 text-sm text-emerald-800">{c.adminResponse ?? c.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfileTab({
  uid,
  profile,
  onUpdated,
}: {
  uid: string
  profile: StudentProfile
  onUpdated: (p: StudentProfile) => void
}) {
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [address, setAddress] = useState(profile.address)
  const [parentPhone, setParentPhone] = useState(profile.parentPhone)
  const [dob, setDob] = useState(profile.dob)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: { preventDefault(): void }) {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess(false)
    try {
      await updateStudentProfile(uid, { name, phone, address, parentPhone, dob })
      onUpdated({ ...profile, name, phone, address, parentPhone, dob })
      setSuccess(true)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Profile" title="Your personal details" />

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-950">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <p className="mt-1 text-xs text-slate-400">
              {profile.rollNumber} · {profile.course} · Sem {profile.semester}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" value={name} onChange={setName} />
          <FormField label="Phone" value={phone} onChange={setPhone} type="tel" />
          <FormField label="Date of Birth" value={dob} onChange={setDob} type="date" />
          <FormField label="Parent's Phone" value={parentPhone} onChange={setParentPhone} type="tel" />
          <div className="sm:col-span-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Address</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
              />
            </label>
          </div>

          {/* Read-only fields */}
          <ReadOnlyField label="Roll Number" value={profile.rollNumber} />
          <ReadOnlyField label="Course" value={profile.course} />
          <ReadOnlyField label="Semester" value={profile.semester} />
          <ReadOnlyField label="Section" value={profile.section} />

          {success && (
            <p className="sm:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Profile updated successfully.
            </p>
          )}
          {error && (
            <p className="sm:col-span-2 text-sm font-semibold text-rose-600">{error}</p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}
