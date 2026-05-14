import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, firebaseConfig } from '../firebase'
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
} from '../types/admin'

export async function fetchAdminStats(): Promise<AdminStats> {
  const [studentsSnap, facultySnap, complaintsSnap, applicationsSnap, feesSnap, noticesSnap] =
    await Promise.all([
      getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
      getDocs(query(collection(db, 'users'), where('role', '==', 'faculty'))),
      getDocs(query(collection(db, 'complaints'), where('status', 'in', ['open', 'in-progress']))),
      getDocs(collection(db, 'applications')),
      getDocs(
        query(
          collection(db, 'fees'),
          where('status', 'in', ['pending', 'partial', 'overdue']),
        ),
      ),
      getDocs(collection(db, 'notices')),
    ])
  return {
    totalStudents: studentsSnap.size,
    totalFaculty: facultySnap.size,
    pendingComplaints: complaintsSnap.size,
    totalApplications: applicationsSnap.size,
    pendingFees: feesSnap.size,
    activeNotices: noticesSnap.size,
  }
}

// ── Students ──────────────────────────────────────────────────────────────────

export async function fetchAllStudents(): Promise<AdminStudent[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminStudent)
}

export async function saveStudent(
  id: string | null,
  data: Omit<AdminStudent, 'id'>,
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'users', id), data as Record<string, unknown>)
  } else {
    await addDoc(collection(db, 'users'), data)
  }
}

export async function createStudentWithId(
  uid: string,
  data: Omit<AdminStudent, 'id'>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), data)
}

export async function createStudentWithCredentials(
  data: Omit<AdminStudent, 'id'>,
  password: string,
): Promise<void> {
  const uid = await createEmailPasswordAccount(data.email, password)
  await createStudentWithId(uid, data)
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', id))
}

// ── Faculty ───────────────────────────────────────────────────────────────────

export async function fetchAllFaculty(): Promise<AdminFaculty[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'faculty'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminFaculty)
}

export async function saveFaculty(
  id: string | null,
  data: Omit<AdminFaculty, 'id'>,
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'users', id), data as Record<string, unknown>)
  } else {
    await addDoc(collection(db, 'users'), data)
  }
}

export async function createFacultyWithId(
  uid: string,
  data: Omit<AdminFaculty, 'id'>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid), data)
}

export async function createFacultyWithCredentials(
  data: Omit<AdminFaculty, 'id'>,
  password: string,
): Promise<void> {
  const uid = await createEmailPasswordAccount(data.email, password)
  await createFacultyWithId(uid, data)
}

export async function deleteFaculty(id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', id))
}

// ── Subject Allocations ───────────────────────────────────────────────────────

export async function fetchAllAllocations(): Promise<AdminAllocation[]> {
  const snap = await getDocs(collection(db, 'subjectAllocations'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminAllocation)
}

export async function saveAllocation(
  id: string | null,
  data: Omit<AdminAllocation, 'id'>,
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'subjectAllocations', id), data as Record<string, unknown>)
  } else {
    await addDoc(collection(db, 'subjectAllocations'), data)
  }
}

export async function deleteAllocation(id: string): Promise<void> {
  await deleteDoc(doc(db, 'subjectAllocations', id))
}

// ── Attendance ────────────────────────────────────────────────────────────────
// DevSeed stores one doc per class session (studentUid, courseCode, date, status).
// Admin view aggregates these into per-student-per-subject summaries.
// Admin edits are saved to attendanceSummary and take priority on next fetch.

