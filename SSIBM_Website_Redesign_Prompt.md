# SSIBM College Website — Full Redesign & Modernization Prompt

> **How to use this document:** Copy any section (or the whole thing) into Claude Code, Cursor, ChatGPT, or any AI coding assistant. Each section is a self-contained prompt you can run independently. Start from Section 1 and move down.

---

## 📋 Project Overview

**College:** Sri Siddhartha Institute of Business Management (SSIBM)
**Location:** SSIT Campus, Maralur, Tumakuru, Karnataka 572105
**Current Site:** https://ssibm.co.in/ (static HTML, dated design)

**Goal:** Rebuild the website as a modern, multilingual React application with:
1. Professional, mobile-first redesign
2. Multi-language support (English, Kannada, Hindi)
3. AI-powered admission/enquiry chatbot
4. Student attendance system with automatic SMS/WhatsApp alerts to parents

**Tech Stack (Recommended):**
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Routing:** React Router v6
- **i18n:** `react-i18next`
- **Backend:** Node.js + Express (or Next.js API routes) + PostgreSQL/MongoDB
- **Auth:** JWT + bcrypt (separate logins for Admin, Faculty, Student, Parent)
- **AI Chatbot:** Claude API (Anthropic) or OpenAI API
- **SMS Gateway:** Twilio / MSG91 / Fast2SMS (MSG91 is cheapest in India)
- **WhatsApp:** WhatsApp Business Cloud API (Meta) or Twilio WhatsApp
- **Hosting:** Vercel/Netlify (frontend) + Railway/Render (backend)

---

## SECTION 1 — Project Setup & Folder Structure

```
Create a new React + Vite + TypeScript project for the SSIBM college website.

Use this stack:
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- React Router v6
- react-i18next for internationalization
- axios for API calls
- lucide-react for icons
- framer-motion for animations

Set up the following folder structure:

src/
├── components/
│   ├── layout/        (Navbar, Footer, Sidebar)
│   ├── ui/            (shadcn components)
│   ├── home/          (Hero, About, Courses, Stats)
│   ├── chatbot/       (AI enquiry chatbot)
│   └── attendance/    (attendance UI)
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Courses.tsx
│   ├── Faculty.tsx
│   ├── Events.tsx
│   ├── Contact.tsx
│   ├── Admissions.tsx
│   └── dashboard/
│       ├── AdminDashboard.tsx
│       ├── FacultyDashboard.tsx
│       ├── StudentDashboard.tsx
│       └── ParentDashboard.tsx
├── locales/
│   ├── en.json
│   ├── kn.json        (Kannada)
│   └── hi.json        (Hindi)
├── hooks/
├── services/          (api.ts, auth.ts, chatbot.ts)
├── context/           (AuthContext, LanguageContext)
├── types/
└── utils/

Configure Tailwind with the SSIBM brand colors:
- Primary: deep blue (#1E3A8A)
- Secondary: gold/saffron (#F59E0B)
- Accent: green (#10B981)
- Background: warm off-white (#FAFAF9)

Install all dependencies and confirm dev server runs.
```

---

## SECTION 2 — Modern Homepage Redesign

