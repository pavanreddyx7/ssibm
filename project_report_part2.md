# PART 2: CHAPTERS 4-6

# CHAPTER 4: SYSTEM DESIGN

## 4.1 System Architecture

The system follows a 3-tier architecture:
- Presentation Tier: React 19 + TypeScript (Vite)
- Application Tier: Node.js + Express REST API
- Data Tier: PostgreSQL + Firebase Realtime DB

### Architecture Diagram
`
[Browser Client]
     |
     v
[React Frontend - Vercel CDN]
     |
     v
[Express REST API - Railway]
     |
  +--+--+
  |     |
[PostgreSQL] [Firebase]
`

## 4.2 Database Design

### users
- id (PK), email, password_hash, role, name, phone, created_at

### students
- id (PK), user_id (FK), roll_number, course, semester, section, parent_phone, dob, address

### faculty
- id (PK), user_id (FK), employee_id, department, designation

### courses
- id (PK), code, name, semester, faculty_id (FK)

### attendance
- id (PK), student_id (FK), course_id (FK), date, status, marked_by, marked_at, remarks

### notifications_log
- id (PK), student_id (FK), parent_phone, channel, message, status, sent_at

### chatbot_conversations
- id (PK), session_id, user_name, phone, language, messages_json, created_at, lead_status

## 4.3 Use Case Diagram

### Admin Use Cases
- Login/Logout
- Manage Students (CRUD)
- Manage Faculty (CRUD)
- View Attendance Reports
- Send Broadcast Notifications
- View Chatbot Leads

### Faculty Use Cases
- Login/Logout
- View Assigned Courses
- Mark Attendance
- View Attendance History

### Student Use Cases
- Login/Logout
- View Own Attendance
- View Timetable
- View Academic Records

### Parent Use Cases
- Login via OTP
- View Child Attendance
- Manage Notification Preferences
- Download Reports

### Public User Use Cases
- Browse College Website
- Interact with AI Chatbot
- Submit Contact Form
- Apply for Admission

## 4.4 Data Flow Diagram

### Level 0 DFD
External Entities: Admin, Faculty, Student, Parent, Prospective Student
Main Process: Student Information System with AI Chatbot
Data Stores: Student DB, Attendance DB, Notification Logs, Chatbot Logs

### Level 1 DFD - Attendance Flow
1. Faculty selects course
2. System fetches enrolled students
3. Faculty marks status for each student
4. System saves records to Attendance DB
5. System checks if any student is absent
6. Notification service triggered for absent students
7. SMS/WhatsApp sent to parent
8. Log entry created in notifications_log

## 4.5 Sequence Diagrams

### Attendance Marking Sequence
Faculty -> Frontend: Open attendance page
Frontend -> API: GET /api/courses/{id}/students
API -> DB: Query enrolled students
DB -> API: Return student list
API -> Frontend: Student list with previous status
Frontend -> Faculty: Display attendance form
Faculty -> Frontend: Submit attendance
Frontend -> API: POST /api/attendance
API -> DB: Save attendance records
API -> NotificationService: Trigger absent alerts
NotificationService -> MSG91: Send SMS
NotificationService -> WhatsApp: Send message (if opted in)
API -> Frontend: Success response

### AI Chatbot Sequence
User -> Frontend: Types message
Frontend -> API: POST /api/chatbot
API -> RateLimiter: Check IP limit
RateLimiter -> API: Allowed
API -> AnthropicAPI: Send message + history
AnthropicAPI -> API: Stream response
API -> Frontend: Server-Sent Events stream
Frontend -> User: Display streamed response
API -> DB: Log conversation

# CHAPTER 5: TECHNOLOGY STACK

## 5.1 Frontend - React 19 + TypeScript

React 19 introduces concurrent rendering and improved hydration. Key features used:
- Functional components with hooks
- Context API for auth and language state
- React Router v7 for client-side navigation
- Framer Motion for page transitions and animations

### Project Structure
``nsrc/
  components/
    layout/     - Navbar, Footer
    ui/         - Reusable UI components
    home/       - Hero, About, Courses, Stats
    chatbot/    - AI chat widget
    attendance/ - Attendance UI
  pages/
    Home, About, Courses, Faculty
    Events, Contact, Admissions
    dashboard/  - Admin, Faculty, Student, Parent
  locales/
    en.json, kn.json, hi.json
  hooks/       - Custom React hooks
  services/    - API calls, auth, chatbot
  context/     - AuthContext, LanguageContext
  types/       - TypeScript interfaces
