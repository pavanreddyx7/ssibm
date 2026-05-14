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
  return { uid, ...(snap.data() as Omit<StudentProfile, 'uid'>) }
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
  const q = query(
    collection(db, 'timetable'),
    where('course', '==', course),
    where('semester', '==', semester),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TimetableSlot, 'id'>) }))
}

export async function fetchMarks(uid: string): Promise<MarksRecord[]> {
  const q = query(collection(db, 'marks'), where('studentUid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MarksRecord, 'id'>) }))
}

export async function fetchFees(uid: string): Promise<FeeRecord | null> {
  const snap = await getDoc(doc(db, 'fees', uid))
  if (!snap.exists()) return null
  return snap.data() as FeeRecord
}

export async function fetchAssignments(uid: string, course: string): Promise<Assignment[]> {
  const q = query(
    collection(db, 'assignments'),
    where('course', '==', course),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
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
  const q = query(
    collection(db, 'materials'),
    where('courseCode', '==', course),
    orderBy('uploadedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudyMaterial, 'id'>) }))
}

export async function fetchNotices(): Promise<Notice[]> {
  const q = query(
    collection(db, 'notices'),
    where('targetAudience', 'in', ['all', 'students']),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Notice, 'id'>) }))
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
