export type AdminStudent = {
  id: string
  name: string
  email: string
  role: 'student'
  rollNumber: string
  department: string
  semester: number
  batch: string
  phone: string
  address?: string
  guardianName?: string
  guardianPhone?: string
  dob?: string
  joiningDate?: string
  isActive?: boolean
}

export type AdminFaculty = {
  id: string
  name: string
  email: string
  role: 'faculty'
  employeeId: string
  department: string
  designation: string
  phone: string
  qualification?: string
  specialization?: string
  joiningDate?: string
  isActive?: boolean
}

export type AdminAllocation = {
  id: string
  facultyId: string
  facultyName: string
  subject: string
  subjectCode: string
  department: string
  semester: number
  batch: string
  academicYear: string
}

export type AdminComplaint = {
  id: string
  studentId: string
  studentName: string
  category: string
  subject: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  adminResponse?: string
  createdAt: string
  updatedAt: string
}

export type AdminApplication = {
  id: string
  applicantName: string
  email: string
  phone: string
  course: string
  dateOfBirth?: string
  city?: string
  state?: string
  address?: string
  previousQualification?: string
  percentage?: number
  documentsConfirmed?: boolean
  consentToContact?: boolean
  referenceId?: string
  status: 'pending' | 'under-review' | 'accepted' | 'rejected' | 'waitlisted'
  reviewNotes?: string
  submittedAt: string
  updatedAt?: string
}

export type AdminFeeRecord = {
  id: string
  studentId: string
  studentName?: string
  rollNumber?: string
  semester: number
  totalAmount: number
  paidAmount: number
  dueDate: string
  status: 'pending' | 'partial' | 'paid' | 'overdue'
  lastPaymentDate?: string
}

export type AdminMarkRecord = {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  subject: string
  subjectCode: string
  semester: number
  internalMarks: number
  externalMarks: number
  totalMarks: number
  maxMarks: number
  grade: string
  published?: boolean
}

export type AdminAttendanceRecord = {
  id: string
  studentId: string
  studentName?: string
  subject: string
  subjectCode: string
  totalClasses: number
  attended: number
  percentage: number
}

export type BroadcastNotice = {
  id: string
  title: string
  content: string
  targetAudience: 'all' | 'students' | 'faculty'
  issuedBy: string
  issuedAt: string
  expiresAt?: string
  isPinned: boolean
}

export type AdminStats = {
  totalStudents: number
  totalFaculty: number
  pendingComplaints: number
  pendingFees: number
  totalApplications: number
  activeNotices: number
}
