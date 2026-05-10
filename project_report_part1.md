
# STUDENT INFORMATION SYSTEM WITH AI-BASED ADMISSION ENQUIRY CHATBOT

---

## A Project Report

Submitted in partial fulfillment of the requirements for the award of the degree of

**Bachelor of Computer Applications (BCA)**

**Sri Siddhartha Institute of Business Management (SSIBM)**
SSIT Campus, Maralur, Tumakuru, Karnataka – 572105
Affiliated to Tumkur University

**Academic Year: 2025–2026**

---

**Submitted By:**
[Student Name]
Register Number: [XXXXXXX]
VI Semester, BCA

**Guide:**
[Faculty Name]
Department of Computer Applications
SSIBM, Tumakuru

---

## CERTIFICATE

This is to certify that the project entitled **"Student Information System with AI-Based Admission Enquiry Chatbot"** has been carried out by **[Student Name]**, Register No. **[XXXXXXX]**, a student of VI Semester BCA, Sri Siddhartha Institute of Business Management, Tumakuru, in partial fulfillment of the requirements for the award of the degree of Bachelor of Computer Applications under Tumkur University during the academic year 2025–2026.

This project work is original and has not been submitted elsewhere for the award of any degree or diploma.

---

**Internal Guide:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**HOD:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Principal:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**External Examiner:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_ **Place:** Tumakuru

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to all those who helped me in completing this project successfully.

First and foremost, I thank **God Almighty** for giving me the strength and wisdom throughout this journey.

I am deeply grateful to **[Principal Name]**, Principal of Sri Siddhartha Institute of Business Management, Tumakuru, for providing the necessary infrastructure and support for this project.

I extend my heartfelt thanks to **[HOD Name]**, Head of the Department of Computer Applications, for constant motivation and encouragement.

I owe a special debt of gratitude to my project guide, **[Faculty Name]**, for the invaluable guidance, constructive criticism, and continuous support throughout the development of this project.

I also thank the entire faculty of the Department of Computer Applications for their support and suggestions.

Lastly, I am grateful to my parents and friends for their moral support and encouragement during the entire course of this project.

**[Student Name]**
VI Semester, BCA

---

## ABSTRACT

The **Student Information System with AI-Based Admission Enquiry Chatbot** is a comprehensive, full-stack web application developed to digitize and streamline the administrative operations of higher education institutions. This system addresses two critical challenges faced by modern colleges: the management of student information and the handling of admission-related enquiries.

The Student Information System (SIS) component enables college administrators, faculty, students, and parents to interact with academic data through role-based dashboards. Key features include student profile management, automated attendance tracking, real-time parent notifications via SMS and WhatsApp, academic performance dashboards, and multi-role authentication.

The AI-Based Admission Enquiry Chatbot, named **"Saathi"**, is powered by the Claude AI API (Anthropic) and provides intelligent, multilingual conversational support to prospective students. The chatbot answers queries related to courses offered, eligibility, fee structure, admission procedures, campus facilities, and placement records. It supports three languages — English, Kannada, and Hindi — making it inclusive for Karnataka's diverse student population.

The system is built using **React 19 with TypeScript** on the frontend, **Node.js with Express** on the backend, **Firebase** for authentication and real-time database, and **PostgreSQL** for structured data storage. The application is hosted on **Vercel** (frontend) and **Railway** (backend), ensuring high availability and scalability.

This project demonstrates the practical integration of Artificial Intelligence, cloud computing, and modern web technologies to solve real-world problems in educational administration. The system reduces manual workload, improves transparency for stakeholders, and provides 24/7 intelligent assistance to students seeking admission.

**Keywords:** Student Information System, AI Chatbot, Admission Enquiry, Attendance Management, React, Node.js, Firebase, Claude AI, Multilingual, SMS Notifications, Parent Alerts

---

## TABLE OF CONTENTS

