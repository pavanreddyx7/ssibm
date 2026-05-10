export type NotificationChannel = 'sms' | 'whatsapp' | 'email' | 'system'
export type NotificationStatus = 'queued' | 'sent'
export type NotificationType = 'absent_alert' | 'low_attendance' | 'attendance_saved'

export type NotificationRecord = {
  id: string
  studentUserId: string
  parentUserId?: string
  courseCode?: string
  type: NotificationType
  channel: NotificationChannel
  message: string
  status: NotificationStatus
  createdAt: string
}
