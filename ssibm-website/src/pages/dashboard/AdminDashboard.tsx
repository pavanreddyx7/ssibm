import {
  AlertCircle,
  Bell,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Edit2,
  FileText,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useContext, useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from '../../context/AuthContext.tsx'
import {
  addFeeRecord,
  createFacultyWithCredentials,
  createStudentWithCredentials,
  deleteAllocation,
  deleteComplaint,
  deleteFaculty,
  deleteNotice,
  deleteStudent,
  fetchAdminStats,
  fetchAllAllocations,
  fetchAllApplications,
  fetchAllAttendance,
  fetchAllComplaints,
  fetchAllFaculty,
  fetchAllFees,
  fetchAllMarks,
  fetchAllNotices,
  fetchAllStudents,
  publishMarkResults,
  saveAllocation,
  saveFaculty,
  saveNotice,
  saveStudent,
  updateApplication,
  updateAttendanceRecord,
  updateComplaint,
  updateFeeRecord,
  updateMarkRecord,
} from '../../services/admin.ts'
import type {
  AdminAllocation,
  AdminApplication,
  AdminAttendanceRecord,
  AdminComplaint,
  AdminFaculty,
  AdminFeeRecord,
  AdminMarkRecord,
  AdminStats,
  AdminStudent,
  BroadcastNotice,
} from '../../types/admin'

type Tab =
  | 'overview'
  | 'students'
  | 'faculty'
  | 'courses'
  | 'attendance'
  | 'marks'
  | 'fees'
  | 'applications'
  | 'complaints'
  | 'communication'

const NAV: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="size-4" /> },
  { id: 'students', label: 'Students', icon: <GraduationCap className="size-4" /> },
  { id: 'faculty', label: 'Faculty', icon: <Users className="size-4" /> },
  { id: 'courses', label: 'Courses', icon: <BookOpen className="size-4" /> },
  { id: 'attendance', label: 'Attendance', icon: <ClipboardList className="size-4" /> },
  { id: 'marks', label: 'Marks', icon: <FileText className="size-4" /> },
  { id: 'fees', label: 'Fees', icon: <IndianRupee className="size-4" /> },
  { id: 'applications', label: 'Applications', icon: <AlertCircle className="size-4" /> },
  { id: 'complaints', label: 'Complaints', icon: <MessageSquare className="size-4" /> },
  { id: 'communication', label: 'Communication', icon: <Bell className="size-4" /> },
]

// ── Utilities ─────────────────────────────────────────────────────────────────

function fmtDate(value: string | undefined) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value))
  } catch {
    return value
  }
}

function downloadCsv(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}

function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="mt-6 grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`skel-${i}`} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  )
}

function Badge({ value, variant = 'default' }: { value: string; variant?: 'default' | 'success' | 'warn' | 'danger' | 'info' }) {
  const cls = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    warn: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    info: 'bg-blue-100 text-blue-800',
  }[variant]
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {value.replace(/-/g, ' ')}
    </span>
  )
}

function statusVariant(status: string): 'default' | 'success' | 'warn' | 'danger' | 'info' {
  if (['resolved', 'paid', 'accepted'].includes(status)) return 'success'
  if (['open', 'pending', 'overdue'].includes(status)) return 'danger'
  if (['in-progress', 'partial', 'under-review'].includes(status)) return 'warn'
  if (['closed', 'rejected'].includes(status)) return 'default'
  if (['waitlisted'].includes(status)) return 'info'
  return 'default'
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  )
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  )
}