export async function fetchAllAttendance(): Promise<AdminAttendanceRecord[]> {
  const [dailySnap, overrideSnap] = await Promise.all([
    getDocs(collection(db, 'attendance')),
    getDocs(collection(db, 'attendanceSummary')),
  ])

  // Aggregate daily records
  const computed = new Map<string, AdminAttendanceRecord>()
  dailySnap.docs.forEach((d) => {
    const data = d.data()
    const studentUid = data.studentUid as string
    const courseCode = data.courseCode as string
    if (!studentUid || !courseCode) return
    const key = `${studentUid}_${courseCode}`
    if (!computed.has(key)) {
      computed.set(key, {
        id: key,
        studentId: studentUid,
        subject: (data.courseName as string) ?? courseCode,
        subjectCode: courseCode,
        totalClasses: 0,
        attended: 0,
        percentage: 0,
      })
    }
    const rec = computed.get(key)!
    rec.totalClasses++
    if (data.status === 'present') rec.attended++
    rec.percentage = Math.round((rec.attended / rec.totalClasses) * 100)
  })

  // Admin overrides take priority over computed values
  overrideSnap.docs.forEach((d) => {
    computed.set(d.id, { id: d.id, ...d.data() } as AdminAttendanceRecord)
  })

  return Array.from(computed.values())
}

export async function updateAttendanceRecord(
  id: string,
  data: Partial<AdminAttendanceRecord>,
): Promise<void> {
  const { attended, totalClasses } = data
  const percentage =
    totalClasses && attended !== undefined
      ? Math.round((attended / totalClasses) * 100)
      : undefined
  // Write admin override to attendanceSummary; merged on next fetch
  await setDoc(
    doc(db, 'attendanceSummary', id),
    { ...data, ...(percentage !== undefined ? { percentage } : {}) } as Record<string, unknown>,
    { merge: true },
  )
}

// ── Marks ─────────────────────────────────────────────────────────────────────
// DevSeed seeds to 'marks' collection with fields: studentUid, courseCode, subject,
// semester, internal, external, total, maxTotal, grade.

export async function fetchAllMarks(): Promise<AdminMarkRecord[]> {
  const snap = await getDocs(collection(db, 'marks'))
  return snap.docs.map((d) => {
    const r = d.data()
    const internal = Number(r.internal ?? r.internalMarks ?? 0)
    const external = Number(r.external ?? r.externalMarks ?? 0)
    const total = Number(r.total ?? r.totalMarks ?? internal + external)
    const maxMarks = Number(r.maxTotal ?? r.maxMarks ?? 100)
    return {
      id: d.id,
      studentId: (r.studentUid ?? r.studentId ?? '') as string,
      studentName: (r.studentName ?? '') as string,
      rollNumber: (r.rollNumber ?? '') as string,
      subject: (r.subject ?? '') as string,
      subjectCode: (r.courseCode ?? r.subjectCode ?? '') as string,
      semester: Number(r.semester ?? 0),
      internalMarks: internal,
      externalMarks: external,
      totalMarks: total,
      maxMarks,
      grade: (r.grade ?? '') as string,
    }
  })
}

export async function updateMarkRecord(
  id: string,
  data: Partial<AdminMarkRecord>,
): Promise<void> {
  // Map back to Firestore field names used by DevSeed / faculty
  const update: Record<string, unknown> = { ...data }
  if (data.internalMarks !== undefined) update.internal = data.internalMarks
  if (data.externalMarks !== undefined) update.external = data.externalMarks
  if (data.totalMarks !== undefined) update.total = data.totalMarks
  if (data.maxMarks !== undefined) update.maxTotal = data.maxMarks
  await updateDoc(doc(db, 'marks', id), update)
}

export async function publishMarkResults(id: string, published: boolean): Promise<void> {
  await updateDoc(doc(db, 'marks', id), { published })
}

// ── Fees ──────────────────────────────────────────────────────────────────────
// DevSeed stores fees with doc ID = student UID, field 'totalFee' (not totalAmount).

export async function fetchAllFees(): Promise<AdminFeeRecord[]> {
  const snap = await getDocs(collection(db, 'fees'))
  return snap.docs.map((d) => {
    const r = d.data()
    return {
      id: d.id,
      studentId: (r.studentId ?? d.id) as string,
      studentName: (r.studentName ?? undefined) as string | undefined,
      rollNumber: (r.rollNumber ?? undefined) as string | undefined,
      semester: Number(r.semester ?? 1),
      totalAmount: Number(r.totalFee ?? r.totalAmount ?? 0),
      paidAmount: Number(r.paidAmount ?? 0),
      dueDate: (r.dueDate ?? '') as string,
      status: (r.status ?? 'pending') as AdminFeeRecord['status'],
      lastPaymentDate: (r.lastPaymentDate ?? undefined) as string | undefined,
    }
  })
}