```
Redesign the SSIBM homepage with these sections, in order:

1. NAVBAR (sticky, glassmorphism on scroll)
   - Logo + "SSIBM" wordmark
   - Links: Home, About, Courses, Faculty, Events, Admissions, Contact
   - Language switcher (EN / ಕನ್ನಡ / हिंदी) — flag icons
   - "Apply Now" CTA button (saffron)
   - "Login" dropdown (Student / Faculty / Parent / Admin)
   - Mobile: hamburger with slide-in drawer

2. HERO SECTION
   - Full-viewport with gradient overlay on campus photo
   - Headline: "Learning Today, Leading Tomorrow"
   - Subheadline: "Shaping future entrepreneurs since 1959"
   - Two CTAs: "Explore Courses" + "Talk to AI Counselor" (opens chatbot)
   - Floating stats card: "65+ Years | 84 Institutions | 5000+ Alumni"

3. ABOUT STRIP
   - Brief paragraph about SSES founded by Late Dr H M Gangadhariah in 1959
   - Mention Acharya Vinobha Bhave's blessing and the rural education mission
   - "Read Our Story" link to full About page

4. COURSES SHOWCASE
   - Grid of 5 course cards: BBA, B.Com, BCA, M.Com, MSW
   - Each card: icon, course name, duration, "Learn More"
   - Hover: lift + shadow + reveal "Apply" button

5. WHY CHOOSE SSIBM (animated stats counter)
   - Best B-School of the city
   - Qualified & experienced staff
   - Vision-oriented activity-based education
   - Modern campus amenities
   - Strong placement record

6. PLACEMENTS / RECRUITERS
   - Logo wall: Oracle, IBM, Infosys, Wipro, Indian Army, IAF, Navy
   - Auto-scrolling marquee on mobile

7. CAMPUS LIFE / EVENTS
   - Cards for INSPIRO, GUTS n GLORY, Appeeture, Varada Katha Kuta
   - Photo background with event name overlay

8. FOUNDERS SECTION
   - 3-column grid with photos: Late Dr H M Gangadharaiah, Late Dr G Shivaprasad, Dr G Parameshwara

9. TESTIMONIALS / ALUMNI SPEAK
   - Carousel of 3-4 alumni quotes with photos and current designations

10. CALL TO ACTION BANNER
    - "Admissions Open 2026-27" with countdown to deadline
    - "Start Application" button

11. FOOTER
    - Address: SSIT Campus, Maralur, Tumakuru, Karnataka 572105
    - Phone: +91 9742689866, +91 9008323967, Office: 0816-2201008
    - Email: principal.ssibm2006@gmail.com
    - Quick links, Courses, Social media
    - Newsletter signup
    - Embedded Google Map
    - © Copyright SSIBM. All Rights Reserved

Design principles:
- Mobile-first, fully responsive
- Smooth scroll animations using framer-motion (fade-up on viewport enter)
- Accessible (WCAG AA): proper alt text, aria labels, keyboard nav
- Lighthouse score target: 90+ on all metrics
- Use real images placeholders from /assets/img/ (logo.jpeg, ssibm.jpeg, etc.)
```

---

## SECTION 3 — Multi-Language Support (i18n)

```
Add multi-language support to the SSIBM website using react-i18next.

Languages required:
1. English (en) — default
2. Kannada (kn) — ಕನ್ನಡ — primary regional language
3. Hindi (hi) — हिंदी

Steps:
1. Install: npm i react-i18next i18next i18next-browser-languagedetector

2. Create src/i18n.ts with config that loads JSON files from src/locales/

3. Create three translation files with these key namespaces:
   - nav (Home, About, Courses, Faculty, Events, Contact, Admissions, Login)
   - hero (headline, subheadline, ctaPrimary, ctaSecondary)
   - about (title, paragraph, readMore)
   - courses (title, courseList with bba, bcom, bca, mcom, msw)
   - whyChoose (title, reasons)
   - footer (address, phone, email, copyright)
   - chatbot (welcomeMessage, placeholder, sendButton)
   - common (loading, error, submit, cancel, success)

4. Translate ALL user-facing strings. Examples:
   - en: "Learning Today, Leading Tomorrow"
   - kn: "ಇಂದು ಕಲಿ, ನಾಳೆ ಮುನ್ನಡೆಸು"
   - hi: "आज सीखें, कल नेतृत्व करें"

5. Build a LanguageSwitcher component:
   - Dropdown in navbar with flag icons
   - Persists choice in localStorage
   - Uses i18next-browser-languagedetector to auto-detect on first visit
   - Smoothly re-renders all text without page reload

6. Ensure Kannada and Hindi fonts render correctly:
   - Add Google Fonts: Noto Sans Kannada and Noto Sans Devanagari
   - Apply conditionally based on active language

7. Make sure dates, numbers, and currency also localize.
```

---

## SECTION 4 — AI-Powered Enquiry Chatbot