function ActionBtn({
  icon,
  label,
  onClick,
  variant = 'default',
}: {
  icon: ReactNode
  label?: string
  onClick: () => void
  variant?: 'default' | 'danger' | 'primary'
}) {
  const cls = {
    default: 'border-slate-200 text-slate-600 hover:bg-slate-50',
    danger: 'border-rose-200 text-rose-600 hover:bg-rose-50',
    primary: 'border-primary bg-primary text-white hover:bg-primary/90',
  }[variant]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cls}`}
    >
      {icon}
      {label}
    </button>
  )
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode
  label: string
  value: number | string
  sub: string
}) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </article>
  )
}

function OverviewTab({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  if (loading) return <LoadingRows rows={6} />
  if (!stats) return <EmptyState message="Failed to load stats." />
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={<GraduationCap className="size-5" />} label="Total Students" value={stats.totalStudents} sub="Active student profiles" />
        <StatCard icon={<Users className="size-5" />} label="Total Faculty" value={stats.totalFaculty} sub="Active faculty profiles" />
        <StatCard icon={<AlertCircle className="size-5" />} label="Open Complaints" value={stats.pendingComplaints} sub="Awaiting response" />
        <StatCard icon={<IndianRupee className="size-5" />} label="Pending Fees" value={stats.pendingFees} sub="Students with outstanding dues" />
        <StatCard icon={<FileText className="size-5" />} label="Applications" value={stats.totalApplications} sub="Admissions submissions" />
        <StatCard icon={<Bell className="size-5" />} label="Active Notices" value={stats.activeNotices} sub="Published broadcasts" />
      </div>
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary">Quick Actions</p>
        <p className="mt-2 text-sm text-slate-600">
          Use the tabs on the left to manage students, faculty, courses, attendance, marks, fees,
          admissions applications, complaints, and broadcast notices.
        </p>
      </div>
    </div>
  )
}

// ── Students Tab ──────────────────────────────────────────────────────────────

const DEPARTMENTS = ['MBA', 'MCA', 'BBA', 'BCA', 'B.Com', 'M.Com']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

function blankStudent(): Omit<AdminStudent, 'id'> {
  return {
    role: 'student',
    name: '',
    email: '',
    rollNumber: '',
    department: 'MBA',
    semester: 1,
    batch: '2024-26',
    phone: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    dob: '',
    joiningDate: '',
    isActive: true,
  }
}

function StudentModal({
  initial,
  onClose,
  onSave,
}: {
  initial: AdminStudent | null
  onClose: () => void
  onSave: (id: string | null, data: Omit<AdminStudent, 'id'>, password?: string) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<AdminStudent, 'id'>>(
    initial ? { ...initial } : blankStudent(),
  )
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(key: keyof Omit<AdminStudent, 'id'>, val: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      if (!initial && password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }
      await onSave(initial?.id ?? null, form, initial ? undefined : password.trim())
      onClose()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Edit Student' : 'Add Student'} onClose={onClose}>
      {!initial && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          This will create both the student Firestore profile and Firebase login credentials.
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Full Name" value={form.name} onChange={(v) => set('name', v)} required />
          <FieldInput label="Email" value={form.email} onChange={(v) => set('email', v)} type="email" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Roll Number" value={form.rollNumber} onChange={(v) => set('rollNumber', v)} required />
          <FieldInput label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Department"
            value={form.department}
            onChange={(v) => set('department', v)}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <SelectInput
            label="Semester"
            value={String(form.semester)}
            onChange={(v) => set('semester', Number(v))}
            options={SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Batch" value={form.batch} onChange={(v) => set('batch', v)} />
          <FieldInput label="Date of Birth" value={form.dob ?? ''} onChange={(v) => set('dob', v)} type="date" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Guardian Name" value={form.guardianName ?? ''} onChange={(v) => set('guardianName', v)} />
          <FieldInput label="Guardian Phone" value={form.guardianPhone ?? ''} onChange={(v) => set('guardianPhone', v)} />
        </div>
        {!initial && (
          <FieldInput
            label="Login Password"
            value={password}
            onChange={setPassword}
            type="password"
            required
          />
        )}
        <FieldInput label="Address" value={form.address ?? ''} onChange={(v) => set('address', v)} />
        <FieldInput label="Joining Date" value={form.joiningDate ?? ''} onChange={(v) => set('joiningDate', v)} type="date" />
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function StudentsTab({
  students,
  loading,
  onRefresh,
}: {
  students: AdminStudent[]
  loading: boolean
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<AdminStudent | null | 'new'>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleSaveWithCredentials(
    id: string | null,
    data: Omit<AdminStudent, 'id'>,
    password?: string,
  ) {
    if (id) {
      await saveStudent(id, data)
    } else {
      await createStudentWithCredentials(data, password ?? '')
    }
    onRefresh()
  }

  async function handleDelete(s: AdminStudent) {
    if (!confirm(`Delete student "${s.name}"? This removes their Firestore profile.`)) return
    setDeleting(s.id)
    try {
      await deleteStudent(s.id)
      onRefresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Manage"
        title="Students"
        action={
          <div className="flex gap-2">
            <ActionBtn
              icon={<Plus className="size-3.5" />}
              label="Add Student"
              onClick={() => setModal('new')}
              variant="primary"
            />
            <ActionBtn
              icon={<RefreshCw className="size-3.5" />}
              onClick={onRefresh}
            />
          </div>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          placeholder="Search by name, email, or roll number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message={search ? 'No students match your search.' : 'No students found. Add one or run /dev/seed.'} />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Name / Roll</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Sem</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-secondary">{s.rollNumber} · {s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.department}</td>
                  <td className="px-4 py-3 text-slate-700">{s.semester}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setModal(s)} />
                      <ActionBtn
                        icon={<Trash2 className="size-3" />}
                        onClick={() => void handleDelete(s)}
                        variant="danger"
                      />
                      {deleting === s.id && <span className="text-xs text-slate-400">Deleting…</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                [
                  ['Name', 'Roll', 'Email', 'Department', 'Semester', 'Batch', 'Phone'],
                  ...filtered.map((s) => [s.name, s.rollNumber, s.email, s.department, String(s.semester), s.batch, s.phone]),
                ],
                'students.csv',
              )
            }
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600"
          >
            Export CSV
          </button>
        </div>
      )}

      {modal !== null && (
        <StudentModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSaveWithCredentials}
        />
      )}
    </div>
  )
}

// ── Faculty Tab ───────────────────────────────────────────────────────────────

function blankFaculty(): Omit<AdminFaculty, 'id'> {
  return {
    role: 'faculty',
    name: '',
    email: '',
    employeeId: '',
    department: 'MBA',
    designation: 'Assistant Professor',
    phone: '',
    qualification: '',
    specialization: '',
    joiningDate: '',
    isActive: true,
  }
}

function FacultyModal({
  initial,
  onClose,
  onSave,
}: {
  initial: AdminFaculty | null
  onClose: () => void
  onSave: (id: string | null, data: Omit<AdminFaculty, 'id'>, password?: string) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<AdminFaculty, 'id'>>(
    initial ? { ...initial } : blankFaculty(),
  )
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(key: keyof Omit<AdminFaculty, 'id'>, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      if (!initial && password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }
      await onSave(initial?.id ?? null, form, initial ? undefined : password.trim())
      onClose()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Edit Faculty' : 'Add Faculty'} onClose={onClose}>
      {!initial && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          This will create both the faculty Firestore profile and Firebase login credentials.
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Full Name" value={form.name} onChange={(v) => set('name', v)} required />
          <FieldInput label="Email" value={form.email} onChange={(v) => set('email', v)} type="email" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Employee ID" value={form.employeeId} onChange={(v) => set('employeeId', v)} required />
          <FieldInput label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Department"
            value={form.department}
            onChange={(v) => set('department', v)}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <FieldInput label="Designation" value={form.designation} onChange={(v) => set('designation', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Qualification" value={form.qualification ?? ''} onChange={(v) => set('qualification', v)} />
          <FieldInput label="Specialization" value={form.specialization ?? ''} onChange={(v) => set('specialization', v)} />
        </div>
        {!initial && (
          <FieldInput
            label="Login Password"
            value={password}
            onChange={setPassword}
            type="password"
            required
          />
        )}
        <FieldInput label="Joining Date" value={form.joiningDate ?? ''} onChange={(v) => set('joiningDate', v)} type="date" />
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function FacultyTab({
  faculty,
  loading,
  onRefresh,
}: {
  faculty: AdminFaculty[]
  loading: boolean
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<AdminFaculty | null | 'new'>(null)

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleSave(
    id: string | null,
    data: Omit<AdminFaculty, 'id'>,
    password?: string,
  ) {
    if (id) {
      await saveFaculty(id, data)
    } else {
      await createFacultyWithCredentials(data, password ?? '')
    }
    onRefresh()
  }

  async function handleDelete(f: AdminFaculty) {
    if (!confirm(`Delete faculty "${f.name}"?`)) return
    await deleteFaculty(f.id)
    onRefresh()
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Manage"
        title="Faculty"
        action={
          <div className="flex gap-2">
            <ActionBtn
              icon={<Plus className="size-3.5" />}
              label="Add Faculty"
              onClick={() => setModal('new')}
              variant="primary"
            />
            <ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />
          </div>
        }
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          placeholder="Search by name, email, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No faculty profiles found." />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Name</th>
                <th className="px-4 py-3">Dept</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6">
                    <p className="font-semibold text-slate-900">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{f.department}</td>
                  <td className="px-4 py-3 text-slate-700">{f.designation}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{f.employeeId}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setModal(f)} />
                      <ActionBtn icon={<Trash2 className="size-3" />} onClick={() => void handleDelete(f)} variant="danger" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal !== null && (
        <FacultyModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ── Courses / Allocations Tab ─────────────────────────────────────────────────

function blankAllocation(): Omit<AdminAllocation, 'id'> {
  return {
    facultyId: '',
    facultyName: '',
    subject: '',
    subjectCode: '',
    department: 'MBA',
    semester: 1,
    batch: '2024-26',
    academicYear: '2024-25',
  }
}

function AllocationModal({
  initial,
  faculty,
  onClose,
  onSave,
}: {
  initial: AdminAllocation | null
  faculty: AdminFaculty[]
  onClose: () => void
  onSave: (id: string | null, data: Omit<AdminAllocation, 'id'>) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<AdminAllocation, 'id'>>(
    initial ? { ...initial } : blankAllocation(),
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(key: keyof Omit<AdminAllocation, 'id'>, val: string | number) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function setFaculty(id: string) {
    const f = faculty.find((f) => f.id === id)
    setForm((prev) => ({ ...prev, facultyId: id, facultyName: f?.name ?? '' }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await onSave(initial?.id ?? null, form)
      onClose()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Edit Allocation' : 'Add Allocation'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <SelectInput
          label="Faculty"
          value={form.facultyId}
          onChange={setFaculty}
          options={[
            { value: '', label: 'Select faculty…' },
            ...faculty.map((f) => ({ value: f.id, label: f.name })),
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Subject" value={form.subject} onChange={(v) => set('subject', v)} required />
          <FieldInput label="Subject Code" value={form.subjectCode} onChange={(v) => set('subjectCode', v)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Department"
            value={form.department}
            onChange={(v) => set('department', v)}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />
          <SelectInput
            label="Semester"
            value={String(form.semester)}
            onChange={(v) => set('semester', Number(v))}
            options={SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Batch" value={form.batch} onChange={(v) => set('batch', v)} />
          <FieldInput label="Academic Year" value={form.academicYear} onChange={(v) => set('academicYear', v)} />
        </div>
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function CoursesTab({
  allocations,
  faculty,
  loading,
  onRefresh,
}: {
  allocations: AdminAllocation[]
  faculty: AdminFaculty[]
  loading: boolean
  onRefresh: () => void
}) {
  const [modal, setModal] = useState<AdminAllocation | null | 'new'>(null)

  async function handleSave(id: string | null, data: Omit<AdminAllocation, 'id'>) {
    await saveAllocation(id, data)
    onRefresh()
  }

  async function handleDelete(a: AdminAllocation) {
    if (!confirm(`Remove allocation "${a.subject}" for ${a.facultyName}?`)) return
    await deleteAllocation(a.id)
    onRefresh()
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Manage"
        title="Course Allocations"
        action={
          <div className="flex gap-2">
            <ActionBtn icon={<Plus className="size-3.5" />} label="Add Allocation" onClick={() => setModal('new')} variant="primary" />
            <ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />
          </div>
        }
      />
      {loading ? (
        <LoadingRows />
      ) : allocations.length === 0 ? (
        <EmptyState message="No subject allocations found." />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Subject</th>
                <th className="px-4 py-3">Faculty</th>
                <th className="px-4 py-3">Dept / Sem</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => (
                <tr key={a.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6">
                    <p className="font-semibold text-slate-900">{a.subject}</p>
                    <p className="text-xs text-slate-500">{a.subjectCode}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{a.facultyName}</td>
                  <td className="px-4 py-3 text-slate-700">{a.department} · Sem {a.semester}</td>
                  <td className="px-4 py-3 text-slate-600">{a.batch}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setModal(a)} />
                      <ActionBtn icon={<Trash2 className="size-3" />} onClick={() => void handleDelete(a)} variant="danger" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal !== null && (
        <AllocationModal
          initial={modal === 'new' ? null : modal}
          faculty={faculty}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ── Attendance Tab ────────────────────────────────────────────────────────────

function AttendanceEditModal({
  record,
  onClose,
  onSave,
}: {
  record: AdminAttendanceRecord
  onClose: () => void
  onSave: (id: string, attended: number, totalClasses: number) => Promise<void>
}) {
  const [attended, setAttended] = useState(String(record.attended))
  const [total, setTotal] = useState(String(record.totalClasses))
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await onSave(record.id, Number(attended), Number(total))
    setSaving(false)
    onClose()
  }

  const pct = total ? Math.round((Number(attended) / Number(total)) * 100) : 0

  return (
    <Modal title="Edit Attendance" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <p className="text-sm text-slate-600">
          Student: <strong>{record.studentId}</strong><br />
          Subject: <strong>{record.subject}</strong>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Classes Attended" value={attended} onChange={setAttended} type="number" />
          <FieldInput label="Total Classes" value={total} onChange={setTotal} type="number" />
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
          Attendance: <strong className={pct < 75 ? 'text-rose-600' : 'text-emerald-600'}>{pct}%</strong>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AttendanceTab({
  attendance,
  loading,
  onRefresh,
}: {
  attendance: AdminAttendanceRecord[]
  loading: boolean
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<AdminAttendanceRecord | null>(null)

  const filtered = attendance.filter(
    (a) =>
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleSave(id: string, attended: number, totalClasses: number) {
    await updateAttendanceRecord(id, { attended, totalClasses })
    onRefresh()
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="View & Edit"
        title="Attendance Records"
        action={<ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />}
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          placeholder="Search by student ID or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No attendance records found." />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Student ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Attended / Total</th>
                <th className="px-4 py-3">%</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6 font-mono text-xs text-slate-700">{a.studentId}</td>
                  <td className="px-4 py-3 text-slate-700">{a.subject}</td>
                  <td className="px-4 py-3 text-slate-700">{a.attended} / {a.totalClasses}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${a.percentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {a.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setEditing(a)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <AttendanceEditModal
          record={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ── Marks Tab ─────────────────────────────────────────────────────────────────

function MarksEditModal({
  record,
  onClose,
  onSave,
}: {
  record: AdminMarkRecord
  onClose: () => void
  onSave: (id: string, data: Partial<AdminMarkRecord>) => Promise<void>
}) {
  const [internal, setInternal] = useState(String(record.internalMarks))
  const [external, setExternal] = useState(String(record.externalMarks))
  const [maxMarks, setMaxMarks] = useState(String(record.maxMarks))
  const [saving, setSaving] = useState(false)

  const total = Number(internal) + Number(external)
  const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : total >= 40 ? 'C' : 'F'

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await onSave(record.id, {
      internalMarks: Number(internal),
      externalMarks: Number(external),
      maxMarks: Number(maxMarks),
      totalMarks: total,
      grade,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Edit Marks" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <p className="text-sm text-slate-600">
          Student: <strong>{record.studentName}</strong> ({record.rollNumber})<br />
          Subject: <strong>{record.subject}</strong> · Sem {record.semester}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <FieldInput label="Internal" value={internal} onChange={setInternal} type="number" />
          <FieldInput label="External" value={external} onChange={setExternal} type="number" />
          <FieldInput label="Max Marks" value={maxMarks} onChange={setMaxMarks} type="number" />
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
          Total: <strong>{total}</strong> · Grade: <strong className="text-secondary">{grade}</strong>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function MarksTab({
  marks,
  students,
  loading,
  onRefresh,
}: {
  marks: AdminMarkRecord[]
  students: AdminStudent[]
  loading: boolean
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<AdminMarkRecord | null>(null)
  const [publishing, setPublishing] = useState(false)

  const enriched = marks.map((m) => {
    if (m.studentName) return m
    const profile = students.find((s) => s.id === m.studentId)
    return {
      ...m,
      studentName: profile?.name ?? m.studentId,
      rollNumber: m.rollNumber || profile?.rollNumber || '—',
    }
  })

  const filtered = enriched.filter(
    (m) =>
      m.studentName.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase()),
  )

  const allPublished = filtered.length > 0 && filtered.every((m) => m.published)

  async function handleSave(id: string, data: Partial<AdminMarkRecord>) {
    await updateMarkRecord(id, data)
    onRefresh()
  }

  async function handlePublishAll() {
    setPublishing(true)
    await Promise.all(filtered.map((m) => publishMarkResults(m.id, !allPublished)))
    onRefresh()
    setPublishing(false)
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="View & Edit"
        title="Marks Records"
        action={
          <div className="flex items-center gap-2">
            {filtered.length > 0 && (
              <button
                type="button"
                disabled={publishing}
                onClick={() => void handlePublishAll()}
                className={`rounded-full px-4 py-2 text-sm font-bold transition disabled:opacity-50 ${
                  allPublished
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {publishing ? 'Please wait…' : allPublished ? 'Unpublish All' : 'Publish All Results'}
              </button>
            )}
            <ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />
          </div>
        }
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          placeholder="Search by student name, roll, or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No mark entries found." />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Student</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Sem</th>
                <th className="px-4 py-3">Int / Ext</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6">
                    <p className="font-semibold text-slate-900">{m.studentName}</p>
                    <p className="text-xs text-slate-500">{m.rollNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{m.subject}</td>
                  <td className="px-4 py-3 text-slate-600">{m.semester}</td>
                  <td className="px-4 py-3 text-slate-700">{m.internalMarks} / {m.externalMarks}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{m.totalMarks}</td>
                  <td className="px-4 py-3">
                    <Badge value={m.grade} variant={m.grade === 'F' ? 'danger' : 'success'} />
                  </td>
                  <td className="px-4 py-3">
                    <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setEditing(m)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <MarksEditModal record={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  )
}

