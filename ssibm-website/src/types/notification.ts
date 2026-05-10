export type NotificationRecord = {
  id: string
  studentUserId: string
  parentUserId?: string
  courseCode?: string
  type: 'absent_alert' | 'low_attendance' | 'attendance_saved'
  channel: 'sms' | 'whatsapp' | 'email' | 'system'
  status: 'queued' | 'sent'
  message: string
  createdAt: string
}
