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
  {
    id: 'faculty-1',
    email: 'faculty@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Faculty User',
  },
  {
    id: 'student-1',
    email: 'student@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Student User',
  },
  {
    id: 'parent-1',
    email: 'parent@ssibm.demo',
    password: 'Parent@123',
    role: 'parent',
    name: 'Parent User',
  },
]
