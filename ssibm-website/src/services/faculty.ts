import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { api } from './api'
import type {
  AttendanceEntry,
  AttendanceSession,
  ClassStudent,
  FacultyNotification,
  FacultyProfile,
  FacultyTimetableSlot,
  LeaveBalance,
  LeaveRequest,
  MenteeStudent,
  Message,
  Notice,
  PaySlip,
  QuizAssignment,
  ReEvaluationRequest,
  StudentMarkEntry,
  StudyUpload,
  SubjectAllocation,
} from '../types/faculty'

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchFacultyProfile(uid: string): Promise<FacultyProfile> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('Profile not found.')
  return { uid, ...(snap.data() as Omit<FacultyProfile, 'uid'>) }
}

export async function updateFacultyProfile(
  uid: string,
  data: Partial<Omit<FacultyProfile, 'uid' | 'email'>>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>)
}

// ─── Subject allocations ──────────────────────────────────────────────────────

export async function fetchSubjectAllocations(uid: string): Promise<SubjectAllocation[]> {
  // Admin saves with 'facultyId'; legacy data may use 'facultyUid' — query both
  const [byId, byUid] = await Promise.all([
    getDocs(query(collection(db, 'subjectAllocations'), where('facultyId', '==', uid))),
    getDocs(query(collection(db, 'subjectAllocations'), where('facultyUid', '==', uid))),
  ])
  const seen = new Set<string>()
  const docs = [...byId.docs, ...byUid.docs].filter((d) => {
    if (seen.has(d.id)) return false
    seen.add(d.id)
    return true
  })
  return docs.map((d) => {
    const r = d.data()
    return {
      id: d.id,
      courseCode: (r.subjectCode ?? r.courseCode ?? '') as string,
      courseName: (r.subject ?? r.courseName ?? '') as string,
      course: (r.department ?? r.course ?? '') as string,
      semester: String(r.semester ?? ''),
      section: (r.section ?? '') as string,
      totalStudents: Number(r.totalStudents ?? 0),
    }
  })
}

// ─── Timetable ────────────────────────────────────────────────────────────────