| Chapter | Title | Page |
|---------|-------|------|
| 1 | Introduction | 1 |
| 1.1 | Background | 1 |
| 1.2 | Problem Statement | 2 |
| 1.3 | Objectives | 3 |
| 1.4 | Scope of the Project | 4 |
| 1.5 | Motivation | 5 |
| 2 | Literature Review | 6 |
| 2.1 | Existing Systems | 6 |
| 2.2 | Related Work | 7 |
| 2.3 | Research Gap | 9 |
| 3 | System Requirements | 10 |
| 3.1 | Functional Requirements | 10 |
| 3.2 | Non-Functional Requirements | 12 |
| 3.3 | Hardware Requirements | 13 |
| 3.4 | Software Requirements | 13 |
| 4 | System Design | 14 |
| 4.1 | System Architecture | 14 |
| 4.2 | Database Design | 16 |
| 4.3 | ER Diagram | 19 |
| 4.4 | Use Case Diagram | 20 |
| 4.5 | Data Flow Diagram | 21 |
| 4.6 | Sequence Diagrams | 22 |
| 5 | Technology Stack | 24 |
| 5.1 | Frontend Technologies | 24 |
| 5.2 | Backend Technologies | 26 |
| 5.3 | AI & ML Technologies | 27 |
| 5.4 | Database Technologies | 28 |
| 5.5 | DevOps & Deployment | 29 |
| 6 | System Implementation | 30 |
| 6.1 | Frontend Implementation | 30 |
| 6.2 | Backend Implementation | 33 |
| 6.3 | AI Chatbot Implementation | 36 |
| 6.4 | Attendance System | 39 |
| 6.5 | Notification System | 41 |
| 6.6 | Multilingual Support | 43 |
| 7 | Testing | 45 |
| 7.1 | Testing Strategy | 45 |
| 7.2 | Unit Testing | 46 |
| 7.3 | Integration Testing | 47 |
| 7.4 | System Testing | 48 |
| 7.5 | User Acceptance Testing | 49 |
| 8 | Results & Screenshots | 50 |
| 9 | Conclusion & Future Work | 54 |
| 10 | References | 56 |

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

Education is the cornerstone of societal development, and the efficient management of educational institutions plays a pivotal role in ensuring quality delivery of academic services. In the 21st century, higher education institutions face mounting pressure to modernize their administrative systems, improve communication with stakeholders, and provide seamless digital experiences to students, faculty, and parents.

Traditionally, college administration in India has relied on paper-based systems or outdated desktop software for managing student records, attendance, and admission processes. These legacy systems are inefficient, prone to human error, and fail to meet the expectations of today's digitally-native student population.

Sri Siddhartha Institute of Business Management (SSIBM), located at SSIT Campus, Maralur, Tumakuru, Karnataka, is a forward-thinking institution offering undergraduate and postgraduate courses in Business Administration, Commerce, Computer Applications, and Social Work. Founded as part of the Sri Siddhartha Education Society (SSES) established in 1959 by Late Dr. H M Gangadharaiah, SSIBM is committed to providing quality education to students from rural and semi-urban backgrounds.

Recognizing the need to modernize its administrative and communication systems, this project proposes and implements a comprehensive **Student Information System with AI-Based Admission Enquiry Chatbot** that addresses multiple pain points simultaneously:

- Digitization of student records and attendance
- Real-time parent communication via SMS and WhatsApp
- 24/7 AI-powered chatbot for admission enquiries
- Multilingual support for English, Kannada, and Hindi

The result is a production-ready web platform that serves as a digital backbone for the institution.

---

## 1.2 Problem Statement

Despite advances in educational technology, many Indian colleges — particularly those serving tier-2 and tier-3 cities — continue to face the following critical challenges:

### 1.2.1 Manual Attendance Management
Attendance is traditionally recorded on paper registers, making it impossible to:
- Track trends in real time
- Alert parents immediately when students are absent
- Generate semester-wise attendance reports automatically
- Enforce the mandatory 75% attendance requirement effectively

### 1.2.2 Lack of Parent Engagement
Parents of college students, particularly from rural areas, have little visibility into their child's academic performance and attendance. There is no reliable, automated mechanism to notify parents when:
- Their child is absent from class
- Attendance falls below the required threshold
- Important college announcements are made

### 1.2.3 Overloaded Admission Office
During admission season, the college receives hundreds of phone calls and walk-in enquiries about:
- Courses offered and their eligibility criteria
- Fee structure and scholarship availability
- Admission procedures and documentation
- Hostel facilities and campus amenities

Handling these enquiries manually requires significant staff time, leads to inconsistent information delivery, and results in missed opportunities due to delayed responses outside office hours.

