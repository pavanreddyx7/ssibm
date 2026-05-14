import type { AttendanceRecord } from '../types/attendance.js'

// ─── Students ─────────────────────────────────────────────────────────────────
export const attendanceStudents = [
  // BCA
  { userId: 'std-bca-1', name: 'Priya Sharma',  rollNumber: 'BCA25-003', program: 'BCA', semester: 'Semester 1', section: 'Section A', parentUserId: 'parent-bca-1' },
  { userId: 'std-bca-2', name: 'Ravi Teja',     rollNumber: 'BCA24-011', program: 'BCA', semester: 'Semester 2', section: 'Section A', parentUserId: 'parent-bca-1' },
  { userId: 'std-bca-3', name: 'Kiran Kumar',   rollNumber: 'BCA23-025', program: 'BCA', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-bca-1' },
  { userId: 'std-bca-4', name: 'Aishwarya R',   rollNumber: 'BCA22-018', program: 'BCA', semester: 'Semester 4', section: 'Section A', parentUserId: 'parent-bca-4' },
  { userId: 'std-bca-5', name: 'Deepak M',      rollNumber: 'BCA21-007', program: 'BCA', semester: 'Semester 5', section: 'Section A', parentUserId: 'parent-bca-4' },

  // BBA
  { userId: 'std-bba-1', name: 'Sneha Patil',   rollNumber: 'BBA25-005', program: 'BBA', semester: 'Semester 1', section: 'Section A', parentUserId: 'parent-bba-2' },
  { userId: 'std-bba-2', name: 'Mahesh B',      rollNumber: 'BBA23-012', program: 'BBA', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-bba-2' },
  { userId: 'std-bba-3', name: 'Kavya R',       rollNumber: 'BBA23-017', program: 'BBA', semester: 'Semester 3', section: 'Section B', parentUserId: 'parent-bba-2' },
  { userId: 'std-bba-4', name: 'Suresh N',      rollNumber: 'BBA21-009', program: 'BBA', semester: 'Semester 5', section: 'Section A', parentUserId: 'parent-bba-2' },

  // B.Com
  { userId: 'std-bcom-1', name: 'Divya K',      rollNumber: 'BCOM25-006', program: 'B.Com', semester: 'Semester 1', section: 'Section A', parentUserId: 'parent-mcom-1' },
  { userId: 'std-bcom-2', name: 'Prasad T',     rollNumber: 'BCOM23-014', program: 'B.Com', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-mcom-1' },
  { userId: 'std-bcom-3', name: 'Lakshmi M',    rollNumber: 'BCOM23-019', program: 'B.Com', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-mcom-1' },
  { userId: 'std-bcom-4', name: 'Vijay S',      rollNumber: 'BCOM21-008', program: 'B.Com', semester: 'Semester 5', section: 'Section A', parentUserId: 'parent-mcom-1' },

  // M.Com
  { userId: 'std-mcom-1', name: 'Nandini K',    rollNumber: 'MCOM25-004', program: 'M.Com', semester: 'Semester 1', section: 'PG',       parentUserId: 'parent-mcom-1' },
  { userId: 'std-mcom-2', name: 'Supriya H',    rollNumber: 'MCOM25-007', program: 'M.Com', semester: 'Semester 1', section: 'PG',       parentUserId: 'parent-mcom-1' },
  { userId: 'std-mcom-3', name: 'Rakesh D',     rollNumber: 'MCOM24-003', program: 'M.Com', semester: 'Semester 2', section: 'PG',       parentUserId: 'parent-mcom-1' },
  { userId: 'std-mcom-4', name: 'Meena P',      rollNumber: 'MCOM24-009', program: 'M.Com', semester: 'Semester 2', section: 'PG',       parentUserId: 'parent-mcom-1' },

  // MSW
  { userId: 'std-msw-1', name: 'Arjun V',       rollNumber: 'MSW25-002',  program: 'MSW', semester: 'Semester 1', section: 'Section A', parentUserId: 'parent-mcom-1' },
  { userId: 'std-msw-2', name: 'Pooja L',       rollNumber: 'MSW23-008',  program: 'MSW', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-mcom-1' },
  { userId: 'std-msw-3', name: 'Rohith S',      rollNumber: 'MSW23-013',  program: 'MSW', semester: 'Semester 3', section: 'Section A', parentUserId: 'parent-mcom-1' },
]

// ─── Courses ──────────────────────────────────────────────────────────────────
export const attendanceCourses = [
  // ── BCA Semester 1 ──
  {
    code: 'BCA101', name: 'Computer Fundamentals',
    section: 'BCA - Semester 1 A', time: '9:00 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-1'],
  },
  {
    code: 'BCA102', name: 'Programming in C',
    section: 'BCA - Semester 1 A', time: '10:15 AM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-1'],
  },
  {
    code: 'BCA103', name: 'Mathematics for Computing',
    section: 'BCA - Semester 1 A', time: '11:30 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-1'],
  },

  // ── BCA Semester 2 ──
  {
    code: 'BCA201', name: 'Data Structures',
    section: 'BCA - Semester 2 A', time: '9:00 AM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-2'],
  },
  {
    code: 'BCA202', name: 'Database Management Systems',
    section: 'BCA - Semester 2 A', time: '10:15 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-2'],
  },
  {
    code: 'BCA203', name: 'Digital Electronics',
    section: 'BCA - Semester 2 A', time: '11:30 AM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-2'],
  },

  // ── BCA Semester 3 ──
  {
    code: 'BCA301', name: 'OOP with Java',
    section: 'BCA - Semester 3 A', time: '9:00 AM',
    facultyUserId: 'faculty-shalika',
    studentUserIds: ['std-bca-3'],
  },
  {
    code: 'BCA302', name: 'Operating Systems',
    section: 'BCA - Semester 3 A', time: '10:15 AM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-3'],
  },
  {
    code: 'BCA303', name: 'Computer Networks',
    section: 'BCA - Semester 3 A', time: '11:30 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-3'],
  },

  // ── BCA Semester 4 ──
  {
    code: 'BCA401', name: 'Software Engineering',
    section: 'BCA - Semester 4 A', time: '9:00 AM',
    facultyUserId: 'faculty-shalika',
    studentUserIds: ['std-bca-4'],
  },
  {
    code: 'BCA402', name: 'Database Systems Lab',
    section: 'BCA - Semester 4 A', time: '10:15 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-4'],
  },
  {
    code: 'BCA404', name: 'Web Technologies',
    section: 'BCA - Semester 4 A', time: '11:30 AM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-4'],
  },

  // ── BCA Semester 5 ──
  {
    code: 'BCA501', name: 'Mobile App Development',
    section: 'BCA - Semester 5 A', time: '9:00 AM',
    facultyUserId: 'faculty-shalika',
    studentUserIds: ['std-bca-5'],
  },
  {
    code: 'BCA502', name: 'Software Project Lab',
    section: 'BCA - Semester 5 A', time: '11:00 AM',
    facultyUserId: 'faculty-dhanya',
    studentUserIds: ['std-bca-5'],
  },
  {
    code: 'BCA503', name: 'Cloud Computing',
    section: 'BCA - Semester 5 A', time: '2:00 PM',
    facultyUserId: 'faculty-shivakumar',
    studentUserIds: ['std-bca-5'],
  },

  // ── BBA Semester 1 ──
  {
    code: 'BBA101', name: 'Principles of Management',
    section: 'BBA - Semester 1 A', time: '9:00 AM',
    facultyUserId: 'faculty-harsharadhya',
    studentUserIds: ['std-bba-1'],
  },
  {
    code: 'BBA102', name: 'Business Communication',
    section: 'BBA - Semester 1 A', time: '10:15 AM',
    facultyUserId: 'faculty-lakshmidevi',
    studentUserIds: ['std-bba-1'],
  },
  {
    code: 'BBA103', name: 'Financial Accounting',
    section: 'BBA - Semester 1 A', time: '11:30 AM',
    facultyUserId: 'faculty-jaisimha',
    studentUserIds: ['std-bba-1'],
  },

  // ── BBA Semester 3 ──
  {
    code: 'BBA301', name: 'Marketing Management',
    section: 'BBA - Semester 3 A', time: '9:00 AM',
    facultyUserId: 'faculty-harsharadhya',
    studentUserIds: ['std-bba-2', 'std-bba-3'],
  },
  {
    code: 'BBA302', name: 'Human Resource Management',
    section: 'BBA - Semester 3 A', time: '10:15 AM',
    facultyUserId: 'faculty-jaisimha',
    studentUserIds: ['std-bba-2', 'std-bba-3'],
  },
  {
    code: 'BBA303', name: 'Business Law',
    section: 'BBA - Semester 3 A', time: '11:30 AM',
    facultyUserId: 'faculty-lakshmidevi',
    studentUserIds: ['std-bba-2', 'std-bba-3'],
  },

  // ── BBA Semester 5 ──
  {
    code: 'BBA501', name: 'Strategic Management',
    section: 'BBA - Semester 5 A', time: '9:00 AM',
    facultyUserId: 'faculty-harsharadhya',
    studentUserIds: ['std-bba-4'],
  },
  {
    code: 'BBA502', name: 'Entrepreneurship Development',
    section: 'BBA - Semester 5 A', time: '11:00 AM',
    facultyUserId: 'faculty-jaisimha',
    studentUserIds: ['std-bba-4'],
  },

  // ── B.Com Semester 1 ──
  {
    code: 'BCOM101', name: 'Financial Accounting',
    section: 'B.Com - Semester 1 A', time: '9:00 AM',
    facultyUserId: 'faculty-muthuraj',
    studentUserIds: ['std-bcom-1'],
  },
  {
    code: 'BCOM102', name: 'Business Economics',
    section: 'B.Com - Semester 1 A', time: '10:15 AM',
    facultyUserId: 'faculty-pankaja',
    studentUserIds: ['std-bcom-1'],
  },
  {
    code: 'BCOM103', name: 'Business Communication',
    section: 'B.Com - Semester 1 A', time: '11:30 AM',
    facultyUserId: 'faculty-sagar',
    studentUserIds: ['std-bcom-1'],
  },

  // ── B.Com Semester 3 ──
  {
    code: 'BCOM301', name: 'Cost Accounting',
    section: 'B.Com - Semester 3 A', time: '9:00 AM',
    facultyUserId: 'faculty-muthuraj',
    studentUserIds: ['std-bcom-2', 'std-bcom-3'],
  },
  {
    code: 'BCOM302', name: 'Income Tax',
    section: 'B.Com - Semester 3 A', time: '10:15 AM',
    facultyUserId: 'faculty-sagar',
    studentUserIds: ['std-bcom-2', 'std-bcom-3'],
  },
  {
    code: 'BCOM303', name: 'Auditing and Assurance',
    section: 'B.Com - Semester 3 A', time: '11:30 AM',
    facultyUserId: 'faculty-pankaja',
    studentUserIds: ['std-bcom-2', 'std-bcom-3'],
  },

  // ── B.Com Semester 5 ──
  {
    code: 'BCOM501', name: 'Advanced Accounting',
    section: 'B.Com - Semester 5 A', time: '9:00 AM',
    facultyUserId: 'faculty-muthuraj',
    studentUserIds: ['std-bcom-4'],
  },
  {
    code: 'BCOM502', name: 'Financial Management',
    section: 'B.Com - Semester 5 A', time: '11:00 AM',
    facultyUserId: 'faculty-sagar',
    studentUserIds: ['std-bcom-4'],
  },

  // ── M.Com Semester 1 ──
  {
    code: 'MCOM101', name: 'Advanced Accounting',
    section: 'M.Com - Semester 1', time: '9:00 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-1', 'std-mcom-2'],
  },
  {
    code: 'MCOM102', name: 'Research Methodology',
    section: 'M.Com - Semester 1', time: '10:15 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-1', 'std-mcom-2'],
  },
  {
    code: 'MCOM103', name: 'Business Statistics',
    section: 'M.Com - Semester 1', time: '11:30 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-1', 'std-mcom-2'],
  },

  // ── M.Com Semester 2 ──
  {
    code: 'MCOM201', name: 'Corporate Accounting',
    section: 'M.Com - Semester 2', time: '9:00 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-3', 'std-mcom-4'],
  },
  {
    code: 'MCOM202', name: 'Financial Management',
    section: 'M.Com - Semester 2', time: '10:15 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-3', 'std-mcom-4'],
  },
  {
    code: 'MCOM203', name: 'Taxation Law',
    section: 'M.Com - Semester 2', time: '11:30 AM',
    facultyUserId: 'faculty-chidananda',
    studentUserIds: ['std-mcom-3', 'std-mcom-4'],
  },

  // ── MSW Semester 1 ──
  {
    code: 'MSW101', name: 'Introduction to Social Work',
    section: 'MSW - Semester 1', time: '9:00 AM',
    facultyUserId: 'faculty-guruprasad',
    studentUserIds: ['std-msw-1'],
  },
  {
    code: 'MSW102', name: 'Community Development',
    section: 'MSW - Semester 1', time: '10:15 AM',
    facultyUserId: 'faculty-raghu',
    studentUserIds: ['std-msw-1'],
  },

  // ── MSW Semester 3 ──
  {
    code: 'MSW301', name: 'Social Work Methods',
    section: 'MSW - Semester 3', time: '9:00 AM',
    facultyUserId: 'faculty-guruprasad',
    studentUserIds: ['std-msw-2', 'std-msw-3'],
  },
  {
    code: 'MSW302', name: 'Field Work Practice',
    section: 'MSW - Semester 3', time: '11:00 AM',
    facultyUserId: 'faculty-raghu',
    studentUserIds: ['std-msw-2', 'std-msw-3'],
  },
]