export async function fetchFacultyTimetable(uid: string): Promise<FacultyTimetableSlot[]> {
  const q = query(collection(db, 'timetable'), where('facultyUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyTimetableSlot, 'id'>) }))
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export async function fetchCourseStudents(
  courseCode: string,
  section: string,
  department?: string,
  semester?: number,
): Promise<ClassStudent[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'))
  const snap = await getDocs(q)
  // Use explicit department if provided, otherwise derive from first 3 chars of courseCode
  const deptKey = (department || courseCode.slice(0, 3)).toLowerCase()
  return snap.docs
    .filter((d) => {
      const data = d.data()
      // Admin saves 'department'; legacy data may use 'course'
      const studentDept = ((data.department ?? data.course ?? '') as string).toLowerCase()
      const deptMatch = studentDept === deptKey
      const sectionMatch = section === '' || data.section === section
      const semesterMatch = semester === undefined || Number(data.semester) === semester
      return deptMatch && sectionMatch && semesterMatch
    })
    .map((d) => ({
      uid: d.id,
      name: d.data().name as string,
      rollNumber: d.data().rollNumber as string,
      status: null,
    }))
}

export async function markAttendance(payload: {
  facultyUid: string
  courseCode: string
  courseName: string
  section: string
  date: string
  entries: AttendanceEntry[]
}): Promise<void> {
  const batch = writeBatch(db)
  for (const entry of payload.entries) {
    batch.set(doc(collection(db, 'attendance')), {
      studentUid: entry.studentUid,
      courseCode: payload.courseCode,
      courseName: payload.courseName,
      date: payload.date,
      status: entry.status,
      markedBy: payload.facultyUid,
      markedAt: new Date().toISOString(),
    })
  }
  await batch.commit()

  await addDoc(collection(db, 'attendanceSessions'), {
    courseCode: payload.courseCode,
    courseName: payload.courseName,
    section: payload.section,
    date: payload.date,
    totalStudents: payload.entries.length,
    presentCount: payload.entries.filter((e) => e.status === 'present' || e.status === 'late').length,
    absentCount: payload.entries.filter((e) => e.status === 'absent').length,
    markedBy: payload.facultyUid,
    markedAt: new Date().toISOString(),
  })
}

export async function notifyAbsentParentsViaFirestore(
  facultyUid: string,
  courseCode: string,
  courseName: string,
  date: string,
  absentUids: string[],
  notifyType: 'sms' | 'call' | 'both' = 'sms',
): Promise<number> {
  if (absentUids.length === 0) return 0
  const batch = writeBatch(db)
  let count = 0
  for (const uid of absentUids) {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (!userSnap.exists()) continue
    const data = userSnap.data()
    const parentPhone = data.parentPhone as string | undefined
    if (!parentPhone) continue
    const studentName = data.name as string
    const rollNumber = (data.rollNumber ?? '') as string
    batch.set(doc(collection(db, 'parentNotifications')), {
      studentUid: uid,
      studentName,
      rollNumber,
      parentPhone,
      courseCode,
      courseName,
      date,
      notifyType,
      message: `Dear Parent, your ward ${studentName} (${rollNumber}) was absent for ${courseName} on ${date}. Please ensure regular attendance. — SSIBM`,
      sentAt: new Date().toISOString(),
      markedBy: facultyUid,
    })
    count++
  }
  await batch.commit()
  return count
}

export async function notifyAbsentParents(
  facultyUid: string,
  courseCode: string,
  courseName: string,
  date: string,
  absentUids: string[],
  notifyType: 'sms' | 'call' | 'both' = 'sms',
): Promise<number> {
  if (absentUids.length === 0) return 0
  const recipients = []

  for (const uid of absentUids) {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (!userSnap.exists()) continue

    const data = userSnap.data()
    const parentPhone = data.parentPhone as string | undefined
    if (!parentPhone) continue

    recipients.push({
      studentUid: uid,
      studentName: data.name as string,
      rollNumber: (data.rollNumber ?? '') as string,
      parentPhone,
    })
  }

  if (recipients.length === 0) return 0

  const response = await api.post('/notifications/parent-alerts', {
    facultyUid,
    courseCode,
    courseName,
    date,
    recipients,
    notifyType,
  })

  return Number(response.data.sentCount ?? 0)
}

export async function fetchAttendanceSessions(uid: string): Promise<AttendanceSession[]> {
  const q = query(collection(db, 'attendanceSessions'), where('markedBy', '==', uid))
  const snap = await getDocs(q)
  const sessions = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AttendanceSession, 'id'>) }))
  return sessions.sort((a, b) => b.date.localeCompare(a.date))
}

export async function editAttendanceRecord(recordId: string, status: string): Promise<void> {
  await updateDoc(doc(db, 'attendance', recordId), { status, editedAt: new Date().toISOString() })
}

// ─── Marks ────────────────────────────────────────────────────────────────────

function computeGrade(total: number, maxTotal: number): string {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0
  if (pct >= 90) return 'O'
  if (pct >= 80) return 'A+'
  if (pct >= 70) return 'A'
  if (pct >= 60) return 'B+'
  if (pct >= 50) return 'B'
  if (pct >= 40) return 'C'
  return 'F'
}

// Reads from 'marks' collection (same as student dashboard & admin)
export async function fetchStudentMarkEntries(courseCode: string): Promise<StudentMarkEntry[]> {
  const q = query(collection(db, 'marks'), where('courseCode', '==', courseCode))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const r = d.data()
    // Support legacy 'internal' field — split equally across internal1/2/3
    const legacyInternal = r.internal as number | undefined
    return {
      uid: (r.studentUid ?? r.uid ?? '') as string,
      name: (r.name ?? r.studentName ?? '') as string,
      rollNumber: (r.rollNumber ?? '') as string,
      internal1: (r.internal1 ?? (legacyInternal !== undefined ? Math.round(legacyInternal / 3) : null)) as number | null,
      internal2: (r.internal2 ?? (legacyInternal !== undefined ? Math.round(legacyInternal / 3) : null)) as number | null,
      internal3: (r.internal3 ?? null) as number | null,
      assignment: (r.assignment ?? null) as number | null,
      lab: (r.lab ?? null) as number | null,
      semester: (r.semesterExam ?? null) as number | null,
      maxInternal: 30,
      maxAssignment: 10,
      maxLab: 10,
    }
  })
}