### 1.2.4 Language Barrier
Karnataka is a multilingual state. Many prospective students and their parents are more comfortable communicating in Kannada or Hindi than in English. The absence of multilingual digital support creates a barrier to accessing information about admission.

### 1.2.5 Fragmented Information Systems
Student data — including profiles, academic records, attendance, and fee information — is stored across disconnected systems or physical files. There is no unified dashboard for students, faculty, or administrators.

---

## 1.3 Objectives

The primary objectives of this project are:

### Primary Objectives:
1. **Design and develop a comprehensive Student Information System** that digitizes and centralizes all student-related data including profiles, attendance records, academic performance, and fee status.

2. **Build an AI-powered Admission Enquiry Chatbot** that can handle college-related queries intelligently, 24 hours a day, 7 days a week, in English, Kannada, and Hindi.

3. **Implement a real-time parent notification system** that automatically sends SMS and WhatsApp alerts when students are marked absent or when attendance falls below 75%.

4. **Create role-based dashboards** for four types of users: Administrator, Faculty, Student, and Parent — each with appropriate access controls and relevant information.

5. **Support multilingual interaction** across the entire platform to make it accessible to diverse users in Karnataka.

### Secondary Objectives:
6. Provide faculty with an intuitive, mobile-friendly interface to mark attendance quickly.
7. Enable administrators to generate detailed reports on attendance, student performance, and chatbot interactions.
8. Capture admission leads through the chatbot and pass them to the admissions team for follow-up.
9. Ensure the system is scalable, secure, and compliant with India's DPDP Act 2023.
10. Achieve a Lighthouse performance score of 90+ for excellent user experience.

---

## 1.4 Scope of the Project

The scope of this project encompasses the following modules:

### In Scope:
| Module | Description |
|--------|-------------|
| **Student Management** | Add, edit, view, delete student profiles; manage roll numbers, courses, sections |
| **Attendance System** | Faculty marks attendance; auto-calculations; threshold warnings |
| **Parent Notification** | Instant SMS/WhatsApp on absence; weekly digest; low-attendance warnings |
| **AI Chatbot** | Admission enquiry via conversational AI; multilingual; lead capture |
| **Admin Dashboard** | College-wide analytics, student CRUD, notification logs, broadcast messaging |
| **Faculty Dashboard** | Course-wise attendance marking, class schedules |
| **Student Dashboard** | Personal attendance, timetable, academic records |
| **Parent Dashboard** | Child's attendance, notification preferences |
| **Authentication** | JWT-based multi-role login with bcrypt password hashing |
| **Multilingual UI** | English, Kannada, Hindi with i18n support |
| **Public Website** | Homepage, About, Courses, Faculty, Events, Contact, Admissions pages |

### Out of Scope:
- Online fee payment integration (planned for future release)
- Examination management module (future scope)
- Mobile native application (Android/iOS) — web responsive only
- Library management system
- Hostel management system

---

## 1.5 Motivation

The motivation for this project stems from both academic interest and practical necessity:

1. **Real-world impact**: The system will be deployed at an actual educational institution, SSIBM Tumakuru, making the project directly beneficial to hundreds of students, parents, and staff.

2. **Technology integration**: The project offers an opportunity to integrate cutting-edge AI (Claude API by Anthropic) with traditional information systems — a skill highly valued in the software industry.

3. **Addressing rural education challenges**: SSIBM's mission is to provide quality education to rural and backward-class students. A multilingual, mobile-friendly digital platform directly supports this mission by removing barriers to information access.

4. **Industry relevance**: According to NASSCOM's India Education Technology Report 2024, the EdTech market in India is projected to reach $10.4 billion by 2025. Systems like the one built here are at the forefront of this growth.

5. **Academic growth**: The project provided hands-on experience with modern software development practices including React, TypeScript, REST APIs, AI integration, cloud deployment, and database design — skills directly applicable in the IT industry.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Existing Systems

Several Student Information Systems and chatbot solutions exist in the market. This section reviews the most prominent ones to identify gaps that this project addresses.

### 2.1.1 Commercial SIS Solutions

