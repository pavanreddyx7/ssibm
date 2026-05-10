export const facultyDashboardData = {
  assignedCourses: [
    { code: 'BBA301', name: 'Principles of Management', section: 'BBA - Sem 3 A', time: '9:30 AM' },
    { code: 'BCA502', name: 'Software Project Lab', section: 'BCA - Sem 5 B', time: '11:30 AM' },
    { code: 'MCOM201', name: 'Corporate Accounting', section: 'M.Com - Sem 2', time: '2:00 PM' },
  ],
  todaySummary: {
    sessions: 3,
    students: 128,
    attendancePending: 1,
  },
  notices: [
    'Weekly attendance submission closes Friday at 5:00 PM.',
    'Placement orientation for final-year students starts tomorrow.',
    'Upload internal assessment marks before May 15.',
  ],
}

export const studentDashboardData = {
  profile: {
    rollNumber: 'BCA24-018',
    program: 'BCA',
    semester: 'Semester 4',
    section: 'Section A',
  },
  attendance: {
    overallPercentage: 86,
    requiredPercentage: 75,
    subjects: [
      { name: 'Data Structures', percentage: 84 },
      { name: 'Database Systems', percentage: 89 },
      { name: 'Web Technologies', percentage: 85 },
    ],
  },
  schedule: [
    { title: 'Database Systems', slot: '10:00 AM - 11:00 AM', room: 'Lab 2' },
    { title: 'Web Technologies', slot: '11:15 AM - 12:15 PM', room: 'Room 204' },
    { title: 'Aptitude Training', slot: '2:00 PM - 3:00 PM', room: 'Seminar Hall' },
  ],
  feeStatus: {
    status: 'Partially Paid',
    dueAmount: '₹12,500',
    nextDueDate: 'May 20, 2026',
  },
}

export const parentDashboardData = {
  child: {
    name: 'Student User',
    rollNumber: 'BCA24-018',
    program: 'BCA',
    semester: 'Semester 4',
  },
  attendance: {
    overallPercentage: 86,
    alert: 'Safe',
    recentAbsences: 1,
  },
  notifications: [
    'Attendance remains above the 75% requirement.',
    'Internal assessment meeting scheduled for next week.',
    'Fee reminder generated for the current term balance.',
  ],
  contact: {
    mentor: 'Prof Nisha P',
    officePhone: '+91 9742689866',
    officeEmail: 'principal.ssibm2006@gmail.com',
  },
}