// Writes to 'marks' collection so students can see the grades
export async function saveMarkEntries(
  courseCode: string,
  facultyUid: string,
  entries: StudentMarkEntry[],
  subject?: string,
  academicSemester?: number,
): Promise<void> {
  const batch = writeBatch(db)
  for (const entry of entries) {
    const internal1 = entry.internal1 ?? 0
    const internal2 = entry.internal2 ?? 0
    const internal3 = entry.internal3 ?? 0
    const assignment = entry.assignment ?? 0
    const lab = entry.lab ?? 0
    const semesterExam = entry.semester ?? 0
    // Internal raw: i1(30)+i2(30)+i3(20)+assign(10)+lab(10) = max 100 → divide by 2 = 50
    const internalRaw = internal1 + internal2 + internal3 + assignment + lab
    const internalScore = Math.round(internalRaw / 2) // out of 50
    // Semester exam: max 100 → divide by 2 = 50
    const semScore = Math.round(semesterExam / 2) // out of 50
    const total = internalScore + semScore // out of 100
    const ref = doc(db, 'marks', `${courseCode}_${entry.uid}`)
    batch.set(ref, {
      studentUid: entry.uid,
      studentName: entry.name,
      rollNumber: entry.rollNumber,
      courseCode,
      subject: subject ?? courseCode,
      semester: academicSemester != null ? String(academicSemester) : undefined,
      name: entry.name,
      internal1,
      internal2,
      internal3,
      assignment,
      lab,
      semesterExam,
      // Student display fields: save already-divided scores so /max makes sense
      internal: internalScore,    // out of 50
      maxInternal: 50,
      external: semScore,         // out of 50
      maxExternal: 50,
      total,                      // out of 100
      maxTotal: 100,
      grade: computeGrade(total, 100),
      facultyUid,
      published: false,
      updatedAt: new Date().toISOString(),
    })
  }
  await batch.commit()
}

export async function fetchReEvaluationRequests(uid: string): Promise<ReEvaluationRequest[]> {
  const allocations = await fetchSubjectAllocations(uid)
  const codes = allocations.map((a) => a.courseCode)
  if (codes.length === 0) return []
  const q = query(collection(db, 'reEvaluation'), where('courseCode', 'in', codes.slice(0, 10)))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReEvaluationRequest, 'id'>) }))
  return records.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
}

export async function respondToReEvaluation(
  requestId: string,
  status: 'approved' | 'rejected',
  response: string,
): Promise<void> {
  await updateDoc(doc(db, 'reEvaluation', requestId), {
    status,
    response,
    respondedAt: new Date().toISOString(),
  })
}

// ─── Students / Mentees ───────────────────────────────────────────────────────

