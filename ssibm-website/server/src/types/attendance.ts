export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave'

export type AttendanceRecord = {
  id: string
  studentUserId: string
  courseCode: string
  date: string
  status: AttendanceStatus
  markedByUserId: string
  remarks?: string
}
