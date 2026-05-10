export type StudentProfile = {
  uid: string
  name: string
  email: string
  phone: string
  rollNumber: string
  course: string
  semester: string
  section: string
  dob: string
  address: string
  parentPhone: string
  photoURL?: string
}

export type AttendanceRecord = {
  id: string
  courseCode: string
  courseName: string
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
}

export type AttendanceSummary = {
  courseCode: string
  courseName: string
  total: number
  present: number
  percentage: number
}

export type TimetableSlot = {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  time: string
  subject: string
  room: string
  faculty: string
}

export type MarksRecord = {
  id: string
  subject: string
  courseCode: string
  internal: number
  maxInternal: number
  external: number
  maxExternal: number
  total: number
  maxTotal: number
  grade: string
  semester: string
  published?: boolean
  internal1?: number
  internal2?: number
  internal3?: number
}

export type FeeTransaction = {
  id: string
  date: string
  amount: number
  method: string
  receiptNo: string
}

export type FeeRecord = {
  totalFee: number
  paidAmount: number
  dueAmount: number
  dueDate: string
  status: 'paid' | 'partial' | 'unpaid'
  transactions: FeeTransaction[]
}

export type Assignment = {
  id: string
  courseCode: string
  courseName: string
  title: string
  description: string
  dueDate: string
  maxMarks: number
  submitted: boolean
  submittedAt?: string
  obtainedMarks?: number
}

export type StudyMaterial = {
  id: string
  courseCode: string
  courseName: string
  title: string
  type: 'pdf' | 'video' | 'doc' | 'link'
  url: string
  description: string
  uploadedAt: string
}

export type Complaint = {
  id: string
  subject: string
  category: string
  description: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  response?: string
  adminResponse?: string
}

export type Notice = {
  id: string
  title: string
  content: string
  targetAudience: string
  createdByName: string
  createdAt: string
}