`

## 5.2 Backend - Node.js + Express

RESTful API with these route groups:
- /api/auth      - Login, logout, token refresh
- /api/students  - Student CRUD
- /api/faculty   - Faculty management
- /api/courses   - Course management
- /api/attendance - Mark and retrieve attendance
- /api/notifications - Notification logs
- /api/chatbot   - AI chatbot endpoint

### Middleware Stack
- helmet.js - Security headers
- cors - Cross-origin resource sharing
- express-rate-limit - Rate limiting
- jsonwebtoken - JWT validation
- multer - File uploads (CSV import)

## 5.3 AI Chatbot - Claude API

Model: claude-sonnet (Anthropic)
Integration: Server-side only (API key never exposed)
Streaming: Server-Sent Events (SSE)

### System Prompt Summary
The chatbot is configured as SSIBM Saathi, an admission counselor that:
- Answers questions about 5 courses: BBA, BCom, BCA, MCom, MSW
- Responds in user language (English/Kannada/Hindi)
- Captures leads after 3 exchanges
- Directs complaints to grievance cell
- Never fabricates fee amounts or exam dates

## 5.4 Database - PostgreSQL + Firebase

PostgreSQL handles:
- Student records, attendance, courses, users
- Complex queries and reports
- Transactional data integrity

Firebase handles:
- Real-time authentication
- OTP for parent login
- Live dashboard updates

## 5.5 Deployment Stack

| Layer | Platform | Cost |
|-------|---------|------|
| Frontend | Vercel | Free |
| Backend | Railway | ~/mo |
| Database | Railway PostgreSQL | Included |
| Auth | Firebase | Free tier |
| SMS | MSG91 | ~Rs.15 paise/SMS |
| Domain | Existing ssibm.co.in | Existing |

CI/CD Pipeline (GitHub Actions):
1. Push to main branch
2. Run ESLint + TypeScript check
3. Run unit tests
4. Build production bundle
5. Deploy to Vercel/Railway

# CHAPTER 6: SYSTEM IMPLEMENTATION

## 6.1 Key Frontend Components

### Navbar Component
Features:
- Sticky with glassmorphism effect on scroll
- Language switcher (EN / Kannada / Hindi)
- Login dropdown for 4 roles
- Mobile hamburger with slide-in drawer
- Apply Now CTA button

### Hero Section
- Full viewport gradient overlay
- Animated headline and subheadline
- Floating stats: 65+ Years, 84 Institutions, 5000+ Alumni
- Two CTA buttons: Explore Courses + Talk to AI Counselor

### Chatbot Widget
- Fixed bottom-right position
- Animated open/close
- Quick reply chips
- Streaming response display
- Lead capture form after 3 messages
- Language-aware welcome message

## 6.2 Attendance Implementation

### Faculty Attendance Flow
`	ypescript
const markAttendance = async (records: AttendanceRecord[]) => {
  const res = await api.post('/attendance', { records });
  if (res.data.absentees.length > 0) {
    // Notification job triggered automatically
    console.log(Alerts sent for  students);
  }
};
`

### Attendance Calculation
`	ypescript
const getAttendancePct = (present: number, total: number) => {
  return ((present / total) * 100).toFixed(1);
};

const isAtRisk = (pct: number) => pct < 75;
`

## 6.3 Notification Service

### SMS via MSG91
`	ypescript
async function sendAbsentSMS(student: Student, course: Course) {
  const message = Dear Parent,  ()
    was ABSENT for  today. -SSIBM;
  await msg91.send({
    to: student.parentPhone,
    message,
    sender: 'SSIBM'
  });
  await db.notificationsLog.create({...});
}
`

### Notification Triggers
- IMMEDIATE: Student marked absent -> SMS within 5 min
- WEEKLY: Every Saturday 6 PM -> attendance digest
- THRESHOLD: Below 75% -> urgent warning

## 6.4 Multilingual Support

Translation files at src/locales/:
- en.json: English (default)
- kn.json: Kannada (?????)
- hi.json: Hindi (?????)

Font loading:
- Default: Inter (Latin)
- Kannada: Noto Sans Kannada
- Hindi: Noto Sans Devanagari

Language persisted in localStorage and auto-detected on first visit.

## 6.5 Security Implementation

- JWT tokens: 24h expiry, role embedded in payload
- bcrypt: 12 salt rounds for password hashing
- Helmet.js: CSP, HSTS, X-Frame-Options headers
- Rate limiting: 5 login attempts per 15 min per IP
- Chatbot: 20 messages per IP per hour
- HTTPS enforced via Vercel/Railway
- Environment variables for all secrets
- CORS whitelist for known origins only

*[END OF PART 2 - Chapters 4, 5, 6]*