// ─── Notices ──────────────────────────────────────────────────────────────────
export const facultyNotices = [
  'Weekly attendance submission closes Friday at 5:00 PM.',
  'Placement orientation for final-year students starts tomorrow.',
  'Upload internal assessment marks before May 15.',
]

// ─── Student timetables ───────────────────────────────────────────────────────
export const studentSchedule: Record<string, { title: string; slot: string; room: string }[]> = {
  'std-bca-1': [
    { title: 'Computer Fundamentals', slot: '9:00 AM - 10:00 AM',   room: 'Room 101' },
    { title: 'Programming in C',      slot: '10:15 AM - 11:15 AM',  room: 'Lab 1'    },
    { title: 'Maths for Computing',   slot: '11:30 AM - 12:30 PM',  room: 'Room 101' },
  ],
  'std-bca-2': [
    { title: 'Data Structures',       slot: '9:00 AM - 10:00 AM',   room: 'Lab 1'    },
    { title: 'DBMS',                  slot: '10:15 AM - 11:15 AM',  room: 'Lab 2'    },
    { title: 'Digital Electronics',   slot: '11:30 AM - 12:30 PM',  room: 'Room 102' },
  ],
  'std-bca-3': [
    { title: 'OOP with Java',         slot: '9:00 AM - 10:00 AM',   room: 'Lab 2'    },
    { title: 'Operating Systems',     slot: '10:15 AM - 11:15 AM',  room: 'Room 201' },
    { title: 'Computer Networks',     slot: '11:30 AM - 12:30 PM',  room: 'Room 202' },
  ],
  'std-bca-4': [
    { title: 'Software Engineering',  slot: '9:00 AM - 10:00 AM',   room: 'Room 203' },
    { title: 'Database Systems Lab',  slot: '10:15 AM - 11:15 AM',  room: 'Lab 2'    },
    { title: 'Web Technologies',      slot: '11:30 AM - 12:30 PM',  room: 'Lab 1'    },
  ],
  'std-bca-5': [
    { title: 'Mobile App Dev',        slot: '9:00 AM - 10:00 AM',   room: 'Lab 3'    },
    { title: 'Software Project Lab',  slot: '11:00 AM - 1:00 PM',   room: 'Lab 2'    },
    { title: 'Cloud Computing',       slot: '2:00 PM - 3:00 PM',    room: 'Room 204' },
  ],
  'std-bba-1': [
    { title: 'Principles of Mgmt',   slot: '9:00 AM - 10:00 AM',   room: 'Room 301' },
    { title: 'Business Communication',slot: '10:15 AM - 11:15 AM', room: 'Room 302' },
    { title: 'Financial Accounting',  slot: '11:30 AM - 12:30 PM',  room: 'Room 301' },
  ],
  'std-bba-2': [
    { title: 'Marketing Management',  slot: '9:00 AM - 10:00 AM',   room: 'Room 303' },
    { title: 'HRM',                   slot: '10:15 AM - 11:15 AM',  room: 'Room 303' },
    { title: 'Business Law',          slot: '11:30 AM - 12:30 PM',  room: 'Room 304' },
  ],
  'std-bba-3': [
    { title: 'Marketing Management',  slot: '9:00 AM - 10:00 AM',   room: 'Room 303' },
    { title: 'HRM',                   slot: '10:15 AM - 11:15 AM',  room: 'Room 303' },
    { title: 'Business Law',          slot: '11:30 AM - 12:30 PM',  room: 'Room 304' },
  ],
  'std-bba-4': [
    { title: 'Strategic Management',  slot: '9:00 AM - 10:00 AM',   room: 'Room 305' },
    { title: 'Entrepreneurship',      slot: '11:00 AM - 12:00 PM',  room: 'Seminar Hall' },
  ],
  'std-bcom-1': [
    { title: 'Financial Accounting',  slot: '9:00 AM - 10:00 AM',   room: 'Room 401' },
    { title: 'Business Economics',    slot: '10:15 AM - 11:15 AM',  room: 'Room 401' },
    { title: 'Business Communication',slot: '11:30 AM - 12:30 PM',  room: 'Room 402' },
  ],
  'std-bcom-2': [
    { title: 'Cost Accounting',       slot: '9:00 AM - 10:00 AM',   room: 'Room 403' },
    { title: 'Income Tax',            slot: '10:15 AM - 11:15 AM',  room: 'Room 403' },
    { title: 'Auditing',              slot: '11:30 AM - 12:30 PM',  room: 'Room 404' },
  ],
  'std-bcom-3': [
    { title: 'Cost Accounting',       slot: '9:00 AM - 10:00 AM',   room: 'Room 403' },
    { title: 'Income Tax',            slot: '10:15 AM - 11:15 AM',  room: 'Room 403' },
    { title: 'Auditing',              slot: '11:30 AM - 12:30 PM',  room: 'Room 404' },
  ],
  'std-bcom-4': [
    { title: 'Advanced Accounting',   slot: '9:00 AM - 10:00 AM',   room: 'Room 405' },
    { title: 'Financial Management',  slot: '11:00 AM - 12:00 PM',  room: 'Room 405' },
  ],
  'std-mcom-1': [
    { title: 'Advanced Accounting',   slot: '9:00 AM - 10:00 AM',   room: 'PG Block 1' },
    { title: 'Research Methodology',  slot: '10:15 AM - 11:15 AM',  room: 'PG Block 1' },
    { title: 'Business Statistics',   slot: '11:30 AM - 12:30 PM',  room: 'PG Block 2' },
  ],
  'std-mcom-2': [
    { title: 'Advanced Accounting',   slot: '9:00 AM - 10:00 AM',   room: 'PG Block 1' },
    { title: 'Research Methodology',  slot: '10:15 AM - 11:15 AM',  room: 'PG Block 1' },
    { title: 'Business Statistics',   slot: '11:30 AM - 12:30 PM',  room: 'PG Block 2' },
  ],
  'std-mcom-3': [
    { title: 'Corporate Accounting',  slot: '9:00 AM - 10:00 AM',   room: 'PG Block 1' },
    { title: 'Financial Management',  slot: '10:15 AM - 11:15 AM',  room: 'PG Block 2' },
    { title: 'Taxation Law',          slot: '11:30 AM - 12:30 PM',  room: 'PG Block 1' },
  ],
  'std-mcom-4': [
    { title: 'Corporate Accounting',  slot: '9:00 AM - 10:00 AM',   room: 'PG Block 1' },
    { title: 'Financial Management',  slot: '10:15 AM - 11:15 AM',  room: 'PG Block 2' },
    { title: 'Taxation Law',          slot: '11:30 AM - 12:30 PM',  room: 'PG Block 1' },
  ],
  'std-msw-1': [
    { title: 'Intro to Social Work',  slot: '9:00 AM - 10:00 AM',   room: 'SW Block 1' },
    { title: 'Community Development', slot: '10:15 AM - 11:15 AM',  room: 'SW Block 1' },
  ],
  'std-msw-2': [
    { title: 'Social Work Methods',   slot: '9:00 AM - 10:00 AM',   room: 'SW Block 2' },
    { title: 'Field Work Practice',   slot: '11:00 AM - 1:00 PM',   room: 'Field' },
  ],
  'std-msw-3': [
    { title: 'Social Work Methods',   slot: '9:00 AM - 10:00 AM',   room: 'SW Block 2' },
    { title: 'Field Work Practice',   slot: '11:00 AM - 1:00 PM',   room: 'Field' },
  ],
}