export async function fetchMentees(uid: string): Promise<MenteeStudent[]> {
  const q = query(collection(db, 'mentorships'), where('mentorUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ ...(d.data() as MenteeStudent) }))
}

export async function fetchStudentsBySubject(courseCode: string): Promise<
  Array<{ uid: string; name: string; rollNumber: string; email: string }>
> {
  const q = query(collection(db, 'attendance'), where('courseCode', '==', courseCode))
  const snap = await getDocs(q)
  const uidSet = new Set(snap.docs.map((d) => d.data().studentUid as string))
  const students: Array<{ uid: string; name: string; rollNumber: string; email: string }> = []
  for (const studentUid of uidSet) {
    const userSnap = await getDoc(doc(db, 'users', studentUid))
    if (userSnap.exists()) {
      students.push({
        uid: studentUid,
        name: userSnap.data().name as string,
        rollNumber: userSnap.data().rollNumber as string,
        email: userSnap.data().email as string,
      })
    }
  }
  return students
}

// ─── Academic — materials & quizzes ──────────────────────────────────────────

export async function fetchStudyUploads(uid: string): Promise<StudyUpload[]> {
  const q = query(
    collection(db, 'materials'),
    where('uploadedBy', '==', uid),
    orderBy('uploadedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudyUpload, 'id'>) }))
}

export async function uploadStudyMaterial(
  uid: string,
  data: Omit<StudyUpload, 'id' | 'uploadedAt'>,
): Promise<void> {
  await addDoc(collection(db, 'materials'), {
    ...data,
    uploadedBy: uid,
    uploadedAt: new Date().toISOString(),
  })
}

export async function fetchQuizAssignments(uid: string): Promise<QuizAssignment[]> {
  const q = query(collection(db, 'assignments'), where('createdBy', '==', uid))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuizAssignment, 'id'>) }))
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createQuizAssignment(
  uid: string,
  data: Omit<QuizAssignment, 'id' | 'submissionCount' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(db, 'assignments'), {
    ...data,
    createdBy: uid,
    submissionCount: 0,
    submittedBy: [],
    submissionDetails: {},
    createdAt: new Date().toISOString(),
  })
}

// ─── Leave ────────────────────────────────────────────────────────────────────

export async function fetchLeaveBalance(uid: string): Promise<LeaveBalance> {
  const snap = await getDoc(doc(db, 'leaveBalance', uid))
  if (!snap.exists()) return { casual: 12, medical: 10, duty: 15, earned: 20 }
  return snap.data() as LeaveBalance
}

export async function fetchLeaveRequests(uid: string): Promise<LeaveRequest[]> {
  const q = query(collection(db, 'leaveRequests'), where('facultyUid', '==', uid))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<LeaveRequest, 'id'>) }))
  return records.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
}

export async function submitLeaveRequest(
  uid: string,
  data: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt'>,
): Promise<void> {
  await addDoc(collection(db, 'leaveRequests'), {
    ...data,
    facultyUid: uid,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  })
}

// ─── Pay slips ────────────────────────────────────────────────────────────────

export async function fetchPaySlips(uid: string): Promise<PaySlip[]> {
  const q = query(collection(db, 'paySlips'), where('facultyUid', '==', uid))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PaySlip, 'id'>) }))
  return records.sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`))
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchFacultyNotifications(uid: string): Promise<FacultyNotification[]> {
  const q = query(collection(db, 'notifications'), where('targetUid', '==', uid))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FacultyNotification, 'id'>) }))
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true })
}

// ─── Communication ────────────────────────────────────────────────────────────

export async function fetchNotices(uid: string): Promise<Notice[]> {
  const q = query(collection(db, 'notices'), where('createdBy', '==', uid))
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Notice, 'id'>) }))
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createNotice(
  uid: string,
  name: string,
  data: { title: string; content: string; targetAudience: string; targetCourse?: string },
): Promise<void> {
  await addDoc(collection(db, 'notices'), {
    ...data,
    createdBy: uid,
    createdByName: name,
    createdAt: new Date().toISOString(),
  })
}

export async function fetchMessages(uid: string): Promise<Message[]> {
  const sent = query(collection(db, 'messages'), where('fromUid', '==', uid))
  const received = query(collection(db, 'messages'), where('toUid', '==', uid))
  const [sentSnap, receivedSnap] = await Promise.all([getDocs(sent), getDocs(received)])
  const all = [
    ...sentSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) })),
    ...receivedSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) })),
  ]
  return all.sort((a, b) => b.sentAt.localeCompare(a.sentAt))
}

export async function sendMessage(
  fromUid: string,
  fromName: string,
  data: { toUid: string; toName: string; subject: string; body: string },
): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    fromUid,
    fromName,
    ...data,
    read: false,
    sentAt: new Date().toISOString(),
  })
}

export async function fetchDepartmentNotices(): Promise<Notice[]> {
  const q = query(
    collection(db, 'notices'),
    where('targetAudience', '==', 'faculty'),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Notice, 'id'>) }))
}
