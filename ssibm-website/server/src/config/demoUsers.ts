export type DemoUserRole = 'admin' | 'faculty' | 'student' | 'parent'

export type DemoUser = {
  id: string
  email: string
  password: string
  role: DemoUserRole
  name: string
}

export const demoUsers: DemoUser[] = [
  {
    id: 'admin-1',
    email: 'admin@ssibm.demo',
    password: 'Admin@123',
    role: 'admin',
    name: 'SSIBM Admin',
  },
]
