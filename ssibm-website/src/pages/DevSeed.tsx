import { deleteApp, initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { db, firebaseConfig } from '../firebase'

const TEST_ACCOUNTS = [
  { role: 'admin', email: 'admin@ssibm.demo', password: 'Admin@123', label: 'Admin' },
]

// ─── Seed helpers ─────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function dateFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// ─── Seed data definitions ────────────────────────────────────────────────────

function buildSeedData(uid: string) {
  // ── Student profile ─────────────────────────────────────────────────────
  const profile = {
    role: 'student',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@ssibm.ac.in',
    phone: '9876543210',
    rollNumber: 'BCA23001',
    course: 'BCA',
    semester: '3',
    section: 'A',
    dob: '2004-08-15',
    address: '12, 3rd Cross, Tumakuru, Karnataka 572101',
    parentPhone: '9845012345',
  }

  // ── Attendance (30 days × 5 subjects) ──────────────────────────────────
  const subjects = [
    { courseCode: 'BCA301', courseName: 'Data Structures' },
    { courseCode: 'BCA302', courseName: 'Object Oriented Programming' },
    { courseCode: 'BCA303', courseName: 'Database Management Systems' },
    { courseCode: 'BCA304', courseName: 'Computer Networks' },
    { courseCode: 'BCA305', courseName: 'Web Technologies' },
  ]

  // present on most days, absent a few
  const absentDays: Record<string, number[]> = {
    BCA301: [3, 8, 15],
    BCA302: [5, 20],
    BCA303: [2, 10, 25],
    BCA304: [7],
    BCA305: [12, 18, 22],
  }

  const attendanceRecords: Array<Record<string, unknown>> = []
  for (const sub of subjects) {
    for (let i = 1; i <= 30; i++) {
      const isAbsent = (absentDays[sub.courseCode] ?? []).includes(i)
      attendanceRecords.push({
        studentUid: uid,
        courseCode: sub.courseCode,
        courseName: sub.courseName,
        date: daysAgo(i),
        status: isAbsent ? 'absent' : 'present',
      })
    }
  }

  // ── Timetable ───────────────────────────────────────────────────────────
  const timetableSlots = [
    { course: 'BCA', semester: '3', day: 'Monday', time: '09:00 - 10:00', subject: 'Data Structures', room: 'Room 201', faculty: 'Prof. Suresh M.' },
    { course: 'BCA', semester: '3', day: 'Monday', time: '10:00 - 11:00', subject: 'OOP with Java', room: 'Room 202', faculty: 'Prof. Kavitha R.' },
    { course: 'BCA', semester: '3', day: 'Monday', time: '11:00 - 12:00', subject: 'DBMS', room: 'Room 201', faculty: 'Prof. Ramesh B.' },
    { course: 'BCA', semester: '3', day: 'Monday', time: '14:00 - 15:00', subject: 'Web Technologies', room: 'Lab 1', faculty: 'Prof. Anitha S.' },
    { course: 'BCA', semester: '3', day: 'Tuesday', time: '09:00 - 10:00', subject: 'Computer Networks', room: 'Room 203', faculty: 'Prof. Vijay K.' },
    { course: 'BCA', semester: '3', day: 'Tuesday', time: '10:00 - 11:00', subject: 'Data Structures', room: 'Room 201', faculty: 'Prof. Suresh M.' },
    { course: 'BCA', semester: '3', day: 'Tuesday', time: '11:00 - 13:00', subject: 'OOP Lab', room: 'Lab 2', faculty: 'Prof. Kavitha R.' },
    { course: 'BCA', semester: '3', day: 'Wednesday', time: '09:00 - 10:00', subject: 'DBMS', room: 'Room 201', faculty: 'Prof. Ramesh B.' },
    { course: 'BCA', semester: '3', day: 'Wednesday', time: '10:00 - 11:00', subject: 'Web Technologies', room: 'Room 202', faculty: 'Prof. Anitha S.' },
    { course: 'BCA', semester: '3', day: 'Wednesday', time: '11:00 - 12:00', subject: 'Computer Networks', room: 'Room 203', faculty: 'Prof. Vijay K.' },
    { course: 'BCA', semester: '3', day: 'Thursday', time: '09:00 - 11:00', subject: 'DBMS Lab', room: 'Lab 1', faculty: 'Prof. Ramesh B.' },
    { course: 'BCA', semester: '3', day: 'Thursday', time: '11:00 - 12:00', subject: 'Data Structures', room: 'Room 201', faculty: 'Prof. Suresh M.' },
    { course: 'BCA', semester: '3', day: 'Thursday', time: '14:00 - 15:00', subject: 'OOP with Java', room: 'Room 202', faculty: 'Prof. Kavitha R.' },
    { course: 'BCA', semester: '3', day: 'Friday', time: '09:00 - 10:00', subject: 'Web Technologies', room: 'Room 202', faculty: 'Prof. Anitha S.' },
    { course: 'BCA', semester: '3', day: 'Friday', time: '10:00 - 11:00', subject: 'Computer Networks', room: 'Room 203', faculty: 'Prof. Vijay K.' },
    { course: 'BCA', semester: '3', day: 'Friday', time: '14:00 - 16:00', subject: 'Web Tech Lab', room: 'Lab 1', faculty: 'Prof. Anitha S.' },
    { course: 'BCA', semester: '3', day: 'Saturday', time: '09:00 - 10:00', subject: 'Data Structures', room: 'Room 201', faculty: 'Prof. Suresh M.' },
    { course: 'BCA', semester: '3', day: 'Saturday', time: '10:00 - 11:00', subject: 'DBMS', room: 'Room 201', faculty: 'Prof. Ramesh B.' },
  ]

  // ── Marks (Sem 1, 2 & 3 internal) ────────────────────────────────────────
  const marksRecords = [
    // Sem 1
    { studentUid: uid, courseCode: 'BCA101', subject: 'Programming in C', semester: '1', internal: 22, maxInternal: 25, external: 68, maxExternal: 75, total: 90, maxTotal: 100, grade: 'A' },
    { studentUid: uid, courseCode: 'BCA102', subject: 'Mathematics I', semester: '1', internal: 18, maxInternal: 25, external: 55, maxExternal: 75, total: 73, maxTotal: 100, grade: 'B' },
    { studentUid: uid, courseCode: 'BCA103', subject: 'Digital Electronics', semester: '1', internal: 20, maxInternal: 25, external: 60, maxExternal: 75, total: 80, maxTotal: 100, grade: 'A' },
    { studentUid: uid, courseCode: 'BCA104', subject: 'Communication Skills', semester: '1', internal: 23, maxInternal: 25, external: 65, maxExternal: 75, total: 88, maxTotal: 100, grade: 'A' },
    // Sem 2
    { studentUid: uid, courseCode: 'BCA201', subject: 'Data Structures', semester: '2', internal: 21, maxInternal: 25, external: 62, maxExternal: 75, total: 83, maxTotal: 100, grade: 'A' },
    { studentUid: uid, courseCode: 'BCA202', subject: 'Mathematics II', semester: '2', internal: 17, maxInternal: 25, external: 50, maxExternal: 75, total: 67, maxTotal: 100, grade: 'B' },
    { studentUid: uid, courseCode: 'BCA203', subject: 'Python Programming', semester: '2', internal: 24, maxInternal: 25, external: 70, maxExternal: 75, total: 94, maxTotal: 100, grade: 'O' },
    { studentUid: uid, courseCode: 'BCA204', subject: 'Operating Systems', semester: '2', internal: 19, maxInternal: 25, external: 58, maxExternal: 75, total: 77, maxTotal: 100, grade: 'A' },
    // Sem 3 — internal only (exam not yet held)
    { studentUid: uid, courseCode: 'BCA301', subject: 'Data Structures', semester: '3', internal: 20, maxInternal: 25, external: 0, maxExternal: 75, total: 20, maxTotal: 25, grade: 'IA' },
    { studentUid: uid, courseCode: 'BCA302', subject: 'OOP with Java', semester: '3', internal: 22, maxInternal: 25, external: 0, maxExternal: 75, total: 22, maxTotal: 25, grade: 'IA' },
  ]

  // ── Fees ────────────────────────────────────────────────────────────────
  const feeRecord = {
    totalFee: 55000,
    paidAmount: 35000,
    dueAmount: 20000,
    dueDate: dateFromNow(30),
    status: 'partial',
    transactions: [
      { id: 'txn001', date: daysAgo(120), amount: 20000, method: 'DD', receiptNo: 'REC2024001' },
      { id: 'txn002', date: daysAgo(60), amount: 15000, method: 'NEFT', receiptNo: 'REC2024002' },
    ],
  }

  // ── Assignments ──────────────────────────────────────────────────────────
  const assignments = [
    {
      course: 'BCA',
      courseCode: 'BCA301',
      courseName: 'Data Structures',
      title: 'Implement Binary Search Tree',
      description: 'Write a Java program to implement BST with insert, delete, and traversal operations. Submit source code and output screenshots.',
      dueDate: dateFromNow(7),
      maxMarks: 20,
      submittedBy: [],
      submissionDetails: {},
    },
    {
      course: 'BCA',
      courseCode: 'BCA303',
      courseName: 'Database Management Systems',
      title: 'Library Management System ER Diagram',
      description: 'Design a complete ER diagram for a library management system. Include entities, relationships, cardinality, and convert to relational schema.',
      dueDate: dateFromNow(3),
      maxMarks: 25,
      submittedBy: [],
      submissionDetails: {},
    },
    {
      course: 'BCA',
      courseCode: 'BCA305',
      courseName: 'Web Technologies',
      title: 'Personal Portfolio Website',
      description: 'Build a responsive personal portfolio website using HTML5, CSS3, and JavaScript. Must include Home, About, Projects, and Contact sections.',
      dueDate: dateFromNow(14),
      maxMarks: 30,
      submittedBy: [],
      submissionDetails: {},
    },
    {
      course: 'BCA',
      courseCode: 'BCA302',
      courseName: 'Object Oriented Programming',
      title: 'Inheritance and Polymorphism',
      description: 'Implement a banking system demonstrating inheritance (SavingsAccount, CurrentAccount) and method overriding in Java.',
      dueDate: daysAgo(5),
      maxMarks: 20,
      submittedBy: [uid],
      submissionDetails: {
        [uid]: { submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(), fileUrl: 'submitted-via-portal', marks: 17 },
      },
    },
    {
      course: 'BCA',
      courseCode: 'BCA304',
      courseName: 'Computer Networks',
      title: 'OSI Model Report',
      description: 'Prepare a detailed report (min 10 pages) on the OSI model — explain each layer with protocols and real-world examples.',
      dueDate: daysAgo(10),
      maxMarks: 15,
      submittedBy: [uid],
      submissionDetails: {
        [uid]: { submittedAt: new Date(Date.now() - 8 * 86400000).toISOString(), fileUrl: 'submitted-via-portal', marks: 13 },
      },
    },
  ]

  // ── Study Materials ──────────────────────────────────────────────────────
  const materials = [
    { course: 'BCA', courseCode: 'BCA301', courseName: 'Data Structures', title: 'Unit 1 - Arrays & Linked Lists Notes', type: 'pdf', url: 'https://drive.google.com/sample', description: 'Complete notes for Unit 1 covering arrays, linked lists, and basic operations.', uploadedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA301', courseName: 'Data Structures', title: 'Binary Trees - Video Lecture', type: 'video', url: 'https://youtube.com/sample', description: 'Recorded lecture on binary trees and traversal algorithms.', uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA302', courseName: 'OOP with Java', title: 'Java OOP Concepts - Complete Notes', type: 'pdf', url: 'https://drive.google.com/sample', description: 'Covers classes, objects, inheritance, polymorphism, abstraction, encapsulation.', uploadedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA303', courseName: 'Database Management Systems', title: 'SQL Practice Questions', type: 'doc', url: 'https://drive.google.com/sample', description: '50 practice SQL queries with solutions for exam preparation.', uploadedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA304', courseName: 'Computer Networks', title: 'Network Protocols Reference', type: 'pdf', url: 'https://drive.google.com/sample', description: 'Quick reference guide for TCP/IP, HTTP, FTP, SMTP and other protocols.', uploadedAt: new Date(Date.now() - 20 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA305', courseName: 'Web Technologies', title: 'HTML5 & CSS3 Cheat Sheet', type: 'pdf', url: 'https://drive.google.com/sample', description: 'Handy cheat sheet for HTML5 tags and CSS3 properties.', uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { course: 'BCA', courseCode: 'BCA305', courseName: 'Web Technologies', title: 'JavaScript MDN Reference', type: 'link', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', description: 'Official MDN JavaScript reference — bookmark this.', uploadedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  ]

  // ── Complaints ───────────────────────────────────────────────────────────
  const complaints = [
    {
      studentUid: uid,
      subject: 'Attendance marked incorrectly on 15th',
      category: 'Attendance',
      description: 'I was present for BCA301 (Data Structures) on 15th but my attendance shows absent. Request correction.',
      status: 'resolved',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      response: 'Verified with faculty. Attendance has been corrected. Please check your updated records.',
    },
    {
      studentUid: uid,
      subject: 'Library books not available for DBMS',
      category: 'Facility',
      description: 'The recommended textbook "Database System Concepts" by Silberschatz is not available in the library. Only 2 copies exist for 60 students.',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ]

  return { profile, attendanceRecords, timetableSlots, marksRecords, feeRecord, assignments, materials, complaints }
}

// ─── Component ────────────────────────────────────────────────────────────────

type StepStatus = 'idle' | 'running' | 'done' | 'error'
type Step = { label: string; status: StepStatus; count?: number }

const ROLE_PROFILES: Record<string, object> = {
  'admin@ssibm.demo': { role: 'admin', name: 'SSIBM Admin', email: 'admin@ssibm.demo', phone: '9742689866' },
}

async function seedFacultyFinance(uid: string) {
  await setDoc(doc(db, 'leaveBalance', uid), {
    casual: 8,
    medical: 6,
    duty: 3,
    earned: 12,
  })

  await setDoc(doc(db, 'paySlips', `${uid}_2026_05`), {
    facultyUid: uid,
    month: 'May',
    year: '2026',
    basic: 42000,
    hra: 8400,
    da: 4200,
    ta: 2800,
    pf: 3200,
    tax: 1800,
    gross: 57400,
    net: 52400,
  })

  await setDoc(doc(db, 'paySlips', `${uid}_2026_04`), {
    facultyUid: uid,
    month: 'April',
    year: '2026',
    basic: 42000,
    hra: 8400,
    da: 4200,
    ta: 2800,
    pf: 3200,
    tax: 1700,
    gross: 57400,
    net: 52500,
  })
}

export function DevSeed() {
  const { user } = useContext(AuthContext)
  const [steps, setSteps] = useState<Step[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [accountStatus, setAccountStatus] = useState<Record<string, 'idle' | 'done' | 'exists' | 'error'>>({})
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({})
  const [isCreatingAccounts, setIsCreatingAccounts] = useState(false)
  const [accountsDone, setAccountsDone] = useState(false)

  function updateStep(index: number, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  async function createAccounts() {
    setIsCreatingAccounts(true)
    setAccountsDone(false)
    const statusMap: Record<string, 'idle' | 'done' | 'exists' | 'error'> = {}
    const errMap: Record<string, string> = {}

    // Use a secondary Firebase app so account creation doesn't displace the current session
    const secondaryApp = initializeApp(firebaseConfig, `seed-${Date.now()}`)
    const secondaryAuth = getAuth(secondaryApp)

    for (const acct of TEST_ACCOUNTS) {
      try {
        let uid: string
        try {
          const cred = await createUserWithEmailAndPassword(secondaryAuth, acct.email, acct.password)
          uid = cred.user.uid
        } catch (err: unknown) {
          if ((err as { code?: string }).code !== 'auth/email-already-in-use') throw err
          // Account exists — sign in via secondary app to get the UID
          const cred = await signInWithEmailAndPassword(secondaryAuth, acct.email, acct.password)
          uid = cred.user.uid
        }
        const profile = ROLE_PROFILES[acct.email] ?? { role: acct.role, name: acct.label, email: acct.email }
        await setDoc(doc(db, 'users', uid), profile)
        if (acct.role === 'faculty') await seedFacultyFinance(uid)
        statusMap[acct.email] = 'done'
      } catch (err: unknown) {
        statusMap[acct.email] = 'error'
        errMap[acct.email] = (err as { code?: string }).code ?? (err as Error).message ?? 'unknown'
      }
      setAccountStatus({ ...statusMap })
      setAccountErrors({ ...errMap })
    }

    await deleteApp(secondaryApp)
    setIsCreatingAccounts(false)
    setAccountsDone(true)
  }

  async function runSeed() {
    if (!user) return
    setDone(false)
    setIsRunning(true)

    const initialSteps: Step[] = [
      { label: 'Student profile (users collection)', status: 'idle' },
      { label: 'Attendance records', status: 'idle' },
      { label: 'Timetable slots', status: 'idle' },
      { label: 'Marks & results', status: 'idle' },
      { label: 'Fee record', status: 'idle' },
      { label: 'Assignments', status: 'idle' },
      { label: 'Study materials', status: 'idle' },
      { label: 'Complaints', status: 'idle' },
    ]
    setSteps(initialSteps)
    const seed = buildSeedData(user.id)

    updateStep(0, { status: 'running' })
    try { await setDoc(doc(db, 'users', user.id), seed.profile, { merge: true }); updateStep(0, { status: 'done' }) }
    catch { updateStep(0, { status: 'error' }) }

    updateStep(1, { status: 'running' })
    try {
      const batch = writeBatch(db)
      for (const r of seed.attendanceRecords) batch.set(doc(collection(db, 'attendance')), r)
      await batch.commit()
      updateStep(1, { status: 'done', count: seed.attendanceRecords.length })
    } catch { updateStep(1, { status: 'error' }) }

    updateStep(2, { status: 'running' })
    try {
      const batch = writeBatch(db)
      for (const s of seed.timetableSlots) batch.set(doc(collection(db, 'timetable')), s)
      await batch.commit()
      updateStep(2, { status: 'done', count: seed.timetableSlots.length })
    } catch { updateStep(2, { status: 'error' }) }

    updateStep(3, { status: 'running' })
    try {
      const batch = writeBatch(db)
      for (const m of seed.marksRecords) batch.set(doc(collection(db, 'marks')), m)
      await batch.commit()
      updateStep(3, { status: 'done', count: seed.marksRecords.length })
    } catch { updateStep(3, { status: 'error' }) }

    updateStep(4, { status: 'running' })
    try { await setDoc(doc(db, 'fees', user.id), seed.feeRecord); updateStep(4, { status: 'done' }) }
    catch { updateStep(4, { status: 'error' }) }

    updateStep(5, { status: 'running' })
    try {
      for (const a of seed.assignments) await addDoc(collection(db, 'assignments'), a)
      updateStep(5, { status: 'done', count: seed.assignments.length })
    } catch { updateStep(5, { status: 'error' }) }

    updateStep(6, { status: 'running' })
    try {
      const batch = writeBatch(db)
      for (const m of seed.materials) batch.set(doc(collection(db, 'materials')), m)
      await batch.commit()
      updateStep(6, { status: 'done', count: seed.materials.length })
    } catch { updateStep(6, { status: 'error' }) }

    updateStep(7, { status: 'running' })
    try {
      for (const c of seed.complaints) await addDoc(collection(db, 'complaints'), c)
      updateStep(7, { status: 'done', count: seed.complaints.length })
    } catch { updateStep(7, { status: 'error' }) }

    setIsRunning(false)
    setDone(true)
  }

  const stepIcon: Record<StepStatus, string> = { idle: '○', running: '◌', done: '✓', error: '✗' }
  const stepColor: Record<StepStatus, string> = {
    idle: 'text-slate-400', running: 'text-amber-500', done: 'text-emerald-600', error: 'text-rose-600',
  }
  const acctBadge: Record<string, string> = {
    done: 'bg-emerald-100 text-emerald-700', exists: 'bg-slate-100 text-slate-600', error: 'bg-rose-100 text-rose-700',
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Developer Tool — Remove before production
          </p>
        </div>

        {/* ── Step 1: Create accounts ─────────────────────────────────────── */}
        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Step 1</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">Create test accounts</h2>
          <p className="mt-2 text-sm text-slate-600">
            Creates 4 Firebase Auth users and their Firestore profile documents. Safe to run multiple
            times — existing accounts are skipped.
          </p>

          {/* Credentials table */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Password</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TEST_ACCOUNTS.map((acct) => (
                  <tr key={acct.email}>
                    <td className="px-4 py-3 text-xs text-slate-600">{acct.label}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{acct.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{acct.password}</td>
                    <td className="px-4 py-3">
                      {accountStatus[acct.email] ? (
                        <div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${acctBadge[accountStatus[acct.email]] ?? ''}`}>
                            {accountStatus[acct.email]}
                          </span>
                          {accountErrors[acct.email] ? (
                            <p className="mt-1 text-xs text-rose-600">{accountErrors[acct.email]}</p>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {accountsDone && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              All accounts created. <a href="/login" className="underline">Go to Login →</a>
            </p>
          )}

          <button
            type="button"
            onClick={() => void createAccounts()}
            disabled={isCreatingAccounts}
            className="mt-5 w-full rounded-full bg-secondary px-6 py-3.5 text-sm font-bold text-slate-950 disabled:opacity-50"
          >
            {isCreatingAccounts ? 'Creating accounts…' : accountsDone ? 'Re-create Accounts' : 'Create All Test Accounts'}
          </button>
        </div>

        {/* ── Step 2: Seed Firestore data ─────────────────────────────────── */}
        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Step 2</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-950">Seed Firestore data</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in as the student account first, then click below to populate all collections.
            {user
              ? <> Signed in as <span className="font-semibold text-slate-900">{user.email}</span>.</>
              : <span className="font-semibold text-rose-600"> Not signed in yet.</span>
            }
          </p>

          {!user ? (
            <a
              href="/login?role=student"
              className="mt-5 block w-full rounded-full border border-slate-200 py-3.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Go to Login →
            </a>
          ) : (
            <>
              {steps.length > 0 && (
                <div className="mt-5 grid gap-2">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                      <span className={`font-bold ${stepColor[step.status]}`}>{stepIcon[step.status]}</span>
                      <span className="flex-1 text-sm text-slate-800">{step.label}</span>
                      {step.count !== undefined && step.status === 'done' && (
                        <span className="text-xs text-slate-400">{step.count} docs</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {done && (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  All data seeded.{' '}
                  <a href="/dashboard/student" className="underline">Open Student Dashboard →</a>
                </div>
              )}

              <button
                type="button"
                onClick={() => void runSeed()}
                disabled={isRunning}
                className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {isRunning ? 'Seeding Firestore…' : done ? 'Seed Again' : 'Seed Test Data'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
