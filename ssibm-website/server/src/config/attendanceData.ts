import type { AttendanceRecord } from '../types/attendance.js'

export const attendanceStudents: Array<{
  userId: string
  name: string
  rollNumber: string
  program: string
  semester: string
  section: string
  parentUserId: string
}> = []

export const attendanceCourses: Array<{
  code: string
  name: string
  section: string
  time: string
  facultyUserId: string
  studentUserIds: string[]
}> = []

export const facultyNotices: string[] = []

export const studentSchedule: Record<string, string[]> = {}

export const seedAttendanceRecords: AttendanceRecord[] = []
