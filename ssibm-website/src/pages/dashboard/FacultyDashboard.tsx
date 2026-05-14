import {
  Bell,
  BookOpen,
  Briefcase,
  ClipboardList,
  FileBarChart2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  Users,
} from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {
  fetchFacultyDashboard,
  submitAttendanceMarking,
} from '../../services/dashboard'
import {
  createNotice,
  createQuizAssignment,
  fetchCourseStudents,
  fetchFacultyProfile,
  fetchLeaveBalance,
  fetchLeaveRequests,
  fetchPaySlips,
  fetchStudentMarkEntries,
  fetchSubjectAllocations,
  markAttendance as saveFacultyAttendance,
  notifyAbsentParents,
  saveMarkEntries,
  submitLeaveRequest as submitFacultyLeave,
  uploadStudyMaterial,
} from '../../services/faculty'
import type {
  FacultyProfile as FacultyProfileRecord,
  LeaveBalance,
  LeaveRequest,
  PaySlip,
} from '../../types/faculty'

type Tab =
  | 'overview'
  | 'attendance'
  | 'marks'
  | 'students'
  | 'academics'
  | 'utilities'
  | 'communication'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave'

type FacultyDashboardResponse = {
  success: boolean
  user: { id: string; role: 'faculty'; name: string; email: string }
  data: {
    assignedCourses: Array<{
      code: string
      name: string
      section: string
      time: string
      roster: Array<{
        studentUserId: string
        name: string
        rollNumber: string
        status: AttendanceStatus | null
      }>
    }>
    todaySummary: { sessions: number; students: number; attendancePending: number }
    notices: string[]
    activeDate: string
  }
}

type FacultyProfile = {
  employeeId: string
  designation: string
  department: string
  specialization: string
  officeHours: string
  mentorBatch: string
  workloadHours: number
  leaveBalance: number
  dutyLeaveBalance: number
  salaryMonth: string
  netPay: string
}

type MarksEntry = {
  studentUserId: string
  studentName: string
  rollNumber: string
  internal1: number
  internal2: number
  internal3: number
  assignment: number
  lab: number
  semester: number
}

type Complaint = {
  id: string
  studentName: string
  topic: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_review' | 'resolved'
}


const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'marks', label: 'Marks & Exams', icon: FileBarChart2 },
  { id: 'students', label: 'Student Mgmt', icon: Users },
  { id: 'academics', label: 'Academic Tools', icon: BookOpen },
  { id: 'utilities', label: 'Utilities', icon: Briefcase },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
]

const defaultFacultyProfile: FacultyProfile = {
  employeeId: 'SSIBM-FAC-014',
  designation: 'Assistant Professor',
  department: 'Computer Applications',
  specialization: 'Web Systems and Analytics',
  officeHours: '11:30 AM - 1:00 PM',
  mentorBatch: 'BCA Semester 4 - Section A',
  workloadHours: 24,
  leaveBalance: 8,
  dutyLeaveBalance: 3,
  salaryMonth: 'May 2026',
  netPay: 'Rs. 58,400',
}


const lateAttendanceRules = [
  'Late attendance is counted toward presence but flagged for review.',
  'Three late marks in a month trigger mentor counselling.',
  'Department office approves late-entry corrections before weekly lock.',
]



const fallbackCourseBlueprints = [
  {
    code: 'BCA301',
    name: 'Data Structures',
    section: 'A',
    sectionLabel: 'BCA - Semester 3 A',
    time: '9:00 AM',
  },
  {
    code: 'BCA303',
    name: 'Database Management Systems',
    section: 'A',
    sectionLabel: 'BCA - Semester 3 A',
    time: '11:00 AM',
  },
  {
    code: 'BCA305',
    name: 'Web Technologies',
    section: 'A',
    sectionLabel: 'BCA - Semester 3 A',
    time: '2:00 PM',
  },
] as const