// ─── Seed attendance records ──────────────────────────────────────────────────
export const seedAttendanceRecords: AttendanceRecord[] = [
  // BCA-1 Priya
  { id: 'att-bca1-1', studentUserId: 'std-bca-1', courseCode: 'BCA101', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-dhanya' },
  { id: 'att-bca1-2', studentUserId: 'std-bca-1', courseCode: 'BCA102', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca1-3', studentUserId: 'std-bca-1', courseCode: 'BCA101', date: '2026-05-06', status: 'absent',  markedByUserId: 'faculty-dhanya' },
  { id: 'att-bca1-4', studentUserId: 'std-bca-1', courseCode: 'BCA102', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca1-5', studentUserId: 'std-bca-1', courseCode: 'BCA103', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-dhanya' },

  // BCA-2 Ravi
  { id: 'att-bca2-1', studentUserId: 'std-bca-2', courseCode: 'BCA201', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca2-2', studentUserId: 'std-bca-2', courseCode: 'BCA202', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-dhanya' },
  { id: 'att-bca2-3', studentUserId: 'std-bca-2', courseCode: 'BCA201', date: '2026-05-06', status: 'late',    markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca2-4', studentUserId: 'std-bca-2', courseCode: 'BCA202', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-dhanya' },

  // BCA-3 Kiran
  { id: 'att-bca3-1', studentUserId: 'std-bca-3', courseCode: 'BCA301', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-shalika' },
  { id: 'att-bca3-2', studentUserId: 'std-bca-3', courseCode: 'BCA302', date: '2026-05-05', status: 'absent',  markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca3-3', studentUserId: 'std-bca-3', courseCode: 'BCA301', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-shalika' },
  { id: 'att-bca3-4', studentUserId: 'std-bca-3', courseCode: 'BCA303', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-dhanya' },

  // BCA-4 Aishwarya
  { id: 'att-bca4-1', studentUserId: 'std-bca-4', courseCode: 'BCA401', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-shalika' },
  { id: 'att-bca4-2', studentUserId: 'std-bca-4', courseCode: 'BCA402', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-dhanya' },
  { id: 'att-bca4-3', studentUserId: 'std-bca-4', courseCode: 'BCA404', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-shivakumar' },
  { id: 'att-bca4-4', studentUserId: 'std-bca-4', courseCode: 'BCA401', date: '2026-05-07', status: 'absent',  markedByUserId: 'faculty-shalika' },

  // BCA-5 Deepak
  { id: 'att-bca5-1', studentUserId: 'std-bca-5', courseCode: 'BCA501', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-shalika' },
  { id: 'att-bca5-2', studentUserId: 'std-bca-5', courseCode: 'BCA502', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-dhanya' },
  { id: 'att-bca5-3', studentUserId: 'std-bca-5', courseCode: 'BCA503', date: '2026-05-07', status: 'late',    markedByUserId: 'faculty-shivakumar' },

  // BBA students
  { id: 'att-bba1-1', studentUserId: 'std-bba-1', courseCode: 'BBA101', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-harsharadhya' },
  { id: 'att-bba1-2', studentUserId: 'std-bba-1', courseCode: 'BBA102', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-lakshmidevi' },
  { id: 'att-bba1-3', studentUserId: 'std-bba-1', courseCode: 'BBA103', date: '2026-05-07', status: 'absent',  markedByUserId: 'faculty-jaisimha' },
  { id: 'att-bba2-1', studentUserId: 'std-bba-2', courseCode: 'BBA301', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-harsharadhya' },
  { id: 'att-bba2-2', studentUserId: 'std-bba-2', courseCode: 'BBA302', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-jaisimha' },
  { id: 'att-bba3-1', studentUserId: 'std-bba-3', courseCode: 'BBA301', date: '2026-05-05', status: 'absent',  markedByUserId: 'faculty-harsharadhya' },
  { id: 'att-bba3-2', studentUserId: 'std-bba-3', courseCode: 'BBA302', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-jaisimha' },
  { id: 'att-bba4-1', studentUserId: 'std-bba-4', courseCode: 'BBA501', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-harsharadhya' },
  { id: 'att-bba4-2', studentUserId: 'std-bba-4', courseCode: 'BBA502', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-jaisimha' },

  // B.Com students
  { id: 'att-bc1-1', studentUserId: 'std-bcom-1', courseCode: 'BCOM101', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-muthuraj' },
  { id: 'att-bc1-2', studentUserId: 'std-bcom-1', courseCode: 'BCOM102', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-pankaja' },
  { id: 'att-bc2-1', studentUserId: 'std-bcom-2', courseCode: 'BCOM301', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-muthuraj' },
  { id: 'att-bc2-2', studentUserId: 'std-bcom-2', courseCode: 'BCOM302', date: '2026-05-06', status: 'late',    markedByUserId: 'faculty-sagar' },
  { id: 'att-bc3-1', studentUserId: 'std-bcom-3', courseCode: 'BCOM301', date: '2026-05-05', status: 'absent',  markedByUserId: 'faculty-muthuraj' },
  { id: 'att-bc3-2', studentUserId: 'std-bcom-3', courseCode: 'BCOM303', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-pankaja' },
  { id: 'att-bc4-1', studentUserId: 'std-bcom-4', courseCode: 'BCOM501', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-muthuraj' },
  { id: 'att-bc4-2', studentUserId: 'std-bcom-4', courseCode: 'BCOM502', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-sagar' },

  // M.Com students
  { id: 'att-mc1-1', studentUserId: 'std-mcom-1', courseCode: 'MCOM101', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc1-2', studentUserId: 'std-mcom-1', courseCode: 'MCOM102', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc2-1', studentUserId: 'std-mcom-2', courseCode: 'MCOM101', date: '2026-05-05', status: 'absent',  markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc2-2', studentUserId: 'std-mcom-2', courseCode: 'MCOM103', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc3-1', studentUserId: 'std-mcom-3', courseCode: 'MCOM201', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc3-2', studentUserId: 'std-mcom-3', courseCode: 'MCOM202', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc4-1', studentUserId: 'std-mcom-4', courseCode: 'MCOM201', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-chidananda' },
  { id: 'att-mc4-2', studentUserId: 'std-mcom-4', courseCode: 'MCOM203', date: '2026-05-07', status: 'late',    markedByUserId: 'faculty-chidananda' },

  // MSW students
  { id: 'att-msw1-1', studentUserId: 'std-msw-1', courseCode: 'MSW101', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-guruprasad' },
  { id: 'att-msw1-2', studentUserId: 'std-msw-1', courseCode: 'MSW102', date: '2026-05-06', status: 'present', markedByUserId: 'faculty-raghu' },
  { id: 'att-msw2-1', studentUserId: 'std-msw-2', courseCode: 'MSW301', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-guruprasad' },
  { id: 'att-msw2-2', studentUserId: 'std-msw-2', courseCode: 'MSW302', date: '2026-05-07', status: 'absent',  markedByUserId: 'faculty-raghu' },
  { id: 'att-msw3-1', studentUserId: 'std-msw-3', courseCode: 'MSW301', date: '2026-05-05', status: 'present', markedByUserId: 'faculty-guruprasad' },
  { id: 'att-msw3-2', studentUserId: 'std-msw-3', courseCode: 'MSW302', date: '2026-05-07', status: 'present', markedByUserId: 'faculty-raghu' },
]
