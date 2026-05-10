import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedAttendanceRecords } from '../config/attendanceData.js'
import type { AdmissionApplication } from '../types/admissions.js'
import type { AttendanceRecord } from '../types/attendance.js'
import type { ChatbotConversationRecord } from '../types/chatbot.js'
import type { NotificationRecord } from '../types/notification.js'

type DatabaseShape = {
  admissions: AdmissionApplication[]
  chatbotConversations: ChatbotConversationRecord[]
  attendanceRecords: AttendanceRecord[]
  notificationLogs: NotificationRecord[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.resolve(__dirname, '../data')
const databasePath = path.join(dataDirectory, 'db.json')

const initialData: DatabaseShape = {
  admissions: [],
  chatbotConversations: [],
  attendanceRecords: seedAttendanceRecords,
  notificationLogs: [],
}

let cache: DatabaseShape | null = null
let writeQueue = Promise.resolve()

export async function readDatabase() {
  if (cache) {
    return cache
  }

  await ensureDatabaseFile()
  const raw = await readFile(databasePath, 'utf8')
  cache = normalizeDatabase(JSON.parse(raw))
  return cache
}

export async function updateDatabase(
  updater: (database: DatabaseShape) => DatabaseShape | Promise<DatabaseShape>,
) {
  writeQueue = writeQueue.then(async () => {
    const current = await readDatabase()
    const next = await updater(structuredClone(current))
    cache = next
    await writeFile(databasePath, JSON.stringify(next, null, 2), 'utf8')
  })

  await writeQueue
  return cache as DatabaseShape
}

async function ensureDatabaseFile() {
  await mkdir(dataDirectory, { recursive: true })

  try {
    await readFile(databasePath, 'utf8')
  } catch {
    await writeFile(databasePath, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

function normalizeDatabase(value: unknown): DatabaseShape {
  const candidate = (value ?? {}) as Partial<DatabaseShape>

  return {
    admissions: Array.isArray(candidate.admissions) ? candidate.admissions : [],
    chatbotConversations: Array.isArray(candidate.chatbotConversations)
      ? candidate.chatbotConversations
      : [],
    attendanceRecords: Array.isArray(candidate.attendanceRecords)
      ? candidate.attendanceRecords
      : seedAttendanceRecords,
    notificationLogs: Array.isArray(candidate.notificationLogs)
      ? candidate.notificationLogs
      : [],
  }
}
