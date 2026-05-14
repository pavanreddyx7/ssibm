export type FacultyProfile = {
  uid: string
  name: string
  email: string
  phone: string
  employeeId: string
  department: string
  designation: string
  qualification: string
  experience: string
  specialization: string
  joiningDate: string
  photoURL?: string
}

export type SubjectAllocation = {
  id: string
  courseCode: string
  courseName: string
  course: string
  semester: string
  section: string
  totalStudents: number
}

export type FacultyTimetableSlot = {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  time: string
  subject: string
  courseCode: string
  room: string
  course: string
  semester: string
  section: string
}

export type ClassStudent = {
  uid: string
  name: string
  rollNumber: string
  status: 'present' | 'absent' | 'late' | 'leave' | null
}

export type AttendanceEntry = {
  studentUid: string
  status: 'present' | 'absent' | 'late' | 'leave'
}

export type AttendanceSession = {
  id: string
  courseCode: string
  courseName: string
  section: string
  date: string
  totalStudents: number
  presentCount: number
  absentCount: number
  markedBy: string
  markedAt: string
}

export type StudentMarkEntry = {
  uid: string
  rollNumber: string
  name: string
  internal1: number | null
  internal2: number | null
  internal3: number | null
  assignment: number | null
  lab: number | null
  semester: number | null
  maxInternal: number
  maxAssignment: number
  maxLab: number
}

export type ReEvaluationRequest = {
  id: string
  studentUid: string
  studentName: string
  rollNumber: string
  courseCode: string
  subject: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  response?: string
}

export type MenteeStudent = {
  uid: string
  name: string
  rollNumber: string
  course: string
  semester: string
  attendancePercentage: number
  cgpa: string
  issues: string[]
}

export type LeaveRequest = {
  id: string
  type: 'casual' | 'medical' | 'duty' | 'earned'
  from: string
  to: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  appliedAt: string
  response?: string
}

export type LeaveBalance = {
  casual: number
  medical: number
  duty: number
  earned: number
}

export type FacultyNotification = {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success' | 'alert'
  read: boolean
  createdAt: string
}

export type Notice = {
  id: string
  title: string
  content: string
  targetAudience: string
  targetCourse?: string
  createdAt: string
  createdBy: string
  createdByName: string
}

export type Message = {
  id: string
  fromUid: string
  fromName: string
  toUid: string
  toName: string
  subject: string
  body: string
  read: boolean
  sentAt: string
}

export type QuizAssignment = {
  id: string
  courseCode: string
  courseName: string
  title: string
  description: string
  type: 'quiz' | 'assignment' | 'lab'
  dueDate: string
  totalMarks: number
  submissionCount: number
  totalStudents: number
  createdAt: string
}

export type StudyUpload = {
  id: string
  courseCode: string
  courseName: string
  title: string
  type: 'pdf' | 'video' | 'doc' | 'link'
  url: string
  description: string
  uploadedAt: string
}

export type PaySlip = {
  id: string
  month: string
  year: string
  basic: number
  hra: number
  da: number
  ta: number
  pf: number
  tax: number
  gross: number
  net: number
}
