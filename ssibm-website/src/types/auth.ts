export type UserRole = 'admin' | 'faculty' | 'student'

export type AuthUser = {
  id: string
  role: UserRole
  name: string
  email: string
}