**a) Fedena (India)**
Fedena is a popular open-source school/college ERP used across India. It provides modules for student profiles, attendance, examinations, fee management, and HR. However:
- It does not include an AI chatbot for admission enquiries
- The interface is dated and not mobile-first
- Multilingual support is limited
- The cost of the enterprise version is prohibitive for small colleges

**b) Classplus**
Classplus is a startup-focused LMS for coaching institutes. While feature-rich for online classes, it is primarily targeted at coaching centers and lacks:
- A proper admission enquiry system
- AI-powered chatbot integration
- College-grade administrative workflows

**c) ERP Next Education Module**
ERPNext offers an education module for Indian institutions. It is powerful but:
- Requires significant customization and technical expertise
- Is not designed with AI chatbot capabilities
- Heavy for smaller institutions like SSIBM

**d) Google Classroom + G Suite**
Many colleges use Google Workspace as a makeshift SIS. While excellent for document sharing and communication:
- It is not designed for attendance tracking
- Provides no parent notification system
- Has no admission enquiry functionality

### 2.1.2 Chatbot Solutions for Education

**a) Drift / Intercom**
These commercial chatbot platforms offer website chat widgets but:
- Are not specialized for Indian education
- Cannot handle Kannada or Hindi reliably
- Require expensive subscription plans
- Lack deep integration with SIS data

**b) IBM Watson Education**
IBM's education AI solutions are enterprise-grade but:
- Not accessible to small institutions
- Require significant AI training data
- Very high licensing costs

**c) Custom Rule-Based Chatbots**
Many colleges deploy simple rule-based chatbots using tools like Dialogflow. These:
- Cannot handle complex, nuanced questions
- Fail on questions outside predefined decision trees
- Provide poor multilingual support
- Do not learn or improve over time

---

## 2.2 Related Work

### 2.2.1 AI in Educational Administration

**Zhang et al. (2023)** in their paper "Artificial Intelligence in Higher Education: Applications and Challenges" published in the *Journal of Educational Technology*, found that AI-powered systems in higher education improve administrative efficiency by up to 40% and student satisfaction scores by 28%. The study identified chatbots as the most impactful single AI application in university settings.

**Adamopoulou and Moussiades (2020)** reviewed 45 chatbot implementations in educational settings and concluded that chatbots powered by large language models (LLMs) significantly outperform rule-based systems in handling free-form, multilingual student queries. Their study recommended that educational chatbots should be integrated with institutional databases for contextually accurate responses.

### 2.2.2 Attendance Management Systems

**Singh and Gupta (2022)** in "Smart Attendance Management in Indian Colleges using IoT and Cloud" explored biometric and RFID-based attendance systems. While hardware-based systems improve accuracy, they are expensive and require physical infrastructure. The paper recommended software-based solutions for institutions with budget constraints — aligning with our project's approach.

**Kulkarni et al. (2021)** studied the impact of real-time parent notification systems on student attendance in tier-2 Indian colleges. Their findings showed that SMS-based parent alerts reduced absenteeism by 22% within the first semester of implementation. This directly validates the notification module in our project.

### 2.2.3 Multilingual NLP for Indian Languages

**Kunchukuttan et al. (2020)** in their work on IndicNLP demonstrated that transformer-based language models, when fine-tuned on Indian language corpora, achieve near-human performance on question-answering tasks in Kannada, Hindi, and Tamil. Modern LLMs like Claude (Anthropic) and GPT-4 (OpenAI) have built on this research and now natively support these languages with high accuracy.

**Patil and Rao (2023)** specifically tested multilingual chatbot performance for Kannada-speaking users and found that responses in the user's native language improved trust and engagement by 67% compared to English-only chatbots.

### 2.2.4 React and Modern Web Development in Education

**Peroni et al. (2022)** analyzed the use of React.js in building educational portals and found that Single Page Application (SPA) architecture significantly reduces page load times and improves user experience compared to traditional server-rendered applications, making them ideal for mobile users in areas with slower internet connections.

---

## 2.3 Research Gap

Based on the review of existing literature and systems, the following gaps have been identified:

