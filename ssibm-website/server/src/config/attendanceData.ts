import type { AttendanceRecord } from '../types/attendance.js'

export const attendanceStudents = [
  {
    userId: 'student-1',
    name: 'Student User',
    rollNumber: 'BCA24-018',
    program: 'BCA',
    semester: 'Semester 4',
    section: 'Section A',
    parentUserId: 'parent-1',
  },
  {
    userId: 'student-2',
    name: 'Aishwarya R',
    rollNumber: 'BCA24-021',
    program: 'BCA',
    semester: 'Semester 4',
    section: 'Section A',
    parentUserId: 'parent-2',
  },
  {
    userId: 'student-3',
    name: 'Rahul M',
    rollNumber: 'BCA24-026',
    program: 'BCA',
    semester: 'Semester 4',
    section: 'Section A',
    parentUserId: 'parent-3',
  },
  {
    userId: 'student-4',
    name: 'Nandini K',
    rollNumber: 'MCOM25-004',
    program: 'M.Com',
    semester: 'Semester 2',
    section: 'PG',
    parentUserId: 'parent-4',
  },
] as const

export const attendanceCourses = [
  {
    code: 'BCA402',
    name: 'Database Systems',
    section: 'BCA - Semester 4 A',
    time: '10:00 AM',
    facultyUserId: 'faculty-1',
    studentUserIds: ['student-1', 'student-2', 'student-3'],
  },
  {
    code: 'BCA404',
    name: 'Web Technologies',
    section: 'BCA - Semester 4 A',
    time: '11:15 AM',
    facultyUserId: 'faculty-1',
    studentUserIds: ['student-1', 'student-2', 'student-3'],
  },
  {
    code: 'MCOM201',
    name: 'Corporate Accounting',
    section: 'M.Com - Semester 2',
    time: '2:00 PM',
    facultyUserId: 'faculty-1',
    studentUserIds: ['student-4'],
  },
] as const

export const facultyNotices = [
  'Weekly attendance submission closes Friday at 5:00 PM.',
  'Placement orientation for final-year students starts tomorrow.',
  'Upload internal assessment marks before May 15.',
]

export const studentSchedule = {
  'student-1': [
    { title: 'Database Systems', slot: '10:00 AM - 11:00 AM', room: 'Lab 2' },
    { title: 'Web Technologies', slot: '11:15 AM - 12:15 PM', room: 'Room 204' },
    { title: 'Aptitude Training', slot: '2:00 PM - 3:00 PM', room: 'Seminar Hall' },
  ],
} as const

export const seedAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentUserId: 'student-1',
    courseCode: 'BCA402',
    date: '2026-05-05',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-2',
    studentUserId: 'student-2',
    courseCode: 'BCA402',
    date: '2026-05-05',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-3',
    studentUserId: 'student-3',
    courseCode: 'BCA402',
    date: '2026-05-05',
    status: 'absent',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-4',
    studentUserId: 'student-1',
    courseCode: 'BCA404',
    date: '2026-05-06',
    status: 'late',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-5',
    studentUserId: 'student-2',
    courseCode: 'BCA404',
    date: '2026-05-06',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-6',
    studentUserId: 'student-3',
    courseCode: 'BCA404',
    date: '2026-05-06',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-7',
    studentUserId: 'student-1',
    courseCode: 'BCA402',
    date: '2026-05-07',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-8',
    studentUserId: 'student-2',
    courseCode: 'BCA402',
    date: '2026-05-07',
    status: 'present',
    markedByUserId: 'faculty-1',
  },
  {
    id: 'att-9',
    studentUserId: 'student-3',
    courseCode: 'BCA402',
    date: '2026-05-07',
    status: 'leave',
    markedByUserId: 'faculty-1',
  },
]