```
Build an AI-powered admission and enquiry chatbot for SSIBM website.

Features:
- Floating chat bubble bottom-right on every page
- Click to open a chat window (380px wide, 600px tall on desktop; full-screen on mobile)
- Branded header with SSIBM logo, "Ask SSIBM AI", minimize/close buttons
- Welcome message in user's selected language
- Suggested quick-reply chips:
  • "What courses do you offer?"
  • "What are the fees for BCA?"
  • "How do I apply?"
  • "When is the next admission deadline?"
  • "Where is the campus located?"
- Streaming responses (typing indicator)
- Speaks the user's language (English / Kannada / Hindi)
- Lead capture: after 3 exchanges, asks for name + phone for follow-up
- Logs all conversations to backend for admissions team to review

Backend endpoint: POST /api/chatbot
Body: { message: string, history: Message[], language: 'en'|'kn'|'hi', sessionId: string }

System prompt for the AI (Claude API or OpenAI):
"""
You are 'SSIBM Saathi', the official AI admission counselor for Sri Siddhartha Institute of Business Management (SSIBM), located at SSIT Campus, Maralur, Tumakuru, Karnataka 572105, India.

About SSIBM:
- Part of Sri Siddhartha Education Society (SSES), founded in 1959 by Late Dr H M Gangadhariah
- Blessed by Acharya Vinobha Bhave (Bhoodan Movement)
- 84 institutions across Karnataka
- Mission: education for rural students, backward classes, and women

Courses offered:
- BBA — Bachelor of Business Administration (3 years)
- B.Com — Bachelor of Commerce (3 years)
- BCA — Bachelor of Computer Applications (3 years)
- M.Com — Master of Commerce (2 years, requires 75% attendance)
- MSW — Master of Social Work (2 years)

Contact: +91 9742689866, +91 9008323967, Office 0816-2201008
Email: principal.ssibm2006@gmail.com

Your role:
1. Answer admission, fees, course, faculty, hostel, placement queries
2. Be warm, professional, concise (2-4 sentences max unless asked for detail)
3. Always reply in the language the user wrote in (English / Kannada / Hindi)
4. If you don't know exact figures (fees, dates), say "Please contact our office at +91 9742689866 for the latest information"
5. Never make up scholarship amounts, exam dates, or seat numbers
6. After helpful answers, gently invite: "Would you like our counselor to call you back? Just share your name and phone number."
7. For complaints or grievances, direct to: https://ssibm.co.in/Grievance_Redressal_Cell.html
"""

Tech implementation:
- Use Anthropic Claude API (claude-sonnet-4-5 model) or OpenAI GPT-4
- API key stored in backend .env, never exposed to frontend
- Stream responses using Server-Sent Events for real-time typing effect
- Rate limit: 20 messages per IP per hour to prevent abuse
- Store conversations in 'chatbot_conversations' DB table:
  (id, session_id, user_name, phone, language, messages_json, created_at, lead_status)

Admin dashboard view: list of all chatbot conversations, filter by date/lead status, mark as "contacted"
```

---

## SECTION 5 — Attendance System with Parent SMS/WhatsApp Alerts

