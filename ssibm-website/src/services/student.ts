import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import type {
  Assignment,
  AttendanceRecord,
  Complaint,
  FeeRecord,
  MarksRecord,
  Notice,
  StudentProfile,
  StudyMaterial,
  TimetableSlot,
} from '../types/student'

export async function fetchStudentProfile(uid: string): Promise<StudentProfile> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) throw new Error('Profile not found.')
  const data = snap.data()
  return {
    uid,
    ...(data as Omit<StudentProfile, 'uid'>),
    // Admin saves 'department'; student profile type uses 'course'
    course: (data.course ?? data.department ?? '') as string,
    // Ensure semester is always a string
    semester: String(data.semester ?? data.sem ?? ''),
  }
}

export async function updateStudentProfile(
  uid: string,
  data: Partial<Omit<StudentProfile, 'uid' | 'email' | 'role'>>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>)
}

export async function fetchAttendance(uid: string): Promise<AttendanceRecord[]> {
  const q = query(
    collection(db, 'attendance'),
    where('studentUid', '==', uid),
  )
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AttendanceRecord, 'id'>) }))
  return records.sort((a, b) => b.date.localeCompare(a.date))
}

export async function fetchTimetable(
  course: string,
  semester: string,
): Promise<TimetableSlot[]> {
  // Single-field query to avoid composite-index requirement
  const q = query(collection(db, 'timetable'), where('course', '==', course))
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => !semester || String(d.data().semester) === semester)
    .map((d) => ({ id: d.id, ...(d.data() as Omit<TimetableSlot, 'id'>) }))
}

export async function fetchMarks(uid: string): Promise<MarksRecord[]> {
  const q = query(collection(db, 'marks'), where('studentUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const r = d.data()
    return {
      id: d.id,
      // Support both field name conventions
      subject: (r.subject ?? r.courseName ?? r.courseCode ?? '') as string,
      courseCode: (r.courseCode ?? '') as string,
      semester: String(r.semester ?? r.academicSemester ?? ''),
      internal: Number(r.internal ?? r.internalMarks ?? 0),
      maxInternal: Number(r.maxInternal ?? 50),
      external: Number(r.external ?? r.externalMarks ?? 0),
      maxExternal: Number(r.maxExternal ?? 50),
      total: Number(r.total ?? r.totalMarks ?? 0),
      maxTotal: Number(r.maxTotal ?? 100),
      grade: (r.grade ?? '') as string,
      published: (r.published ?? false) as boolean,
      internal1: r.internal1 as number | undefined,
      internal2: r.internal2 as number | undefined,
      internal3: r.internal3 as number | undefined,
    } satisfies MarksRecord
  })
}

export async function fetchFees(uid: string): Promise<FeeRecord | null> {
  // Admin adds fees with auto-generated IDs and studentId field
  const q = query(collection(db, 'fees'), where('studentId', '==', uid))
  const snap = await getDocs(q)

  let raw: Record<string, unknown> | null = null
  if (!snap.empty) {
    // Use the most recent record (or the one with the highest total)
    raw = snap.docs[0].data() as Record<string, unknown>
  } else {
    // Legacy: fee doc ID = student UID
    const legacySnap = await getDoc(doc(db, 'fees', uid))
    if (legacySnap.exists()) raw = legacySnap.data() as Record<string, unknown>
  }

  if (!raw) return null
  const totalFee = Number(raw.totalFee ?? raw.totalAmount ?? 0)
  const paidAmount = Number(raw.paidAmount ?? 0)
  return {
    totalFee,
    paidAmount,
    dueAmount: Math.max(0, totalFee - paidAmount),
    dueDate: (raw.dueDate ?? '') as string,
    status: mapFeeStatus(raw.status as string | undefined),
    transactions: [],
  }
}

function mapFeeStatus(status: string | undefined): 'paid' | 'partial' | 'unpaid' {
  if (status === 'paid') return 'paid'
  if (status === 'partial') return 'partial'
  return 'unpaid'
}