// ── Fees Tab ──────────────────────────────────────────────────────────────────

function blankFee(students: AdminStudent[]): Omit<AdminFeeRecord, 'id'> {
  const first = students[0]
  return {
    studentId: first?.id ?? '',
    studentName: first?.name ?? '',
    rollNumber: first?.rollNumber ?? '',
    semester: 1,
    totalAmount: 0,
    paidAmount: 0,
    dueDate: '',
    status: 'pending',
  }
}

function FeeModal({
  initial,
  students,
  onClose,
  onSave,
}: {
  initial: AdminFeeRecord | null
  students: AdminStudent[]
  onClose: () => void
  onSave: (id: string | null, data: Omit<AdminFeeRecord, 'id'>) => Promise<void>
}) {
  const [form, setForm] = useState<Omit<AdminFeeRecord, 'id'>>(
    initial
      ? {
          studentId: initial.studentId,
          studentName: initial.studentName,
          rollNumber: initial.rollNumber,
          semester: initial.semester,
          totalAmount: initial.totalAmount,
          paidAmount: initial.paidAmount,
          dueDate: initial.dueDate,
          status: initial.status,
          lastPaymentDate: initial.lastPaymentDate,
        }
      : blankFee(students),
  )
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function setStudent(id: string) {
    const s = students.find((s) => s.id === id)
    setForm((f) => ({
      ...f,
      studentId: id,
      studentName: s?.name ?? '',
      rollNumber: s?.rollNumber ?? '',
    }))
  }

  function set<K extends keyof Omit<AdminFeeRecord, 'id'>>(key: K, val: Omit<AdminFeeRecord, 'id'>[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    try {
      await onSave(initial?.id ?? null, form)
      onClose()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const due = form.totalAmount - form.paidAmount

  return (
    <Modal title={initial ? 'Edit Fee Record' : 'Add Fee Record'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-3">
        {!initial && (
          <SelectInput
            label="Student"
            value={form.studentId}
            onChange={setStudent}
            options={[
              { value: '', label: 'Select student…' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNumber})` })),
            ]}
          />
        )}
        {initial && (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong>{initial.studentName}</strong> · {initial.rollNumber}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Semester"
            value={String(form.semester)}
            onChange={(v) => set('semester', Number(v))}
            options={SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` }))}
          />
          <FieldInput
            label="Due Date"
            value={form.dueDate}
            onChange={(v) => set('dueDate', v)}
            type="date"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput
            label="Total Amount (₹)"
            value={form.totalAmount}
            onChange={(v) => set('totalAmount', Number(v))}
            type="number"
            required
          />
          <FieldInput
            label="Paid Amount (₹)"
            value={form.paidAmount}
            onChange={(v) => set('paidAmount', Number(v))}
            type="number"
            required
          />
        </div>
        <SelectInput
          label="Status"
          value={form.status}
          onChange={(v) => set('status', v as AdminFeeRecord['status'])}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'partial', label: 'Partial' },
            { value: 'paid', label: 'Paid' },
            { value: 'overdue', label: 'Overdue' },
          ]}
        />
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
          Balance due: <strong className={due > 0 ? 'text-rose-600' : 'text-emerald-600'}>
            ₹{due.toLocaleString('en-IN')}
          </strong>
        </div>
        {err && <p className="text-xs text-rose-600">{err}</p>}
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function FeesTab({
  fees,
  students,
  loading,
  onRefresh,
}: {
  fees: AdminFeeRecord[]
  students: AdminStudent[]
  loading: boolean
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<AdminFeeRecord | null | 'new'>(null)

  const enriched = fees.map((f) => ({
    ...f,
    studentName: f.studentName ?? students.find((s) => s.id === f.studentId)?.name ?? f.studentId,
    rollNumber: f.rollNumber ?? students.find((s) => s.id === f.studentId)?.rollNumber ?? '—',
  }))

  const filtered = enriched.filter(
    (f) =>
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.rollNumber.toLowerCase().includes(search.toLowerCase()),
  )

  async function handleSave(id: string | null, data: Omit<AdminFeeRecord, 'id'>) {
    if (id) {
      await updateFeeRecord(id, data)
    } else {
      await addFeeRecord(data)
    }
    onRefresh()
  }

  async function markAsPaid(f: AdminFeeRecord) {
    await updateFeeRecord(f.id, {
      paidAmount: f.totalAmount,
      status: 'paid',
      lastPaymentDate: new Date().toISOString(),
    })
    onRefresh()
  }

  async function markAsDue(f: AdminFeeRecord) {
    await updateFeeRecord(f.id, { status: 'pending', paidAmount: 0 })
    onRefresh()
  }

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Manage"
        title="Fee Records"
        action={
          <div className="flex gap-2">
            <ActionBtn
              icon={<Plus className="size-3.5" />}
              label="Add Fee"
              onClick={() => setModal('new')}
              variant="primary"
            />
            <ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />
          </div>
        }
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          placeholder="Search by student name or roll…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No fee records found. Use 'Add Fee' to create one." />
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                <th className="px-4 py-3 pl-6">Student</th>
                <th className="px-4 py-3">Sem</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t border-slate-100 text-sm hover:bg-slate-50">
                  <td className="px-4 py-3 pl-6">
                    <p className="font-semibold text-slate-900">{f.studentName}</p>
                    <p className="text-xs text-slate-500">{f.rollNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{f.semester}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{f.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-emerald-700">₹{f.paidAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-600">{fmtDate(f.dueDate)}</td>
                  <td className="px-4 py-3">
                    <Badge value={f.status} variant={statusVariant(f.status)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <ActionBtn icon={<Edit2 className="size-3" />} onClick={() => setModal(f)} />
                      {f.status !== 'paid' && (
                        <ActionBtn
                          icon={<CheckCircle className="size-3" />}
                          label="Paid"
                          onClick={() => void markAsPaid(f)}
                          variant="primary"
                        />
                      )}
                      {f.status === 'paid' && (
                        <ActionBtn
                          icon={<AlertCircle className="size-3" />}
                          label="Due"
                          onClick={() => void markAsDue(f)}
                          variant="danger"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal !== null && (
        <FeeModal
          initial={modal === 'new' ? null : modal}
          students={students}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ── Applications Tab ──────────────────────────────────────────────────────────

function ApplicationModal({
  record,
  onClose,
  onSave,
}: {
  record: AdminApplication
  onClose: () => void
  onSave: (id: string, data: Partial<AdminApplication>) => Promise<void>
}) {
  const [status, setStatus] = useState(record.status)
  const [notes, setNotes] = useState(record.reviewNotes ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await onSave(record.id, { status, reviewNotes: notes })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Review Application" onClose={onClose}>
      <div className="mb-4 grid gap-1 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <p><strong>{record.applicantName}</strong> · {record.email}</p>
        <p>{record.phone} · {record.course}</p>
        {record.previousQualification && (
          <p>{record.previousQualification} — {record.percentage}%</p>
        )}
        {record.dateOfBirth && <p>Date of Birth: {fmtDate(record.dateOfBirth)}</p>}
        {(record.city || record.state) && <p>Location: {[record.city, record.state].filter(Boolean).join(', ')}</p>}
        {record.referenceId && <p>Reference ID: {record.referenceId}</p>}
        <p>Documents Confirmed: {record.documentsConfirmed ? 'Yes' : 'No'}</p>
        <p>Consent to Contact: {record.consentToContact ? 'Yes' : 'No'}</p>
        <p className="text-xs text-slate-500">Submitted: {fmtDate(record.submittedAt)}</p>
        {record.address && <p className="text-xs text-slate-500">{record.address}</p>}
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <SelectInput
          label="Status"
          value={status}
          onChange={(v) => setStatus(v as AdminApplication['status'])}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'under-review', label: 'Under Review' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'waitlisted', label: 'Waitlisted' },
          ]}
        />
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Review Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Update'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ApplicationsTab({
  applications,
  loading,
  onRefresh,
}: {
  applications: AdminApplication[]
  loading: boolean
  onRefresh: () => void
}) {
  const [filter, setFilter] = useState<AdminApplication['status'] | 'all'>('all')
  const [reviewing, setReviewing] = useState<AdminApplication | null>(null)

  const filtered = applications.filter((a) => filter === 'all' || a.status === filter)

  async function handleSave(id: string, data: Partial<AdminApplication>) {
    await updateApplication(id, data)
    onRefresh()
  }

  const statuses: (AdminApplication['status'] | 'all')[] = ['all', 'pending', 'under-review', 'accepted', 'rejected', 'waitlisted']

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Admissions"
        title="Applications"
        action={<ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />}
      />
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === s ? 'bg-primary text-white' : 'border border-slate-200 text-slate-600'
            }`}
          >
            {s === 'all' ? `All (${applications.length})` : s.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No applications in this category." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => (
            <article key={a.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{a.applicantName}</p>
                  <p className="text-xs text-slate-500">{a.email} · {a.phone}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-secondary">{a.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={a.status} variant={statusVariant(a.status)} />
                  <ActionBtn icon={<Edit2 className="size-3" />} label="Review" onClick={() => setReviewing(a)} />
                </div>
              </div>
              {a.reviewNotes && (
                <p className="mt-2 text-xs text-slate-600 italic">{a.reviewNotes}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">Applied {fmtDate(a.submittedAt)}</p>
            </article>
          ))}
        </div>
      )}
      {reviewing && (
        <ApplicationModal record={reviewing} onClose={() => setReviewing(null)} onSave={handleSave} />
      )}
    </div>
  )
}

// ── Complaints Tab ────────────────────────────────────────────────────────────

function ComplaintResponseModal({
  complaint,
  onClose,
  onSave,
}: {
  complaint: AdminComplaint
  onClose: () => void
  onSave: (id: string, data: Partial<AdminComplaint>) => Promise<void>
}) {
  const [status, setStatus] = useState(complaint.status)
  const [response, setResponse] = useState(complaint.adminResponse ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSaving(true)
    await onSave(complaint.id, { status, adminResponse: response })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Respond to Complaint" onClose={onClose}>
      <div className="mb-4 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-secondary">{complaint.category}</p>
        <p className="mt-1 font-semibold text-slate-900">{complaint.subject}</p>
        <p className="mt-2 text-sm text-slate-600">{complaint.description}</p>
        <p className="mt-2 text-xs text-slate-400">From: {complaint.studentName} · {fmtDate(complaint.createdAt)}</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <SelectInput
          label="Update Status"
          value={status}
          onChange={(v) => setStatus(v as AdminComplaint['status'])}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'closed', label: 'Closed' },
          ]}
        />
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Admin Response</span>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="Write your response to the student…"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Send Response'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ComplaintsTab({
  complaints,
  loading,
  onRefresh,
}: {
  complaints: AdminComplaint[]
  loading: boolean
  onRefresh: () => void
}) {
  const [filter, setFilter] = useState<AdminComplaint['status'] | 'all'>('all')
  const [responding, setResponding] = useState<AdminComplaint | null>(null)

  const filtered = complaints.filter((c) => filter === 'all' || c.status === filter)

  async function handleSave(id: string, data: Partial<AdminComplaint>) {
    await updateComplaint(id, data)
    onRefresh()
  }

  async function handleDelete(c: AdminComplaint) {
    if (!confirm(`Delete complaint "${c.subject}"?`)) return
    await deleteComplaint(c.id)
    onRefresh()
  }

  const statuses: (AdminComplaint['status'] | 'all')[] = ['all', 'open', 'in-progress', 'resolved', 'closed']

  return (
    <div className="grid gap-4">
      <SectionHeader
        eyebrow="Student"
        title="Complaints"
        action={<ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />}
      />
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === s ? 'bg-primary text-white' : 'border border-slate-200 text-slate-600'
            }`}
          >
            {s === 'all' ? `All (${complaints.length})` : s.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <EmptyState message="No complaints in this category." />
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <article key={c.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge value={c.priority} variant={c.priority === 'high' ? 'danger' : c.priority === 'medium' ? 'warn' : 'default'} />
                    <Badge value={c.status} variant={statusVariant(c.status)} />
                    <span className="text-xs text-slate-400 uppercase tracking-wide">{c.category}</span>
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{c.subject}</p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{c.description}</p>
                  <p className="mt-2 text-xs text-slate-400">From: {c.studentName} · {fmtDate(c.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <ActionBtn icon={<MessageSquare className="size-3" />} label="Respond" onClick={() => setResponding(c)} />
                  <ActionBtn icon={<Trash2 className="size-3" />} onClick={() => void handleDelete(c)} variant="danger" />
                </div>
              </div>
              {c.adminResponse && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                  <strong>Response:</strong> {c.adminResponse}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {responding && (
        <ComplaintResponseModal complaint={responding} onClose={() => setResponding(null)} onSave={handleSave} />
      )}
    </div>
  )
}

// ── Communication Tab ─────────────────────────────────────────────────────────

function CommunicationTab({
  notices,
  loading,
  onRefresh,
  adminName,
}: {
  notices: BroadcastNotice[]
  loading: boolean
  onRefresh: () => void
  adminName: string
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState<'all' | 'students' | 'faculty'>('all')
  const [pinned, setPinned] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [posting, setPosting] = useState(false)
  const [err, setErr] = useState('')

  async function handlePost(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setPosting(true)
    setErr('')
    try {
      await saveNotice(null, {
        title: title.trim(),
        content: content.trim(),
        targetAudience: audience,
        issuedBy: adminName,
        issuedAt: new Date().toISOString(),
        expiresAt: expiresAt || undefined,
        isPinned: pinned,
      })
      setTitle('')
      setContent('')
      setExpiresAt('')
      setPinned(false)
      onRefresh()
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Failed to post notice.')
    } finally {
      setPosting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this notice?')) return
    await deleteNotice(id)
    onRefresh()
  }

  async function togglePin(n: BroadcastNotice) {
    await saveNotice(n.id, { ...n, isPinned: !n.isPinned })
    onRefresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
      <div>
        <SectionHeader eyebrow="Broadcast" title="Post Notice" />
        <form onSubmit={handlePost} className="mt-4 grid gap-3">
          <FieldInput label="Title" value={title} onChange={setTitle} required />
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Content</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              placeholder="Write the notice content…"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <SelectInput
            label="Target Audience"
            value={audience}
            onChange={(v) => setAudience(v as typeof audience)}
            options={[
              { value: 'all', label: 'All (Students & Faculty)' },
              { value: 'students', label: 'Students Only' },
              { value: 'faculty', label: 'Faculty Only' },
            ]}
          />
          <FieldInput label="Expires On (optional)" value={expiresAt} onChange={setExpiresAt} type="date" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="rounded" />
            Pin this notice to top
          </label>
          {err && <p className="text-xs text-rose-600">{err}</p>}
          <button type="submit" disabled={posting} className="mt-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {posting ? 'Posting…' : 'Post Notice'}
          </button>
        </form>
      </div>

      <div>
        <SectionHeader
          eyebrow="Published"
          title="Notices"
          action={<ActionBtn icon={<RefreshCw className="size-3.5" />} onClick={onRefresh} />}
        />
        {loading ? (
          <LoadingRows rows={3} />
        ) : notices.length === 0 ? (
          <EmptyState message="No notices published yet." />
        ) : (
          <div className="mt-4 grid gap-3">
            {notices.map((n) => (
              <article key={n.id} className={`rounded-[1.5rem] border p-4 ${n.isPinned ? 'border-secondary/30 bg-secondary/5' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {n.isPinned && <Badge value="Pinned" variant="info" />}
                      <Badge value={n.targetAudience} variant="default" />
                    </div>
                    <p className="mt-1 font-semibold text-slate-900">{n.title}</p>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.content}</p>
                    <p className="mt-2 text-xs text-slate-400">{fmtDate(n.issuedAt)} by {n.issuedBy}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <ActionBtn
                      icon={<Bell className="size-3" />}
                      onClick={() => void togglePin(n)}
                    />
                    <ActionBtn icon={<Trash2 className="size-3" />} onClick={() => void handleDelete(n.id)} variant="danger" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { logout, user } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [faculty, setFaculty] = useState<AdminFaculty[]>([])
  const [allocations, setAllocations] = useState<AdminAllocation[]>([])
  const [attendance, setAttendance] = useState<AdminAttendanceRecord[]>([])
  const [marks, setMarks] = useState<AdminMarkRecord[]>([])
  const [fees, setFees] = useState<AdminFeeRecord[]>([])
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [complaints, setComplaints] = useState<AdminComplaint[]>([])
  const [notices, setNotices] = useState<BroadcastNotice[]>([])

  const [loading, setLoading] = useState<Partial<Record<Tab | 'stats', boolean>>>({ stats: true })
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    void loadTab(activeTab)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  async function loadTab(tab: Tab | 'overview') {
    setGlobalError('')
    try {
      if (tab === 'overview') {
        setLoading((l) => ({ ...l, stats: true }))
        const [s, stu, fac] = await Promise.all([
          fetchAdminStats(),
          fetchAllStudents(),
          fetchAllFaculty(),
        ])
        setStats(s)
        setStudents(stu)
        setFaculty(fac)
        setLoading((l) => ({ ...l, stats: false }))
        return
      }
      setLoading((l) => ({ ...l, [tab]: true }))
      switch (tab) {
        case 'students': {
          const data = await fetchAllStudents()
          setStudents(data)
          break
        }
        case 'faculty': {
          const data = await fetchAllFaculty()
          setFaculty(data)
          break
        }
        case 'courses': {
          const [a, f] = await Promise.all([fetchAllAllocations(), fetchAllFaculty()])
          setAllocations(a)
          setFaculty(f)
          break
        }
        case 'attendance': {
          const data = await fetchAllAttendance()
          setAttendance(data)
          break
        }
        case 'marks': {
          const [m, s] = await Promise.all([fetchAllMarks(), fetchAllStudents()])
          setMarks(m)
          setStudents(s)
          break
        }
        case 'fees': {
          const [f, s] = await Promise.all([fetchAllFees(), fetchAllStudents()])
          setFees(f)
          setStudents(s)
          break
        }
        case 'applications': {
          const data = await fetchAllApplications()
          setApplications(data)
          break
        }
        case 'complaints': {
          const data = await fetchAllComplaints()
          setComplaints(data)
          break
        }
        case 'communication': {
          const data = await fetchAllNotices()
          setNotices(data)
          break
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load data.'
      setGlobalError(msg)
    } finally {
      setLoading((l) => ({ ...l, [tab]: false, stats: false }))
    }
  }

  function refresh() {
    void loadTab(activeTab === 'overview' ? 'overview' : activeTab)
  }

  const isLoading = (tab: Tab | 'stats') => !!loading[tab]

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-[2rem] bg-primary px-6 py-5 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Admin Panel</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold">SSIBM Administration</h1>
            <p className="mt-1 text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{user?.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>

        {globalError && (
          <div className="mb-4 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {globalError}
          </div>
        )}

        {/* Mobile tab scroll */}
        <div className="mb-4 overflow-x-auto lg:hidden">
          <div className="flex gap-2 pb-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveTab(n.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${
                  activeTab === n.id
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <nav className="sticky top-6 grid gap-1 rounded-[2rem] border border-slate-200 bg-white p-3">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveTab(n.id)}
                  className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-left transition-colors ${
                    activeTab === n.id
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {n.icon}
                  {n.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1 rounded-[2rem] border border-slate-200 bg-white p-6 lg:p-8">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} loading={isLoading('stats')} />
            )}
            {activeTab === 'students' && (
              <StudentsTab students={students} loading={isLoading('students')} onRefresh={refresh} />
            )}
            {activeTab === 'faculty' && (
              <FacultyTab faculty={faculty} loading={isLoading('faculty')} onRefresh={refresh} />
            )}
            {activeTab === 'courses' && (
              <CoursesTab allocations={allocations} faculty={faculty} loading={isLoading('courses')} onRefresh={refresh} />
            )}
            {activeTab === 'attendance' && (
              <AttendanceTab attendance={attendance} loading={isLoading('attendance')} onRefresh={refresh} />
            )}
            {activeTab === 'marks' && (
              <MarksTab marks={marks} students={students} loading={isLoading('marks')} onRefresh={refresh} />
            )}
            {activeTab === 'fees' && (
              <FeesTab fees={fees} students={students} loading={isLoading('fees')} onRefresh={refresh} />
            )}
            {activeTab === 'applications' && (
              <ApplicationsTab applications={applications} loading={isLoading('applications')} onRefresh={refresh} />
            )}
            {activeTab === 'complaints' && (
              <ComplaintsTab complaints={complaints} loading={isLoading('complaints')} onRefresh={refresh} />
            )}
            {activeTab === 'communication' && (
              <CommunicationTab
                notices={notices}
                loading={isLoading('communication')}
                onRefresh={refresh}
                adminName={user?.name ?? 'Admin'}
              />
            )}
          </main>
        </div>
      </div>
    </section>
  )
}