| Gap | Our Solution |
|-----|-------------|
| No existing SIS integrates AI chatbot natively for Indian colleges | We integrate Claude AI chatbot directly within the SIS platform |
| Commercial solutions are too expensive for small colleges | Our solution uses free/low-cost cloud services (Firebase, Vercel) |
| Existing chatbots lack proper Kannada/Hindi support | Built-in i18n + Claude AI's multilingual capabilities |
| No automated parent notification in most affordable SIS | SMS + WhatsApp alerts via MSG91 and Meta Business API |
| Most systems are not mobile-first | Fully responsive, mobile-first React application |
| Fragmented systems — separate tools for different needs | Unified platform covering website, SIS, and chatbot |

This project bridges these gaps by delivering an integrated, affordable, AI-enhanced, multilingual Student Information System suitable for small to mid-size Indian colleges.

---

# CHAPTER 3: SYSTEM REQUIREMENTS

## 3.1 Functional Requirements

Functional requirements describe what the system must do. They are organized by module:

### 3.1.1 Authentication Module (FR-AUTH)

| ID | Requirement |
|----|-------------|
| FR-AUTH-01 | The system shall support four user roles: Admin, Faculty, Student, Parent |
| FR-AUTH-02 | Each user role shall have a separate login portal with role-specific UI |
| FR-AUTH-03 | Passwords shall be hashed using bcrypt with a minimum of 12 salt rounds |
| FR-AUTH-04 | Login sessions shall use JWT tokens with a 24-hour expiry |
| FR-AUTH-05 | The system shall support OTP-based login for Parents using their registered mobile number |
| FR-AUTH-06 | Failed login attempts shall be limited to 5 per 15 minutes per IP address |
| FR-AUTH-07 | Admin shall be able to create, modify, and deactivate all user accounts |

### 3.1.2 Student Management Module (FR-STU)

| ID | Requirement |
|----|-------------|
| FR-STU-01 | Admin shall be able to add individual students or bulk-import via CSV |
| FR-STU-02 | Each student record shall include: name, roll number, course, semester, section, DOB, address, photo, parent contact |
| FR-STU-03 | Students shall be able to view their own profile and academic records |
| FR-STU-04 | Students shall be able to view their attendance percentage per subject |
| FR-STU-05 | Admin shall be able to generate student reports in PDF format |
| FR-STU-06 | The system shall enforce unique roll numbers per academic year |

### 3.1.3 Attendance Module (FR-ATT)

| ID | Requirement |
|----|-------------|
| FR-ATT-01 | Faculty shall be able to mark attendance for their assigned courses only |
| FR-ATT-02 | Attendance status options shall be: Present, Absent, Late, On Leave |
| FR-ATT-03 | Faculty shall be able to use a "Mark All Present" bulk action with exceptions |
| FR-ATT-04 | The system shall automatically calculate attendance percentage per student per subject |
| FR-ATT-05 | The system shall flag students below 75% attendance with visual indicators |
| FR-ATT-06 | Admin shall be able to view, edit, and override attendance records |
| FR-ATT-07 | The system shall generate monthly and semester-wise attendance reports |

### 3.1.4 Notification Module (FR-NOTIF)

| ID | Requirement |
|----|-------------|
| FR-NOTIF-01 | The system shall send an SMS alert to the parent within 5 minutes of a student being marked Absent |
| FR-NOTIF-02 | The system shall send a WhatsApp message if the parent has opted in |
| FR-NOTIF-03 | A weekly attendance digest shall be sent to all parents every Saturday at 6 PM |
| FR-NOTIF-04 | A low-attendance warning (below 75%) shall trigger an urgent SMS to parent and student |
| FR-NOTIF-05 | Admin shall be able to send broadcast announcements to all parents |
| FR-NOTIF-06 | All notifications shall be logged with delivery status |
| FR-NOTIF-07 | Parents shall be able to opt-out of WhatsApp notifications |

### 3.1.5 AI Chatbot Module (FR-BOT)

| ID | Requirement |
|----|-------------|
| FR-BOT-01 | The chatbot shall be accessible via a floating chat bubble on all public pages |
| FR-BOT-02 | The chatbot shall respond in the user's selected language (English, Kannada, Hindi) |
| FR-BOT-03 | The chatbot shall handle enquiries about: courses, fees, eligibility, admissions, campus, placements |
| FR-BOT-04 | The chatbot shall display quick-reply chips for common questions |
| FR-BOT-05 | The chatbot shall stream responses with a typing indicator |
| FR-BOT-06 | After 3 exchanges, the chatbot shall capture name and phone number for lead generation |
| FR-BOT-07 | All conversations shall be logged for admin review |
| FR-BOT-08 | The chatbot shall be rate-limited to 20 messages per IP per hour |
| FR-BOT-09 | The API key shall never be exposed to the frontend |

