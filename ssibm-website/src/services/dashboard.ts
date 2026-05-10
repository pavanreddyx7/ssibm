import { api } from './api'

export async function fetchFacultyDashboard() {
  return api.get<{
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
          status: 'present' | 'absent' | 'late' | 'leave' | null
        }>
      }>
      todaySummary: { sessions: number; students: number; attendancePending: number }
      notices: string[]
      activeDate: string
    }
  }>('/dashboard/faculty')
}

export async function fetchStudentDashboard() {
  return api.get<{
    success: boolean
    user: { id: string; role: 'student'; name: string; email: string }
    data: {
      profile: { rollNumber: string; program: string; semester: string; section: string }
      attendance: {
        overallPercentage: number
        requiredPercentage: number
        subjects: Array<{ name: string; percentage: number }>
      }
      schedule: Array<{ title: string; slot: string; room: string }>
      feeStatus: { status: string; dueAmount: string; nextDueDate: string }
    }
  }>('/dashboard/student')
}

export async function submitAttendanceMarking(payload: {
  facultyUid: string
  courseCode: string
  date: string
  entries: Array<{
    studentUserId: string
    status: 'present' | 'absent' | 'late' | 'leave'
  }>
}) {
  return api.post<{
    success: boolean
    updatedCount: number
  }>('/attendance/mark', payload)
}