export async function addFeeRecord(data: Omit<AdminFeeRecord, 'id'>): Promise<void> {
  await addDoc(collection(db, 'fees'), {
    studentId: data.studentId,
    studentName: data.studentName,
    rollNumber: data.rollNumber,
    semester: data.semester,
    totalFee: data.totalAmount,
    totalAmount: data.totalAmount,
    paidAmount: data.paidAmount,
    dueDate: data.dueDate,
    status: data.status,
  })
}

export async function updateFeeRecord(id: string, data: Partial<AdminFeeRecord>): Promise<void> {
  const update: Record<string, unknown> = { ...data }
  if (data.totalAmount !== undefined) update.totalFee = data.totalAmount
  await updateDoc(doc(db, 'fees', id), update)
}

// ── Applications ──────────────────────────────────────────────────────────────

export async function fetchAllApplications(): Promise<AdminApplication[]> {
  const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminApplication)
}

export async function updateApplication(
  id: string,
  data: Partial<AdminApplication>,
): Promise<void> {
  await updateDoc(doc(db, 'applications', id), {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>)
}

export async function addApplication(data: Omit<AdminApplication, 'id'>): Promise<void> {
  await addDoc(collection(db, 'applications'), data)
}

// ── Complaints ────────────────────────────────────────────────────────────────

export async function fetchAllComplaints(): Promise<AdminComplaint[]> {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const r = d.data()
    return {
      id: d.id,
      // DevSeed uses 'studentUid'; faculty dashboard uses 'studentId'
      studentId: (r.studentUid ?? r.studentId ?? '') as string,
      studentName: (r.studentName ?? 'Student') as string,
      category: (r.category ?? 'General') as string,
      subject: (r.subject ?? '') as string,
      description: (r.description ?? '') as string,
      status: (r.status ?? 'open') as AdminComplaint['status'],
      priority: (r.priority ?? 'medium') as AdminComplaint['priority'],
      // DevSeed uses 'response'; admin writes 'adminResponse'
      adminResponse: (r.adminResponse ?? r.response ?? undefined) as string | undefined,
      createdAt: (r.createdAt ?? new Date().toISOString()) as string,
      updatedAt: (r.updatedAt ?? r.createdAt ?? new Date().toISOString()) as string,
    }
  })
}

export async function updateComplaint(
  id: string,
  data: Partial<AdminComplaint>,
): Promise<void> {
  await updateDoc(doc(db, 'complaints', id), {
    ...data,
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>)
}

export async function deleteComplaint(id: string): Promise<void> {
  await deleteDoc(doc(db, 'complaints', id))
}

// ── Notices ───────────────────────────────────────────────────────────────────

export async function fetchAllNotices(): Promise<BroadcastNotice[]> {
  const q = query(collection(db, 'notices'), orderBy('issuedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BroadcastNotice)
}

export async function saveNotice(
  id: string | null,
  data: Omit<BroadcastNotice, 'id'>,
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, 'notices', id), data as Record<string, unknown>)
  } else {
    await addDoc(collection(db, 'notices'), data)
  }
}

export async function deleteNotice(id: string): Promise<void> {
  await deleteDoc(doc(db, 'notices', id))
}

async function createEmailPasswordAccount(email: string, password: string): Promise<string> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: false,
      }),
    },
  )

  const data = (await response.json()) as {
    localId?: string
    error?: { message?: string }
  }

  if (!response.ok || !data.localId) {
    const message = mapFirebaseAuthError(data.error?.message)
    throw new Error(message)
  }

  return data.localId
}

function mapFirebaseAuthError(code?: string) {
  switch (code) {
    case 'EMAIL_EXISTS':
      return 'A Firebase login already exists for this email.'
    case 'WEAK_PASSWORD : Password should be at least 6 characters':
    case 'WEAK_PASSWORD':
      return 'Password must be at least 6 characters long.'
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.'
    default:
      return code ? `Unable to create login credentials: ${code}` : 'Unable to create login credentials.'
  }
}