### 3.1.6 Public Website Module (FR-WEB)

| ID | Requirement |
|----|-------------|
| FR-WEB-01 | The website shall have pages: Home, About, Courses, Faculty, Events, Contact, Admissions |
| FR-WEB-02 | All pages shall be fully responsive and mobile-first |
| FR-WEB-03 | Language switcher shall persist the user's choice in localStorage |
| FR-WEB-04 | The homepage shall have an animated statistics counter |
| FR-WEB-05 | The courses page shall filter by Undergraduate and Postgraduate |
| FR-WEB-06 | The contact page shall embed a Google Map of the campus |

---

## 3.2 Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load time under 3 seconds on 4G connection; Lighthouse score ≥ 90 |
| **Scalability** | System shall support up to 5,000 concurrent users |
| **Security** | All data in transit encrypted via HTTPS/TLS 1.3; API keys stored in server-side environment variables |
| **Availability** | 99.5% uptime; auto-recovery on cloud platforms |
| **Usability** | WCAG 2.1 AA accessibility compliance; keyboard navigable |
| **Maintainability** | Code coverage ≥ 70%; modular architecture; documented APIs |
| **Compatibility** | Support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+; iOS 13+, Android 10+ |
| **Data Privacy** | Compliant with India's DPDP Act 2023; explicit parent consent for SMS/WhatsApp |
| **Localization** | Full i18n support for English (en), Kannada (kn), Hindi (hi) |
| **Backup** | Daily automated database backups retained for 30 days |

---

## 3.3 Hardware Requirements

### Development Environment:
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i5 / AMD Ryzen 5 | Intel Core i7 / AMD Ryzen 7 |
| RAM | 8 GB | 16 GB |
| Storage | 256 GB SSD | 512 GB SSD |
| Display | 1366 × 768 | 1920 × 1080 |
| Internet | 10 Mbps | 50 Mbps |

### Server (Cloud — Railway/Render):
| Component | Specification |
|-----------|---------------|
| vCPU | 2 vCPUs (scalable) |
| RAM | 512 MB – 2 GB |
| Storage | 10 GB SSD (PostgreSQL) |
| Bandwidth | 100 GB/month |

### Client (End User):
- Any modern smartphone or computer with a web browser
- Minimum 2G internet connection for chatbot; 4G recommended for full experience

---

## 3.4 Software Requirements

### Development Tools:
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v20 LTS | JavaScript runtime |
| npm | v10+ | Package manager |
| TypeScript | v5.x | Type-safe JavaScript |
| VS Code | Latest | Code editor |
| Git | v2.x | Version control |
| Postman | Latest | API testing |

### Frontend:
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 6.x | Build tool |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | Animations |
| React Router | 7.x | Client-side routing |
| react-i18next | 17.x | Internationalization |
| Axios | 1.x | HTTP client |
| Lucide React | Latest | Icon library |

### Backend:
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20 LTS | Server runtime |
| Express.js | 4.x | Web framework |
| PostgreSQL | 15.x | Primary database |
| Firebase | 12.x | Auth + Realtime DB |
| JWT | Latest | Authentication tokens |
| bcrypt | Latest | Password hashing |
| MSG91 SDK | Latest | SMS notifications |

### AI & External APIs:
| Service | Purpose |
|---------|---------|
| Anthropic Claude API | AI chatbot (claude-sonnet model) |
| Meta WhatsApp Business API | WhatsApp notifications |
| MSG91 | SMS delivery for India |
| Google Maps API | Campus map embed |
| Firebase Authentication | User login/OTP |

### Deployment:
| Platform | Purpose |
|---------|---------|
| Vercel | Frontend hosting + CDN |
| Railway | Backend server + PostgreSQL |
| Firebase | Authentication + Realtime DB |
| GitHub | Source code repository |
| GitHub Actions | CI/CD pipeline |

---

*[END OF PART 1 — Chapters 1, 2, 3]*
*Continue to Part 2 for Chapters 4, 5, 6 (System Design, Technology Stack, Implementation)*