```
Build a complete attendance management system for SSIBM with automated parent notifications.

USER ROLES:
1. Admin — manages everything
2. Faculty — marks attendance for their classes
3. Student — views own attendance
4. Parent — receives SMS/WhatsApp + can view child's attendance via login

DATABASE SCHEMA (PostgreSQL):

users
  id, email, password_hash, role (admin|faculty|student|parent), name, phone, created_at

students
  id, user_id, roll_number, course (BBA|BCom|BCA|MCom|MSW), semester, section,
  parent_phone, parent_email, parent_user_id, dob, address

faculty
  id, user_id, employee_id, department, designation

courses
  id, code, name, semester, faculty_id

attendance
  id, student_id, course_id, date, status (present|absent|late|leave),
  marked_by (faculty_id), marked_at, remarks

notifications_log
  id, student_id, parent_phone, channel (sms|whatsapp|email),
  message, status (sent|failed|delivered), sent_at, twilio_sid

settings
  id, key, value
  -- e.g., 'attendance_threshold_pct' = '75', 'notify_on_absent' = 'true'

FACULTY ATTENDANCE FLOW:
1. Faculty logs in → sees their courses for today
2. Selects course → list of enrolled students appears
3. For each student: tap Present / Absent / Late / Leave
4. "Mark All Present" bulk button (then unmark exceptions)
5. Submit → backend writes records → triggers notification job

PARENT NOTIFICATION TRIGGERS:
A) IMMEDIATE — when student marked Absent:
   SMS template:
   "Dear Parent, your child {student_name} ({roll_no}) was marked ABSENT for {course_name} on {date}. - SSIBM Tumkur"

   WhatsApp template (if opted in): same content, richer formatting with college logo

B) WEEKLY DIGEST — every Saturday 6 PM:
   "Weekly Attendance Report for {student_name}: Attended {X}/{Y} classes ({Z}%). Subject-wise: BCA101: 85%, BCA102: 90%... View full report: {link}"

C) LOW ATTENDANCE WARNING — when total % drops below 75%:
   "URGENT: {student_name}'s attendance is {Z}%, below the 75% requirement. Please contact class teacher. - SSIBM"

SMS GATEWAY: Use MSG91 (cheapest for India, ~15 paisa/SMS) or Twilio
Backend service: src/services/smsService.ts

```typescript
// Pseudo-code
async function sendAbsentAlert(studentId: number, courseId: number, date: string) {
  const student = await db.students.findById(studentId);
  const course = await db.courses.findById(courseId);
  const message = `Dear Parent, your child ${student.name} (${student.roll_number}) was marked ABSENT for ${course.name} on ${date}. - SSIBM Tumkur`;

  // Send SMS via MSG91
  await msg91.send({
    to: student.parent_phone,
    message,
    sender: 'SSIBM',
    template_id: process.env.MSG91_ABSENT_TEMPLATE_ID
  });

  // Optionally send WhatsApp via Meta Cloud API
  if (student.parent_whatsapp_optin) {
    await whatsapp.sendTemplate({
      to: student.parent_phone,
      template: 'absent_alert',
      params: [student.name, student.roll_number, course.name, date]
    });
  }

  // Log it
  await db.notifications_log.insert({...});
}
```

PARENT DASHBOARD (web + mobile responsive):
- Login with phone + OTP (or email + password)
- Sees: child's profile, today's attendance, weekly chart, monthly %, subject-wise breakdown
- Can download attendance report as PDF
- Notification preferences (SMS on/off, WhatsApp on/off, email on/off)

STUDENT DASHBOARD:
- Same data as parent, plus: timetable, exam schedule, fees status

ADMIN DASHBOARD:
- CRUD students, faculty, courses
- Bulk import students via CSV (with parent phone numbers)
- View college-wide attendance analytics (charts: by course, by date, by section)
- Send custom announcements to all parents (broadcast SMS)
- View all notification logs, retry failed ones

SECURITY:
- All API endpoints protected with JWT auth + role-based middleware
- Faculty can only mark attendance for their assigned courses
- Parent can only view their own child's data
- All passwords bcrypt-hashed (12 rounds)
- HTTPS only in production
- Rate limit on login (5 attempts per 15 min)
- DPDP Act 2023 compliance: explicit consent for SMS/WhatsApp, easy opt-out

INDIAN COMPLIANCE:
- DLT registration required for SMS in India (register sender ID 'SSIBM' on TRAI DLT portal)
- WhatsApp Business API requires Meta verification + approved templates
- Get written parent consent during admission for digital communication
```

---

## SECTION 6 — Additional Pages (About, Courses, Faculty, Events, Contact)

```
Build the remaining pages for SSIBM:

ABOUT PAGE
- Hero with college photo
- Vision, Mission, Values (3 cards)
- History timeline: 1959 founding → milestones → today
- Founder profiles with bios: Late Dr H M Gangadhariah, Late Dr G Shivaprasad, Dr G Parameshwara
- SSES network: brief on 84 institutions across Karnataka
- Affiliations & Approvals section (UGC, AICTE, university)
- Embedded campus virtual tour video

COURSES PAGE
- Filter tabs: All / Undergraduate / Postgraduate
- Detailed cards for each: BBA, B.Com, BCA, M.Com, MSW
- Each course detail page (/courses/bca etc.) with:
  • Overview, duration, eligibility
  • Curriculum (semester-wise expandable accordion)
  • Career opportunities
  • Fee structure (placeholder — fill with real data)
  • "Apply Now" button
  • Top recruiters for that course

FACULTY PAGE
- Department filter tabs
- Grid of faculty cards: photo, name, designation, qualifications
- Click → modal/page with full bio, research, publications, email

EVENTS PAGE
- Featured events: INSPIRO, GUTS n GLORY, Appeeture, Varada Katha Kuta
- Past events gallery (masonry photo grid with lightbox)
- Upcoming events calendar
- Event registration form (for outsiders)

CONTACT PAGE
- Contact form (name, email, phone, query type, message) → saves to DB + sends email
- Address: SSIT Campus, Maralur, Tumakuru, Karnataka 572105
- Phone: +91 9742689866, +91 9008323967, Office 0816-2201008
- Email: principal.ssibm2006@gmail.com
- Embedded Google Map
- Social media links
- Office hours

ADMISSIONS PAGE
- Step-by-step process (5 steps with progress indicator)
- Eligibility criteria per course
- Required documents checklist
- Online application form (multi-step)
- Fee payment integration (Razorpay for India)
- FAQ accordion
- Helpline numbers prominent

GRIEVANCE REDRESSAL CELL PAGE
- Form for complaint submission (with anonymous option)
- Committee members list
- Process flowchart
- Response timeline commitment
```