function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function clampMarks(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function buildFallbackFacultyDashboard(userId: string): Promise<FacultyDashboardResponse['data']> {
  const today = new Date().toISOString().slice(0, 10)
  const allocations = await fetchSubjectAllocations(userId).catch(() => [])
  const sourceCourses =
    allocations.length > 0
      ? allocations.map((allocation, index) => ({
          code: allocation.courseCode,
          name: allocation.courseName,
          section: allocation.section,
          sectionLabel: `${allocation.course} - Semester ${allocation.semester} ${allocation.section}`,
          time: fallbackCourseBlueprints[index]?.time ?? '10:00 AM',
        }))
      : fallbackCourseBlueprints

  const assignedCourses = await Promise.all(
    sourceCourses.map(async (course) => {
      const students = await fetchCourseStudents(course.code, course.section).catch(() => [])
      return {
        code: course.code,
        name: course.name,
        section: course.sectionLabel,
        time: course.time,
        roster: students.map((student) => ({
          studentUserId: student.uid,
          name: student.name,
          rollNumber: student.rollNumber,
          status: null,
        })),
      }
    }),
  )

  const totalStudents = new Set(
    assignedCourses.flatMap((course) => course.roster.map((student) => student.studentUserId)),
  ).size

  return {
    assignedCourses,
    todaySummary: {
      sessions: assignedCourses.length,
      students: totalStudents,
      attendancePending: assignedCourses.filter((course) => course.roster.length > 0).length,
    },
    notices: [
      'Faculty dashboard is running in Firebase fallback mode.',
      'Start the backend server if you want API-driven attendance sync.',
      'Salary slip and leave balance are loading from Firestore.',
    ],
    activeDate: today,
  }
}

export function FacultyDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [dashboard, setDashboard] = useState<FacultyDashboardResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [facultyProfileRecord, setFacultyProfileRecord] = useState<FacultyProfileRecord | null>(null)
  const [facultyLeaveBalance, setFacultyLeaveBalance] = useState<LeaveBalance | null>(null)
  const [facultyPaySlips, setFacultyPaySlips] = useState<PaySlip[]>([])
  const [selectedCourseCode, setSelectedCourseCode] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, AttendanceStatus>>({})
  const [attendanceMessage, setAttendanceMessage] = useState('')
  const [attendanceBulkUpload, setAttendanceBulkUpload] = useState('BCA24-018,present\nBCA24-021,late')
  const [notifySms, setNotifySms] = useState(true)
  const [notifyCall, setNotifyCall] = useState(false)
  const [marksEntries, setMarksEntries] = useState<MarksEntry[]>([])
  const [studyMaterialTitle, setStudyMaterialTitle] = useState('Unit 4 Data Modelling Notes')
  const [studyMaterialLink, setStudyMaterialLink] = useState('https://classroom.google.com/')
  const [assignmentTitle, setAssignmentTitle] = useState('Dashboard usability audit')
  const [quizTitle, setQuizTitle] = useState('SQL Optimization Quiz')
  const [noticeText, setNoticeText] = useState('Tomorrow first hour class will start 15 minutes later.')
  const [parentMessage, setParentMessage] = useState('Your ward has shown strong improvement in attendance this week.')
  const [departmentAnnouncement, setDepartmentAnnouncement] = useState('Lab maintenance window is planned for Friday after 4:00 PM.')
  const [chatMessage, setChatMessage] = useState('Please upload internal marks by end of day.')
  const [emailSubject, setEmailSubject] = useState('Semester review update')
  const [emailBody, setEmailBody] = useState('Sharing the latest academic status and pending action items.')
  const [marksLoading, setMarksLoading] = useState(false)
  const [marksMessage, setMarksMessage] = useState('')
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('casual')
  const [leaveFrom, setLeaveFrom] = useState('')
  const [leaveTo, setLeaveTo] = useState('')
  const [leaveDays, setLeaveDays] = useState(1)
  const [leaveReason, setLeaveReason] = useState('')
  const [leaveSubmitting, setLeaveSubmitting] = useState(false)
  const [leaveMessage, setLeaveMessage] = useState('')
  const [noticeSending, setNoticeSending] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')

  useEffect(() => {
    void loadDashboard(true)
  }, [user?.id])

  useEffect(() => {
    if (!dashboard?.assignedCourses.length) return

    const initialCourse = selectedCourseCode || dashboard.assignedCourses[0]?.code
    const nextCourse = dashboard.assignedCourses.find((course) => course.code === initialCourse)
    if (!nextCourse) return

    setSelectedCourseCode(nextCourse.code)
    setSelectedDate(dashboard.activeDate)
    setAttendanceDraft(
      Object.fromEntries(
        nextCourse.roster.map((student) => [
          student.studentUserId,
          student.status ?? 'present',
        ]),
      ),
    )
  }, [dashboard, selectedCourseCode])

  useEffect(() => {
    if (!selectedCourseCode) return

    const course = dashboard?.assignedCourses.find((c) => c.code === selectedCourseCode)
    const rosterFromDashboard: MarksEntry[] = (course?.roster ?? []).map((student) => ({
      studentUserId: student.studentUserId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      internal1: 0,
      internal2: 0,
      internal3: 0,
      assignment: 0,
      lab: 0,
      semester: 0,
    }))

    if (rosterFromDashboard.length > 0) {
      setMarksEntries(rosterFromDashboard)
    }

    setMarksLoading(true)

    // Fetch both marks AND (if roster is empty) students in parallel
    const coursePrefix = selectedCourseCode.slice(0, 3)
    Promise.all([
      fetchStudentMarkEntries(selectedCourseCode),
      rosterFromDashboard.length === 0 ? fetchCourseStudents(coursePrefix, '') : Promise.resolve(null),
    ])
      .then(([markEntries, firestoreStudents]) => {
        // Build base roster — prefer dashboard roster, fall back to Firestore query
        const baseRoster: MarksEntry[] =
          rosterFromDashboard.length > 0
            ? rosterFromDashboard
            : (firestoreStudents ?? []).map((s) => ({
                studentUserId: s.uid,
                studentName: s.name,
                rollNumber: s.rollNumber,
                internal1: 0,
                internal2: 0,
                internal3: 0,
                assignment: 0,
                lab: 0,
                semester: 0,
              }))

        if (markEntries.length === 0 && baseRoster.length > 0) {
          setMarksEntries(baseRoster)
          return
        }

        if (markEntries.length === 0) return

        // Merge saved marks into base roster — names always come from roster
        const merged = baseRoster.map((entry) => {
          const saved = markEntries.find(
            (e) =>
              (e.rollNumber && e.rollNumber === entry.rollNumber) ||
              e.uid === entry.studentUserId,
          )
          if (!saved) return entry
          return {
            ...entry,
            internal1: saved.internal1 ?? 0,
            internal2: saved.internal2 ?? 0,
            internal3: saved.internal3 ?? 0,
            assignment: saved.assignment ?? 0,
            lab: saved.lab ?? 0,
            semester: 0,
          }
        })

        setMarksEntries(merged.length > 0 ? merged : baseRoster)
      })
      .catch(() => null)
      .finally(() => setMarksLoading(false))
  }, [selectedCourseCode, dashboard])

  const selectedCourse = dashboard?.assignedCourses.find((course) => course.code === selectedCourseCode) ?? null
  const latestPaySlip = facultyPaySlips[0] ?? null
  const facultyProfile = {
    ...defaultFacultyProfile,
    employeeId: facultyProfileRecord?.employeeId ?? defaultFacultyProfile.employeeId,
    designation: facultyProfileRecord?.designation ?? defaultFacultyProfile.designation,
    department: facultyProfileRecord?.department ?? defaultFacultyProfile.department,
    specialization: facultyProfileRecord?.specialization ?? defaultFacultyProfile.specialization,
    leaveBalance: facultyLeaveBalance?.casual ?? defaultFacultyProfile.leaveBalance,
    dutyLeaveBalance: facultyLeaveBalance?.duty ?? defaultFacultyProfile.dutyLeaveBalance,
    salaryMonth: latestPaySlip ? `${latestPaySlip.month} ${latestPaySlip.year}` : defaultFacultyProfile.salaryMonth,
    netPay: latestPaySlip ? `Rs. ${latestPaySlip.net.toLocaleString('en-IN')}` : defaultFacultyProfile.netPay,
  }

  const totalAssignedStudents = useMemo(() => {
    return dashboard?.assignedCourses.reduce((count, course) => count + course.roster.length, 0) ?? 0
  }, [dashboard])

  const attendancePercentage = useMemo(() => {
    if (!selectedCourse || !selectedCourse.roster.length) return 0
    const presentLike = selectedCourse.roster.filter(
      (student) => {
        const status = attendanceDraft[student.studentUserId] ?? student.status
        return status === 'present' || status === 'late'
      },
    ).length
    return Math.round((presentLike / selectedCourse.roster.length) * 100)
  }, [attendanceDraft, selectedCourse])

  const marksAnalytics = useMemo(() => {
    if (!marksEntries.length) {
      return { average: 0, topScore: 0, belowThreshold: 0 }
    }
    const totals = marksEntries.map((entry) => entry.internal1 + entry.internal2 + entry.internal3 + entry.assignment + entry.lab + entry.semester)
    const average = Math.round(totals.reduce((sum, value) => sum + value, 0) / totals.length)
    const topScore = Math.max(...totals)
    const belowThreshold = totals.filter((value) => value < 120).length
    return { average, topScore, belowThreshold }
  }, [marksEntries])

  const studentComplaints: Complaint[] = useMemo(
    () => [
      { id: 'complaint-1', studentName: 'Student User', topic: 'Attendance correction request', priority: 'high', status: 'open' },
      { id: 'complaint-2', studentName: 'Aishwarya R', topic: 'Assignment submission discrepancy', priority: 'medium', status: 'in_review' },
      { id: 'complaint-3', studentName: 'Rahul M', topic: 'Mentor callback requested', priority: 'low', status: 'resolved' },
    ],
    [],
  )


  async function loadDashboard(initialLoad = false) {
    if (initialLoad) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    setError('')
    setAttendanceMessage('')

    try {
      if (!user?.id) {
        throw new Error('Faculty profile not found.')
      }

      const [dashboardResult, profileResult, leaveBalanceResult, paySlipsResult, leaveRequestsResult] = await Promise.allSettled([
        fetchFacultyDashboard(),
        fetchFacultyProfile(user.id),
        fetchLeaveBalance(user.id),
        fetchPaySlips(user.id),
        fetchLeaveRequests(user.id),
      ])

      if (profileResult.status === 'fulfilled') {
        setFacultyProfileRecord(profileResult.value)
      }
      if (leaveBalanceResult.status === 'fulfilled') {
        setFacultyLeaveBalance(leaveBalanceResult.value)
      }
      if (paySlipsResult.status === 'fulfilled') {
        setFacultyPaySlips(paySlipsResult.value)
      }
      if (leaveRequestsResult.status === 'fulfilled') {
        setLeaveRequests(leaveRequestsResult.value)
      }

      if (dashboardResult.status === 'fulfilled') {
        const backendData = dashboardResult.value.data.data
        if (backendData.assignedCourses.length > 0) {
          setDashboard(backendData)
          return
        }
      }

      const fallbackDashboard = await buildFallbackFacultyDashboard(user.id)
      setDashboard(fallbackDashboard)
      if (dashboardResult.status === 'rejected') {
        setError('Backend server is not running, so the faculty dashboard is using Firebase fallback data.')
      }
    } catch {
      setError('Unable to load faculty data. Make sure Firebase is configured and the faculty account has been seeded.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  function updateAttendanceStatus(studentUserId: string, status: AttendanceStatus) {
    setAttendanceDraft((current) => ({ ...current, [studentUserId]: status }))
  }

  function applyBulkAttendance() {
    if (!selectedCourse) return

    const nextDraft = { ...attendanceDraft }
    const rollMap = new Map(
      selectedCourse.roster.map((student) => [student.rollNumber.toLowerCase(), student.studentUserId]),
    )

    attendanceBulkUpload
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [rollNumber, status] = line.split(',').map((part) => part.trim())
        const studentUserId = rollMap.get((rollNumber ?? '').toLowerCase())
        if (!studentUserId) return
        if (status === 'present' || status === 'absent' || status === 'late' || status === 'leave') {
          nextDraft[studentUserId] = status
        }
      })

    setAttendanceDraft(nextDraft)
    setAttendanceMessage('Bulk attendance entries were applied to the current draft.')
  }

  async function saveAttendance() {
    if (!selectedCourse || !selectedDate) return

    try {
      const entries = selectedCourse.roster.map((student) => ({
        studentUserId: student.studentUserId,
        status: attendanceDraft[student.studentUserId] ?? 'present',
      }))

      const absentUids = entries
        .filter((e) => e.status === 'absent')
        .map((e) => e.studentUserId)

      try {
        const response = await submitAttendanceMarking({
          facultyUid: user?.id ?? '',
          courseCode: selectedCourse.code,
          date: selectedDate,
          entries,
        })
        setAttendanceMessage(`Attendance saved for ${response.data.updatedCount} students.`)
      } catch {
        await saveFacultyAttendance({
          facultyUid: user?.id ?? '',
          courseCode: selectedCourse.code,
          courseName: selectedCourse.name,
          section: selectedCourse.section,
          date: selectedDate,
          entries: entries.map((entry) => ({
            studentUid: entry.studentUserId,
            status: entry.status,
          })),
        })
      }

      const notifyType = notifySms && notifyCall ? 'both' : notifyCall ? 'call' : notifySms ? 'sms' : null

      let notified = 0
      if (notifyType) {
        notified = await notifyAbsentParents(
          user?.id ?? '',
          selectedCourse.code,
          selectedCourse.name,
          selectedDate,
          absentUids,
          notifyType,
        )
      }

      const notifyLabel = notifyType === 'both' ? 'SMS + call' : notifyType === 'call' ? 'call' : 'SMS'
      setAttendanceMessage(
        notified > 0
          ? `Attendance saved. Parent ${notifyLabel} sent for ${notified} absent student${notified !== 1 ? 's' : ''}.`
          : 'Attendance saved.',
      )

      await loadDashboard()
    } catch {
      setAttendanceMessage('Attendance could not be saved. Please verify Firebase access for this faculty account.')
    }
  }

  function exportAttendanceReport() {
    if (!selectedCourse) return
    downloadCsv(
      `${selectedCourse.code}-attendance-${selectedDate}.csv`,
      ['Roll Number', 'Student Name', 'Status', 'Date', 'Course'],
      selectedCourse.roster.map((student) => [
        student.rollNumber,
        student.name,
        attendanceDraft[student.studentUserId] ?? student.status ?? 'pending',
        selectedDate,
        selectedCourse.code,
      ]),
    )
    setAttendanceMessage('Attendance report exported as CSV.')
  }

  function updateMarksField(studentUserId: string, key: 'internal1' | 'internal2' | 'internal3' | 'assignment' | 'lab' | 'semester', value: string) {
    setMarksEntries((current) =>
      current.map((entry) =>
        entry.studentUserId === studentUserId
          ? { ...entry, [key]: clampMarks(Number(value)) }
          : entry,
      ),
    )
  }

  function exportMarksReport(label: 'pdf' | 'excel') {
    downloadCsv(
      `${selectedCourseCode || 'faculty'}-marks-${label}.csv`,
      ['Roll Number', 'Student Name', 'Internal 1', 'Internal 2', 'Internal 3', 'Assignment', 'Lab', 'Semester'],
      marksEntries.map((entry) => [
        entry.rollNumber,
        entry.studentName,
        entry.internal1,
        entry.internal2,
        entry.internal3,
        entry.assignment,
        entry.lab,
        entry.semester,
      ]),
    )
  }

  async function saveMarks() {
    if (!selectedCourseCode || !user?.id || !marksEntries.length) return
    setMarksLoading(true)
    setMarksMessage('')
    try {
      await saveMarkEntries(
        selectedCourseCode,
        user.id,
        marksEntries.map((e) => ({
          uid: e.studentUserId,
          name: e.studentName,
          rollNumber: e.rollNumber,
          internal1: e.internal1,
          internal2: e.internal2,
          internal3: e.internal3,
          assignment: e.assignment,
          lab: e.lab,
          maxInternal: 25,
          maxAssignment: 25,
          maxLab: 25,
        })),
      )
      setMarksMessage('Marks saved successfully.')
    } catch {
      setMarksMessage('Failed to save marks. Please try again.')
    } finally {
      setMarksLoading(false)
    }
  }

  async function sendStudentNotice() {
    if (!user?.id || !noticeText.trim()) return
    setNoticeSending(true)
    setNoticeMessage('')
    try {
      await createNotice(user.id, user?.name ?? 'Faculty', {
        title: noticeText.slice(0, 80),
        content: noticeText,
        targetAudience: 'students',
        targetCourse: selectedCourseCode || undefined,
      })
      setNoticeMessage('Notice posted to students.')
      setNoticeText('')
    } catch {
      setNoticeMessage('Failed to post notice.')
    } finally {
      setNoticeSending(false)
    }
  }

  async function saveMaterial() {
    if (!user?.id || !studyMaterialTitle.trim()) return
    try {
      await uploadStudyMaterial(user.id, {
        courseCode: selectedCourseCode || 'general',
        courseName: selectedCourse?.name ?? 'General',
        title: studyMaterialTitle,
        type: 'link',
        url: studyMaterialLink,
        description: '',
      })
      setStudyMaterialTitle('')
      setStudyMaterialLink('')
    } catch {
      // ignore — non-critical
    }
  }

  async function saveQuiz() {
    if (!user?.id || !quizTitle.trim()) return
    try {
      await createQuizAssignment(user.id, {
        title: quizTitle,
        courseCode: selectedCourseCode || 'general',
        courseName: selectedCourse?.name ?? 'General',
        description: '',
        type: 'quiz',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        totalMarks: 25,
        totalStudents: selectedCourse?.roster.length ?? 0,
      })
      setQuizTitle('')
    } catch {
      // ignore — non-critical
    }
  }

  async function submitLeaveForm() {
    if (!user?.id || !leaveFrom || !leaveTo || !leaveReason.trim()) return
    setLeaveSubmitting(true)
    setLeaveMessage('')
    try {
      await submitFacultyLeave(user.id, {
        type: leaveType,
        from: leaveFrom,
        to: leaveTo,
        days: leaveDays,
        reason: leaveReason,
      })
      setLeaveMessage('Leave request submitted successfully.')
      const updated = await fetchLeaveRequests(user.id)
      setLeaveRequests(updated)
      setLeaveFrom('')
      setLeaveTo('')
      setLeaveReason('')
      setLeaveDays(1)
    } catch {
      setLeaveMessage('Failed to submit leave request.')
    } finally {
      setLeaveSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-[1.5rem] bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">SSIBM Faculty Management</p>
              <p className="text-xs text-slate-500">Academic operations dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{facultyProfile.department}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
          <aside className="hidden w-64 shrink-0 lg:block">
            <nav className="sticky top-24 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </aside>

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
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
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

          <main className="min-w-0 flex-1">
            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            {activeTab === 'overview' && dashboard && (
              <OverviewTab
                dashboard={dashboard}
                facultyProfile={facultyProfile}
                totalAssignedStudents={totalAssignedStudents}
              />
            )}
            {activeTab === 'attendance' && dashboard && selectedCourse && (
              <AttendanceTab
                attendanceBulkUpload={attendanceBulkUpload}
                attendanceDraft={attendanceDraft}
                attendanceMessage={attendanceMessage}
                attendancePercentage={attendancePercentage}
                courses={dashboard.assignedCourses}
                notifyCall={notifyCall}
                notifySms={notifySms}
                onApplyBulkAttendance={applyBulkAttendance}
                onBulkUploadChange={setAttendanceBulkUpload}
                onCourseChange={setSelectedCourseCode}
                onDateChange={setSelectedDate}
                onExport={exportAttendanceReport}
                onNotifyCallChange={setNotifyCall}
                onNotifySmsChange={setNotifySms}
                onSave={saveAttendance}
                onStatusChange={updateAttendanceStatus}
                selectedCourse={selectedCourse}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'marks' && selectedCourse && (
              <MarksTab
                courses={dashboard?.assignedCourses ?? []}
                marksAnalytics={marksAnalytics}
                marksEntries={marksEntries}
                marksLoading={marksLoading}
                marksMessage={marksMessage}
                onCourseChange={setSelectedCourseCode}
                onExport={exportMarksReport}
                onMarksChange={updateMarksField}
                onSave={saveMarks}
                selectedCourseCode={selectedCourseCode}
              />
            )}
            {activeTab === 'students' && selectedCourse && (
              <StudentsTab
                complaints={studentComplaints}
                mentorBatch={facultyProfile.mentorBatch}
                selectedCourse={selectedCourse}
              />
            )}
            {activeTab === 'academics' && (
              <AcademicsTab
                assignmentTitle={assignmentTitle}
                onAssignmentTitleChange={setAssignmentTitle}
                onQuizTitleChange={setQuizTitle}
                onSaveMaterial={saveMaterial}
                onSaveQuiz={saveQuiz}
                onStudyMaterialLinkChange={setStudyMaterialLink}
                onStudyMaterialTitleChange={setStudyMaterialTitle}
                quizTitle={quizTitle}
                studyMaterialLink={studyMaterialLink}
                studyMaterialTitle={studyMaterialTitle}
              />
            )}
            {activeTab === 'utilities' && (
              <UtilitiesTab
                facultyProfile={facultyProfile}
                leaveRequests={leaveRequests}
                leaveType={leaveType}
                leaveFrom={leaveFrom}
                leaveTo={leaveTo}
                leaveDays={leaveDays}
                leaveReason={leaveReason}
                leaveSubmitting={leaveSubmitting}
                leaveMessage={leaveMessage}
                onLeaveTypeChange={setLeaveType}
                onLeaveFromChange={setLeaveFrom}
                onLeaveToChange={setLeaveTo}
                onLeaveDaysChange={setLeaveDays}
                onLeaveReasonChange={setLeaveReason}
                onSubmitLeave={submitLeaveForm}
              />
            )}
            {activeTab === 'communication' && (
              <CommunicationTab
                chatMessage={chatMessage}
                departmentAnnouncement={departmentAnnouncement}
                emailBody={emailBody}
                emailSubject={emailSubject}
                noticeMessage={noticeMessage}
                noticeSending={noticeSending}
                noticeText={noticeText}
                onChatMessageChange={setChatMessage}
                onDepartmentAnnouncementChange={setDepartmentAnnouncement}
                onEmailBodyChange={setEmailBody}
                onEmailSubjectChange={setEmailSubject}
                onNoticeTextChange={setNoticeText}
                onParentMessageChange={setParentMessage}
                onSendNotice={sendStudentNotice}
                parentMessage={parentMessage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function OverviewTab({
  dashboard,
  facultyProfile,
  totalAssignedStudents,
}: {
  dashboard: FacultyDashboardResponse['data']
  facultyProfile: FacultyProfile
  totalAssignedStudents: number
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Faculty Dashboard" title="Faculty management after login" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sessions Today" value={dashboard.todaySummary.sessions} detail="Scheduled lectures and labs" />
        <MetricCard label="Students Mapped" value={totalAssignedStudents} detail="Across all subject allocations" />
        <MetricCard label="Attendance Pending" value={dashboard.todaySummary.attendancePending} detail="Classes waiting for submission" />
        <MetricCard label="Workload Hours" value={facultyProfile.workloadHours} detail="This week's teaching allocation" />
      </div>

      <Card>
        <SectionTitle eyebrow="Faculty Profile" title="Profile and department information" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoRow label="Employee ID" value={facultyProfile.employeeId} />
          <InfoRow label="Designation" value={facultyProfile.designation} />
          <InfoRow label="Department" value={facultyProfile.department} />
          <InfoRow label="Specialization" value={facultyProfile.specialization} />
          <InfoRow label="Mentor Batch" value={facultyProfile.mentorBatch} />
          <InfoRow label="Office Hours" value={facultyProfile.officeHours} />
        </div>
      </Card>
    </div>
  )
}

function AttendanceTab({
  attendanceBulkUpload,
  attendanceDraft,
  attendanceMessage,
  attendancePercentage,
  courses,
  notifyCall,
  notifySms,
  onApplyBulkAttendance,
  onBulkUploadChange,
  onCourseChange,
  onDateChange,
  onExport,
  onNotifyCallChange,
  onNotifySmsChange,
  onSave,
  onStatusChange,
  selectedCourse,
  selectedDate,
}: {
  attendanceBulkUpload: string
  attendanceDraft: Record<string, AttendanceStatus>
  attendanceMessage: string
  attendancePercentage: number
  courses: FacultyDashboardResponse['data']['assignedCourses']
  notifyCall: boolean
  notifySms: boolean
  onApplyBulkAttendance: () => void
  onBulkUploadChange: (value: string) => void
  onCourseChange: (value: string) => void
  onDateChange: (value: string) => void
  onExport: () => void
  onNotifyCallChange: (v: boolean) => void
  onNotifySmsChange: (v: boolean) => void
  onSave: () => void
  onStatusChange: (studentUserId: string, status: AttendanceStatus) => void
  selectedCourse: FacultyDashboardResponse['data']['assignedCourses'][number]
  selectedDate: string
}) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle eyebrow="Attendance Management" title="Mark, edit, upload, and export attendance" />
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCourse.code}
            onChange={(event) => onCourseChange(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
          >
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Class Strength" value={selectedCourse.roster.length} detail="Students in this roster" />
        <MetricCard label="Attendance %" value={`${attendancePercentage}%`} detail="Present and late counted as attended" />
        <MetricCard label="Late Marks" value={selectedCourse.roster.filter((student) => (attendanceDraft[student.studentUserId] ?? student.status) === 'late').length} detail="Tracked for review" />
        <MetricCard label="Exports Ready" value="CSV" detail="Use export for reports and audit" />
      </div>

      {attendanceMessage ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {attendanceMessage}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <SectionTitle eyebrow="Live Register" title="Mark attendance and edit individual status" />
          <div className="grid gap-3">
            {selectedCourse.roster.map((student) => (
              <div key={student.studentUserId} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.rollNumber}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['present', 'absent', 'late', 'leave'] as AttendanceStatus[]).map((status) => {
                      const active = (attendanceDraft[student.studentUserId] ?? student.status ?? 'present') === status
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => onStatusChange(student.studentUserId, status)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            active
                              ? statusClasses(status)
                              : 'border border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {toTitleCase(status)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Notify parents of absent students
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => onNotifySmsChange(e.target.checked)}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-semibold text-slate-700">SMS to parent</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyCall}
                  onChange={(e) => onNotifyCallChange(e.target.checked)}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-semibold text-slate-700">Voice call to parent</span>
              </label>
              {!notifySms && !notifyCall && (
                <span className="text-xs text-slate-400">No notification will be sent</span>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSave}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white"
            >
              Save attendance
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Export attendance reports
            </button>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <SectionTitle eyebrow="Bulk Upload" title="Paste bulk attendance entries" />
            <textarea
              value={attendanceBulkUpload}
              onChange={(event) => onBulkUploadChange(event.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary"
            />
            <p className="mt-3 text-xs text-slate-500">
              Use one line per student: roll-number,status
            </p>
            <button
              type="button"
              onClick={onApplyBulkAttendance}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
            >
              Apply bulk attendance upload
            </button>
          </Card>

          <Card>
            <SectionTitle eyebrow="Late Policy" title="Late attendance marking rules" />
            <div className="grid gap-3">
              {lateAttendanceRules.map((rule) => (
                <div key={rule} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  {rule}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MarksTab({
  courses,
  marksAnalytics,
  marksEntries,
  marksLoading,
  marksMessage,
  onCourseChange,
  onExport,
  onMarksChange,
  onSave,
  selectedCourseCode,
}: {
  courses: FacultyDashboardResponse['data']['assignedCourses']
  marksAnalytics: { average: number; topScore: number; belowThreshold: number }
  marksEntries: MarksEntry[]
  marksLoading: boolean
  marksMessage: string
  onCourseChange: (value: string) => void
  onExport: (label: 'pdf' | 'excel') => void
  onMarksChange: (
    studentUserId: string,
    key: 'internal1' | 'internal2' | 'internal3' | 'assignment' | 'lab' | 'semester',
    value: string,
  ) => void
  onSave: () => void
  selectedCourseCode: string
}) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle eyebrow="Marks & Examination Module" title="Upload marks, track analytics, and manage review requests" />
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCourseCode}
            onChange={(event) => onCourseChange(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
          >
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onExport('pdf')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Export marks PDF
          </button>
          <button
            type="button"
            onClick={() => onExport('excel')}
            className="rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            Export marks Excel
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Average Score" value={marksAnalytics.average} detail="Combined performance index" />
        <MetricCard label="Top Score" value={marksAnalytics.topScore} detail="Best combined marks record" />
        <MetricCard label="Needs Support" value={marksAnalytics.belowThreshold} detail="Students below threshold" />
        <MetricCard label="Re-Eval Requests" value={2} detail="Pending faculty review" />
      </div>

      <Card>
        <SectionTitle eyebrow="Marks Entry" title="Internal, assignment, lab, and semester upload" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-semibold">Student</th>
                <th className="px-3 py-3 font-semibold">Int 1</th>
                <th className="px-3 py-3 font-semibold">Int 2</th>
                <th className="px-3 py-3 font-semibold">Int 3</th>
                <th className="px-3 py-3 font-semibold">Assignment</th>
                <th className="px-3 py-3 font-semibold">Lab</th>
                <th className="px-3 py-3 font-semibold">Semester</th>
                <th className="px-3 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {marksEntries.map((entry) => {
                const total = entry.internal1 + entry.internal2 + entry.internal3 + entry.assignment + entry.lab + entry.semester
                return (
                  <tr key={entry.studentUserId} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900">{entry.studentName}</p>
                      <p className="text-xs text-slate-500">{entry.rollNumber}</p>
                    </td>
                    {(['internal1', 'internal2', 'internal3', 'assignment', 'lab', 'semester'] as const).map((field) => (
                      <td key={field} className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={entry[field]}
                          onChange={(event) => onMarksChange(entry.studentUserId, field, event.target.value)}
                          className="w-20 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-3 font-bold text-slate-900">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {marksMessage ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${marksMessage.includes('Failed') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {marksMessage}
          </div>
        ) : null}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={marksLoading}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {marksLoading ? 'Saving…' : 'Save marks'}
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Performance Analytics" title="Student performance analytics" />
        <div className="grid gap-3">
          {marksEntries.map((entry) => {
            const total = entry.internal1 + entry.internal2 + entry.internal3 + entry.assignment + entry.lab
            const percentage = Math.round((total / 75) * 100)
            return (
              <div key={`analytics-${entry.studentUserId}`} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{entry.studentName}</p>
                    <p className="text-sm text-slate-500">{entry.rollNumber}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${percentage >= 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function StudentsTab({
  complaints,
  mentorBatch,
  selectedCourse,
}: {
  complaints: Complaint[]
  mentorBatch: string
  selectedCourse: FacultyDashboardResponse['data']['assignedCourses'][number]
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Student Management" title="Profiles, mentoring, complaints, and academic tracking" />

      <div className="grid gap-5 xl:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <SectionTitle eyebrow="Student Profiles" title="Student profile view and reports" />
          <div className="grid gap-3">
            {selectedCourse.roster.map((student, index) => (
              <div key={student.studentUserId} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.rollNumber}</p>
                    <p className="mt-2 text-sm text-slate-600">Mentor group: Batch {index + 1}</p>
                  </div>
                  <div className="grid gap-2 text-sm text-slate-600">
                    <span>Attendance tracking: {(index + 8) * 10 > 100 ? 96 : (index + 8) * 10}%</span>
                    <span>Academic progress: {(index + 7) * 9}% syllabus outcomes achieved</span>
                    <span>Parent touchpoint: Last updated this week</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <SectionTitle eyebrow="Mentorship" title="Mentor and mentee management" />
            <div className="grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Mentor batch: {mentorBatch}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Weekly one-on-one slots: Tuesday and Thursday during office hours
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                Student reports: 4 flagged for academic follow-up
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Complaint Desk" title="Student complaint handling" />
            <div className="grid gap-3">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{complaint.studentName}</p>
                      <p className="text-sm text-slate-500">{complaint.topic}</p>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass(complaint.priority)}`}>
                        {toTitleCase(complaint.priority)}
                      </span>
                      <p className="mt-2 text-xs text-slate-500">{toTitleCase(complaint.status)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AcademicsTab({
  assignmentTitle,
  onAssignmentTitleChange,
  onQuizTitleChange,
  onSaveMaterial,
  onSaveQuiz,
  onStudyMaterialLinkChange,
  onStudyMaterialTitleChange,
  quizTitle,
  studyMaterialLink,
  studyMaterialTitle,
}: {
  assignmentTitle: string
  onAssignmentTitleChange: (value: string) => void
  onQuizTitleChange: (value: string) => void
  onSaveMaterial: () => void
  onSaveQuiz: () => void
  onStudyMaterialLinkChange: (value: string) => void
  onStudyMaterialTitleChange: (value: string) => void
  quizTitle: string
  studyMaterialLink: string
  studyMaterialTitle: string
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Academic Features" title="Materials, assignments, quizzes, links, and progress tracking" />

      <Card>
        <SectionTitle eyebrow="Content Upload" title="Upload study materials and assignments" />
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Study Material Title" value={studyMaterialTitle} onChange={onStudyMaterialTitleChange} />
          <InputField label="Resource Link" value={studyMaterialLink} onChange={onStudyMaterialLinkChange} />
          <InputField label="Assignment Title" value={assignmentTitle} onChange={onAssignmentTitleChange} />
          <InputField label="Quiz/Test Title" value={quizTitle} onChange={onQuizTitleChange} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={onSaveMaterial} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">
            Upload material
          </button>
          <button type="button" onClick={onSaveQuiz} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
            Create quiz
          </button>
        </div>
      </Card>
    </div>
  )
}

function UtilitiesTab({
  facultyProfile,
  leaveRequests,
  leaveType,
  leaveFrom,
  leaveTo,
  leaveDays,
  leaveReason,
  leaveSubmitting,
  leaveMessage,
  onLeaveTypeChange,
  onLeaveFromChange,
  onLeaveToChange,
  onLeaveDaysChange,
  onLeaveReasonChange,
  onSubmitLeave,
}: {
  facultyProfile: FacultyProfile
  leaveRequests: LeaveRequest[]
  leaveType: LeaveRequest['type']
  leaveFrom: string
  leaveTo: string
  leaveDays: number
  leaveReason: string
  leaveSubmitting: boolean
  leaveMessage: string
  onLeaveTypeChange: (v: LeaveRequest['type']) => void
  onLeaveFromChange: (v: string) => void
  onLeaveToChange: (v: string) => void
  onLeaveDaysChange: (v: number) => void
  onLeaveReasonChange: (v: string) => void
  onSubmitLeave: () => void
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Faculty Utilities" title="Leave, payroll, workload, announcements, and events" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Leave Balance" value={facultyProfile.leaveBalance} detail="Casual leave days available" />
        <MetricCard label="Duty Leave" value={facultyProfile.dutyLeaveBalance} detail="Approved duty leave balance" />
        <MetricCard label="Salary Slip" value={facultyProfile.salaryMonth} detail={facultyProfile.netPay} />
        <MetricCard label="Workload" value={`${facultyProfile.workloadHours} hrs`} detail="Weekly teaching allocation" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <Card>
          <SectionTitle eyebrow="Leave Desk" title="Apply for leave" />
          <div className="grid gap-3">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Leave Type</span>
              <select
                value={leaveType}
                onChange={(e) => onLeaveTypeChange(e.target.value as LeaveRequest['type'])}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary"
              >
                <option value="casual">Casual Leave</option>
                <option value="medical">Medical Leave</option>
                <option value="duty">Duty Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">From</span>
                <input type="date" value={leaveFrom} onChange={(e) => onLeaveFromChange(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">To</span>
                <input type="date" value={leaveTo} onChange={(e) => onLeaveToChange(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary" />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Days</span>
              <input type="number" min={1} value={leaveDays} onChange={(e) => onLeaveDaysChange(Number(e.target.value))} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Reason</span>
              <textarea rows={3} value={leaveReason} onChange={(e) => onLeaveReasonChange(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary" />
            </label>
            {leaveMessage ? (
              <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${leaveMessage.includes('Failed') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {leaveMessage}
              </div>
            ) : null}
            <button type="button" onClick={onSubmitLeave} disabled={leaveSubmitting} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {leaveSubmitting ? 'Submitting…' : 'Submit leave request'}
            </button>
          </div>
          {leaveRequests.length > 0 && (
            <div className="mt-5 grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Your requests</p>
              {leaveRequests.map((req) => (
                <div key={req.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 capitalize">{req.type} Leave</p>
                      <p className="text-sm text-slate-500">{req.from} → {req.to} · {req.days} day{req.days !== 1 ? 's' : ''}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  )
}

function CommunicationTab({
  chatMessage,
  departmentAnnouncement,
  emailBody,
  emailSubject,
  noticeMessage,
  noticeSending,
  noticeText,
  onChatMessageChange,
  onDepartmentAnnouncementChange,
  onEmailBodyChange,
  onEmailSubjectChange,
  onNoticeTextChange,
  onParentMessageChange,
  onSendNotice,
  parentMessage,
}: {
  chatMessage: string
  departmentAnnouncement: string
  emailBody: string
  emailSubject: string
  noticeMessage: string
  noticeSending: boolean
  noticeText: string
  onChatMessageChange: (value: string) => void
  onDepartmentAnnouncementChange: (value: string) => void
  onEmailBodyChange: (value: string) => void
  onEmailSubjectChange: (value: string) => void
  onNoticeTextChange: (value: string) => void
  onParentMessageChange: (value: string) => void
  onSendNotice: () => void
  parentMessage: string
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle eyebrow="Communication Features" title="Notices, parent communication, announcements, chat, and email" />

      <div className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <Card>
          <SectionTitle eyebrow="Broadcasts" title="Send notices and parent communication" />
          <div className="grid gap-4">
            <TextAreaField label="Send notices to students" value={noticeText} onChange={onNoticeTextChange} rows={3} />
            <TextAreaField label="Parent communication" value={parentMessage} onChange={onParentMessageChange} rows={3} />
            <TextAreaField label="Department announcements" value={departmentAnnouncement} onChange={onDepartmentAnnouncementChange} rows={3} />
            {noticeMessage ? (
              <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${noticeMessage.includes('Failed') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {noticeMessage}
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-3">
              <ActionButton icon={Send} label={noticeSending ? 'Sending…' : 'Send student notice'} onClick={onSendNotice} disabled={noticeSending} />
              <ActionButton icon={Users} label="Notify parents" />
              <ActionButton icon={Bell} label="Post department alert" />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Messaging" title="Internal messaging and email integration" />
          <div className="grid gap-4">
            <TextAreaField label="Internal messaging/chat" value={chatMessage} onChange={onChatMessageChange} rows={3} />
            <InputField label="Email Subject" value={emailSubject} onChange={onEmailSubjectChange} />
            <TextAreaField label="Email Body" value={emailBody} onChange={onEmailBodyChange} rows={5} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ActionButton icon={MessageSquare} label="Send internal chat" />
              <ActionButton icon={Mail} label="Send email draft" />
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{title}</h2>
    </div>
  )
}

function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary"
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary"
      />
    </label>
  )
}


function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ElementType
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
    >
      <Icon className="size-4" />
      {label}
    </button>
  )
}

function statusClasses(status: AttendanceStatus) {
  if (status === 'present') return 'bg-emerald-100 text-emerald-700'
  if (status === 'absent') return 'bg-rose-100 text-rose-700'
  if (status === 'late') return 'bg-amber-100 text-amber-700'
  return 'bg-slate-200 text-slate-700'
}

function priorityClass(priority: Complaint['priority']) {
  if (priority === 'high') return 'bg-rose-100 text-rose-700'
  if (priority === 'medium') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}
