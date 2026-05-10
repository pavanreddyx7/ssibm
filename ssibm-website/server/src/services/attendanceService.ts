import { randomUUID } from 'node:crypto'
import {
  attendanceCourses,
  attendanceStudents,
  facultyNotices,
  studentSchedule,
} from '../config/attendanceData.js'
import { readDatabase, updateDatabase } from '../db/database.js'
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance.js'
import { appendNotifications, listNotificationsForParent } from './notificationService.js'

export async function getFacultyAttendanceOverview(userId: string) {
  const database = await readDatabase()
  const today = getTodayDate()
  const assignedCourses = attendanceCourses
    .filter((course) => course.facultyUserId === userId)
    .map((course) => ({
      code: course.code,
      name: course.name,
      section: course.section,
      time: course.time,
      roster: course.studentUserIds.map((studentUserId) => {
        const student = attendanceStudents.find((candidate) => candidate.userId === studentUserId)
        const todayRecord = database.attendanceRecords.find(
          (record) =>
            record.courseCode === course.code &&
            record.studentUserId === studentUserId &&
            record.date === today,
        )

        return {
          studentUserId,
          name: student?.name ?? studentUserId,
          rollNumber: student?.rollNumber ?? '',
          status: todayRecord?.status ?? null,
        }
      }),
    }))

  const totalStudents = new Set(
    assignedCourses.flatMap((course) => course.roster.map((student) => student.studentUserId)),
  ).size

  const attendancePending = assignedCourses.filter((course) =>
    course.roster.some((student) => student.status === null),
  ).length

  return {
    assignedCourses,
    todaySummary: {
      sessions: assignedCourses.length,
      students: totalStudents,
      attendancePending,
    },
    notices: facultyNotices,
    activeDate: today,
  }
}

export async function markAttendance(input: {
  facultyUserId: string
  courseCode: string
  date: string
  entries: Array<{ studentUserId: string; status: AttendanceStatus }>
}) {
  const updatedDatabase = await updateDatabase((database) => {
    const filtered = database.attendanceRecords.filter(
      (record) =>
        !(
          record.courseCode === input.courseCode &&
          record.date === input.date &&
          input.entries.some((entry) => entry.studentUserId === record.studentUserId)
        ),
    )

    const nextRecords: AttendanceRecord[] = input.entries.map((entry) => ({
      id: randomUUID(),
      studentUserId: entry.studentUserId,
      courseCode: input.courseCode,
      date: input.date,
      status: entry.status,
      markedByUserId: input.facultyUserId,
    }))

    return {
      ...database,
      attendanceRecords: [...filtered, ...nextRecords],
    }
  })

  const notifications = input.entries.flatMap((entry) => {
    const student = attendanceStudents.find((candidate) => candidate.userId === entry.studentUserId)
    if (!student) return []

    const nextNotifications: Array<{
      studentUserId: string
      parentUserId?: string
      courseCode?: string
      type: 'absent_alert' | 'low_attendance' | 'attendance_saved'
      channel: 'system'
      message: string
      status: 'sent'
    }> = []

    if (entry.status === 'absent') {
      nextNotifications.push({
        studentUserId: student.userId,
        parentUserId: student.parentUserId,
        courseCode: input.courseCode,
        type: 'absent_alert',
        channel: 'system',
        status: 'sent',
        message: `${student.name} was marked absent for ${input.courseCode} on ${input.date}.`,
      })
    }

    const studentRecords = updatedDatabase.attendanceRecords.filter(
      (record) => record.studentUserId === student.userId,
    )
    const attendance = computeAttendance(studentRecords).percentage

    if (attendance < 75) {
      nextNotifications.push({
        studentUserId: student.userId,
        parentUserId: student.parentUserId,
        courseCode: input.courseCode,
        type: 'low_attendance',
        channel: 'system',
        status: 'sent',
        message: `${student.name}'s attendance is ${attendance}%, below the 75% requirement.`,
      })
    }

    return nextNotifications
  })

  await appendNotifications(notifications)

  return {
    success: true,
    updatedCount: input.entries.length,
  }
}

export async function getStudentAttendanceOverview(userId: string) {
  const database = await readDatabase()
  const student = attendanceStudents.find((candidate) => candidate.userId === userId)

  if (!student) {
    throw new Error('Student profile not found.')
  }

  const records = database.attendanceRecords.filter((record) => record.studentUserId === userId)
  const attendance = computeAttendance(records)
  const subjects = groupByCourse(records)

  return {
    profile: {
      rollNumber: student.rollNumber,
      program: student.program,
      semester: student.semester,
      section: student.section,
    },
    attendance: {
      overallPercentage: attendance.percentage,
      requiredPercentage: 75,
      subjects,
    },
    schedule: studentSchedule[userId as keyof typeof studentSchedule] ?? [],
    feeStatus: {
      status: 'Partially Paid',
      dueAmount: 'Rs. 12,500',
      nextDueDate: 'May 20, 2026',
    },
  }
}

export async function getParentAttendanceOverview(userId: string) {
  const database = await readDatabase()
  const child = attendanceStudents.find((candidate) => candidate.parentUserId === userId)

  if (!child) {
    throw new Error('Parent-linked student profile not found.')
  }

  const records = database.attendanceRecords.filter(
    (record) => record.studentUserId === child.userId,
  )
  const attendance = computeAttendance(records)
  const recentAbsences = records.filter((record) => record.status === 'absent').length
  const notificationLogs = await listNotificationsForParent(userId)

  return {
    child: {
      name: child.name,
      rollNumber: child.rollNumber,
      program: child.program,
      semester: child.semester,
    },
    attendance: {
      overallPercentage: attendance.percentage,
      alert: attendance.percentage < 75 ? 'Attention Needed' : 'Safe',
      recentAbsences,
    },
    notifications: buildParentNotifications(
      attendance.percentage,
      recentAbsences,
      notificationLogs.map((item) => item.message),
    ),
    contact: {
      mentor: 'Prof Nisha P',
      officePhone: '+91 9742689866',
      officeEmail: 'principal.ssibm2006@gmail.com',
    },
  }
}

function computeAttendance(records: AttendanceRecord[]) {
  const scorable = records.filter((record) => record.status !== 'leave')
  const attended = scorable.filter(
    (record) => record.status === 'present' || record.status === 'late',
  ).length
  const percentage = scorable.length === 0 ? 0 : Math.round((attended / scorable.length) * 100)

  return { percentage }
}

function groupByCourse(records: AttendanceRecord[]) {
  const grouped = new Map<string, AttendanceRecord[]>()

  for (const record of records) {
    const current = grouped.get(record.courseCode) ?? []
    current.push(record)
    grouped.set(record.courseCode, current)
  }

  return Array.from(grouped.entries()).map(([courseCode, courseRecords]) => {
    const course = attendanceCourses.find((candidate) => candidate.code === courseCode)
    return {
      name: course?.name ?? courseCode,
      percentage: computeAttendance(courseRecords).percentage,
    }
  })
}

function buildParentNotifications(
  percentage: number,
  recentAbsences: number,
  loggedMessages: string[],
) {
  const notifications = []

  if (percentage < 75) {
    notifications.push('Attendance is below the 75% requirement. Please contact the class mentor.')
  } else {
    notifications.push('Attendance remains above the 75% requirement.')
  }

  notifications.push(`Recent absences recorded: ${recentAbsences}.`)
  notifications.push('For any correction request, please contact the faculty mentor or office desk.')
  notifications.push(...loggedMessages.slice(0, 3))

  return notifications
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}