export async function fetchAssignments(uid: string, course: string): Promise<Assignment[]> {
  // course = student department (e.g. 'BCA'); assignment courseCode = 'BCA301'
  // Fetch all assignments and filter by department prefix client-side
  const snap = await getDocs(collection(db, 'assignments'))
  const deptPrefix = course.slice(0, 3).toLowerCase()
  return snap.docs
    .filter((d) => {
      const code = ((d.data().courseCode ?? d.data().course ?? '') as string).toLowerCase()
      return code.startsWith(deptPrefix) || code === course.toLowerCase()
    })
    .map((d) => {
      const data = d.data() as Omit<Assignment, 'id' | 'submitted' | 'submittedAt' | 'obtainedMarks'>
      const submissions: string[] = (d.data().submittedBy as string[] | undefined) ?? []
      const submissionMeta = (d.data().submissionDetails as Record<string, { submittedAt: string; marks?: number }> | undefined) ?? {}
      return {
        id: d.id,
        ...data,
        submitted: submissions.includes(uid),
        submittedAt: submissionMeta[uid]?.submittedAt,
        obtainedMarks: submissionMeta[uid]?.marks,
      }
    })
}

export async function submitAssignment(
  assignmentId: string,
  uid: string,
  fileUrl: string,
): Promise<void> {
  const ref = doc(db, 'assignments', assignmentId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Assignment not found.')
  const data = snap.data()
  const submittedBy: string[] = (data.submittedBy as string[] | undefined) ?? []
  const submissionDetails: Record<string, { submittedAt: string; fileUrl: string }> =
    (data.submissionDetails as Record<string, { submittedAt: string; fileUrl: string }> | undefined) ?? {}
  await updateDoc(ref, {
    submittedBy: [...new Set([...submittedBy, uid])],
    submissionDetails: {
      ...submissionDetails,
      [uid]: { submittedAt: new Date().toISOString(), fileUrl },
    },
  })
}

export async function fetchMaterials(course: string): Promise<StudyMaterial[]> {
  // course = department (e.g. 'BCA'); materials have courseCode (e.g. 'BCA301')
  // Fetch all and filter client-side so any course-code format works
  const snap = await getDocs(collection(db, 'materials'))
  const deptPrefix = course.slice(0, 3).toLowerCase()
  return snap.docs
    .filter((d) => {
      const code = ((d.data().courseCode ?? '') as string).toLowerCase()
      return code.startsWith(deptPrefix) || code === course.toLowerCase()
    })
    .map((d) => ({ id: d.id, ...(d.data() as Omit<StudyMaterial, 'id'>) }))
    .sort((a, b) => (b.uploadedAt ?? '').localeCompare(a.uploadedAt ?? ''))
}
export async function fetchNotices(): Promise<Notice[]> {
  const q = query(
    collection(db, 'notices'),
    where('targetAudience', 'in', ['all', 'students']),
  )
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Notice, 'id'>) }))
    .sort((a, b) => {
      // Admin notices use 'issuedAt'; faculty notices use 'createdAt'
      const dateA = (a as Record<string, string>).issuedAt ?? a.createdAt ?? ''
      const dateB = (b as Record<string, string>).issuedAt ?? b.createdAt ?? ''
      return dateB.localeCompare(dateA)
    })
}

export async function fetchComplaints(uid: string): Promise<Complaint[]> {
  const q = query(
    collection(db, 'complaints'),
    where('studentUid', '==', uid),
  )
  const snap = await getDocs(q)
  const records = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Complaint, 'id'>) }))
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function submitComplaint(
  uid: string,
  data: { subject: string; category: string; description: string; studentName?: string },
): Promise<void> {
  await addDoc(collection(db, 'complaints'), {
    studentUid: uid,
    studentName: data.studentName ?? 'Student',
    subject: data.subject,
    category: data.category,
    description: data.description,
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  })
}
