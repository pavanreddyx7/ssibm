export type DemoUserRole = 'admin' | 'faculty' | 'student' | 'parent'

export type DemoUser = {
  id: string
  email: string
  password: string
  role: DemoUserRole
  name: string
}

export const demoUsers: DemoUser[] = [
  // ─── Admin ────────────────────────────────────────────────────────────────
  {
    id: 'admin-1',
    email: 'admin@ssibm.demo',
    password: 'Admin@123',
    role: 'admin',
    name: 'SSIBM Admin',
  },

  // ─── Faculty — BBA ────────────────────────────────────────────────────────
  {
    id: 'faculty-harsharadhya',
    email: 'harsharadhya@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Harsharadhya H U',
  },
  {
    id: 'faculty-lakshmidevi',
    email: 'lakshmidevi@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mrs. Lakshmidevi N',
  },
  {
    id: 'faculty-jaisimha',
    email: 'jaisimha@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Jaisimha Rao B S',
  },

  // ─── Faculty — B.Com ──────────────────────────────────────────────────────
  {
    id: 'faculty-muthuraj',
    email: 'muthuraj@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Muthuraj T R',
  },
  {
    id: 'faculty-sagar',
    email: 'sagar@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Sagar A S',
  },
  {
    id: 'faculty-pankaja',
    email: 'pankaja@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mrs. Pankaja N',
  },

  // ─── Faculty — BCA ────────────────────────────────────────────────────────
  {
    id: 'faculty-shalika',
    email: 'shalika@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mrs. Shalika H S',
  },
  {
    id: 'faculty-shivakumar',
    email: 'shivakumar@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Shivakumar B',
  },
  {
    id: 'faculty-dhanya',
    email: 'dhanya@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mrs. Dhanya P M',
  },

  // ─── Faculty — M.Com ──────────────────────────────────────────────────────
  {
    id: 'faculty-chidananda',
    email: 'chidananda@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Chidananda V N',
  },

  // ─── Faculty — MSW ────────────────────────────────────────────────────────
  {
    id: 'faculty-guruprasad',
    email: 'guruprasad@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Dr. C V Guruprasad',
  },
  {
    id: 'faculty-raghu',
    email: 'raghu@ssibm.demo',
    password: 'Faculty@123',
    role: 'faculty',
    name: 'Mr. Raghu P K',
  },

  // ─── Students — BCA ───────────────────────────────────────────────────────
  {
    id: 'std-bca-1',
    email: 'priya.bca@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Priya Sharma',
  },
  {
    id: 'std-bca-2',
    email: 'ravi.bca@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Ravi Teja',
  },
  {
    id: 'std-bca-3',
    email: 'kiran.bca@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Kiran Kumar',
  },
  {
    id: 'std-bca-4',
    email: 'aishwarya.bca@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Aishwarya R',
  },
  {
    id: 'std-bca-5',
    email: 'deepak.bca@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Deepak M',
  },

  // ─── Students — BBA ───────────────────────────────────────────────────────
  {
    id: 'std-bba-1',
    email: 'sneha.bba@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Sneha Patil',
  },
  {
    id: 'std-bba-2',
    email: 'mahesh.bba@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Mahesh B',
  },
  {
    id: 'std-bba-3',
    email: 'kavya.bba@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Kavya R',
  },
  {
    id: 'std-bba-4',
    email: 'suresh.bba@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Suresh N',
  },

  // ─── Students — B.Com ─────────────────────────────────────────────────────
  {
    id: 'std-bcom-1',
    email: 'divya.bcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Divya K',
  },
  {
    id: 'std-bcom-2',
    email: 'prasad.bcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Prasad T',
  },
  {
    id: 'std-bcom-3',
    email: 'lakshmi.bcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Lakshmi M',
  },
  {
    id: 'std-bcom-4',
    email: 'vijay.bcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Vijay S',
  },

  // ─── Students — M.Com ─────────────────────────────────────────────────────
  {
    id: 'std-mcom-1',
    email: 'nandini.mcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Nandini K',
  },
  {
    id: 'std-mcom-2',
    email: 'supriya.mcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Supriya H',
  },
  {
    id: 'std-mcom-3',
    email: 'rakesh.mcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Rakesh D',
  },
  {
    id: 'std-mcom-4',
    email: 'meena.mcom@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Meena P',
  },

  // ─── Students — MSW ───────────────────────────────────────────────────────
  {
    id: 'std-msw-1',
    email: 'arjun.msw@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Arjun V',
  },
  {
    id: 'std-msw-2',
    email: 'pooja.msw@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Pooja L',
  },
  {
    id: 'std-msw-3',
    email: 'rohith.msw@ssibm.demo',
    password: 'Student@123',
    role: 'student',
    name: 'Rohith S',
  },

  // ─── Parents ──────────────────────────────────────────────────────────────
  {
    id: 'parent-bca-1',
    email: 'parent.priya@ssibm.demo',
    password: 'Parent@123',
    role: 'parent',
    name: 'Parent of Priya Sharma',
  },
  {
    id: 'parent-bca-4',
    email: 'parent.aishwarya@ssibm.demo',
    password: 'Parent@123',
    role: 'parent',
    name: 'Parent of Aishwarya R',
  },
  {
    id: 'parent-bba-2',
    email: 'parent.mahesh@ssibm.demo',
    password: 'Parent@123',
    role: 'parent',
    name: 'Parent of Mahesh B',
  },
  {
    id: 'parent-mcom-1',
    email: 'parent.nandini@ssibm.demo',
    password: 'Parent@123',
    role: 'parent',
    name: 'Parent of Nandini K',
  },
]