---

## SECTION 7 — Deployment & DevOps

```
Set up production deployment for SSIBM:

FRONTEND (React app):
- Deploy to Vercel or Netlify (free tier sufficient)
- Custom domain: www.ssibm.co.in
- Auto-deploy on git push to main branch
- Environment variables for API URL

BACKEND (Node.js/Express API):
- Deploy to Railway or Render (free tier to start)
- PostgreSQL database (Railway includes one)
- Environment variables: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY,
  MSG91_AUTH_KEY, WHATSAPP_TOKEN, etc.
- Daily automated DB backups

DOMAIN & SSL:
- Point ssibm.co.in DNS to Vercel
- Auto SSL via Let's Encrypt (Vercel handles)

MONITORING:
- Sentry for error tracking (free tier)
- UptimeRobot for uptime monitoring
- Google Analytics 4 for traffic
- Backend logs to Logtail or Better Stack

CI/CD:
- GitHub Actions workflow:
  • On push: lint → typecheck → test → build → deploy
- Separate staging and production environments

SEO & PERFORMANCE:
- React Helmet for meta tags
- Sitemap.xml, robots.txt
- Open Graph + Twitter Card meta
- Submit to Google Search Console
- Lighthouse CI in pipeline (fail build if score drops)

SECURITY HEADERS:
- CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- Use helmet.js on Express backend
- Regular `npm audit` and dependency updates
```

---

## 🎯 Suggested Build Order (8-week plan)

| Week | Deliverable |
|------|-------------|
| 1 | Project setup + Homepage redesign (Section 1 & 2) |
| 2 | All static pages (About, Courses, Faculty, Events, Contact) |
| 3 | Multi-language i18n (Section 3) |
| 4 | AI Chatbot frontend + backend (Section 4) |
| 5 | Auth system + DB schema + Admin dashboard |
| 6 | Faculty attendance marking + Student/Parent dashboards |
| 7 | SMS/WhatsApp integration + notification flows |
| 8 | Testing, deployment, training college staff (Section 7) |

---

## 💰 Estimated Monthly Costs (INR)

| Service | Cost |
|---------|------|
| Vercel (frontend hosting) | Free |
| Railway (backend + DB) | ₹400-800 |
| Domain renewal | ₹80/month avg |
| MSG91 SMS (5000 SMS) | ₹750 |
| WhatsApp Business API | ₹0.35 per conversation |
| Claude/OpenAI API | ₹500-2000 (depends on usage) |
| **Total** | **₹2,000 - ₹4,000/month** |

---

## ⚠️ Important Notes for Implementation

1. **DLT Registration (mandatory in India):** Before sending SMS, register your sender ID and templates at https://trai.gov.in DLT portal. Takes 3-7 days.

2. **WhatsApp Business verification:** Apply via Meta Business Manager, takes 2-4 weeks. Get templates pre-approved.

3. **Parent consent:** Add explicit checkbox during admission: "I consent to receive SMS/WhatsApp updates about my child's attendance and college matters."

4. **Data privacy (DPDP Act 2023):** Add Privacy Policy page, store data only in India-located servers if possible, allow parents to request data deletion.

5. **Use Claude API for the chatbot** — it's excellent with Indian languages and follows the system prompt very reliably. Sign up at https://console.anthropic.com.

6. **Test SMS templates thoroughly** before go-live — once DLT-registered, changes need re-approval.

---

## 🚀 First Prompt to Run Right Now

Copy this into Claude Code or Cursor to start:

> "Set up a new React + Vite + TypeScript project called 'ssibm-website' following Section 1 of my requirements. Install Tailwind CSS, shadcn/ui, React Router v6, react-i18next, axios, lucide-react, and framer-motion. Configure Tailwind with brand colors: primary #1E3A8A, secondary #F59E0B, accent #10B981, background #FAFAF9. Create the folder structure exactly as specified. Then build the Navbar component with logo, navigation links (Home, About, Courses, Faculty, Events, Admissions, Contact), language switcher dropdown (English/Kannada/Hindi), Apply Now button, and a Login dropdown. Make it sticky with glassmorphism on scroll. Mobile: hamburger menu with slide-in drawer using framer-motion. Then build a placeholder homepage importing this navbar."

Run that, review the output, then move to Section 2 for the full homepage.

Good luck with SSIBM 2.0! 🎓
