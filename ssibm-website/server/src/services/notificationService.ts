import { randomUUID } from 'node:crypto'
import { readDatabase, updateDatabase } from '../db/database.js'
import type { NotificationRecord } from '../types/notification.js'

export async function appendNotifications(notifications: Array<Omit<NotificationRecord, 'id' | 'createdAt'>>) {
  if (!notifications.length) return []

  const timestamp = new Date().toISOString()
  const records: NotificationRecord[] = notifications.map((notification) => ({
    id: randomUUID(),
    createdAt: timestamp,
    ...notification,
  }))

  await updateDatabase((database) => ({
    ...database,
    notificationLogs: [...records, ...database.notificationLogs],
  }))

  return records
}

export async function listNotifications() {
  const database = await readDatabase()
  return database.notificationLogs
}

export async function listNotificationsForParent(parentUserId: string) {
  const database = await readDatabase()
  return database.notificationLogs.filter((item) => item.parentUserId === parentUserId)
}
