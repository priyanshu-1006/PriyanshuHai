<div align="center">

# 🌌 MMMUT Nexsus — UniVerse

### The Integrated Smart Campus Super-App for MMMUT

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://www.langchain.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Nexsus replaces 10+ fragmented campus tools with one unified digital ecosystem — 5 web portals, 2 native mobile apps, AI-powered bots, smart attendance, and 20+ student utility tools — all connected by a single backend.**

[🚀 Features](#-core-platform-modules) · [🏗️ Architecture](#%EF%B8%8F-system-architecture) · [⚡ Quick Start](#-quick-start) · [📚 Doc](#-documentation)

</div>

---

## 📖 The Problem

At MMMUT (and most Indian colleges), students juggle **10+ disconnected platforms** daily:

| Pain Point                | Reality                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| **Information Asymmetry** | Critical notices drown in chaotic WhatsApp groups                              |
| **Resource Wastage**      | No trusted platform for peer-to-peer buying/selling on campus                  |
| **Fragmented Tools**      | Separate websites for PYQs, notices, timetables, attendance, clubs, mess menus |
| **Zero Guidance**         | Freshers struggle to discover clubs, fests, career paths, and campus resources |
| **Manual Attendance**     | Roll-call or proxy-prone paper-based attendance                                |

## 💡 The Solution

**Nexsus (UniVerse)** is a full-stack smart campus super-app that centralizes the entire college digital experience — academic resources, AI chatbots, attendance automation, club management, marketplace, virtual lab, and more — into a single, cohesive platform.

---

## 🏗️ System Architecture

```
                         ┌─────────────────────────────────────────────┐
                         │          BACKEND (Express + Prisma)         │
                         │             Port 5000 · REST API            │
                         │                                             │
                         │  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
                         │  │  Auth   │ │  RAG AI  │ │  Attendance │  │
                         │  │ (JWT +  │ │(LangChain│ │  (QR/Face/  │  │
                         │  │  RBAC)  │ │ +Gemini) │ │  Geofence)  │  │
                         │  └─────────┘ └──────────┘ └─────────────┘  │
                         │  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │
                         │  │ Scraper │ │  Email   │ │  Cloudinary │  │
                         │  │(Playwrt)│ │(Resend + │ │  (Uploads)  │  │
                         │  │         │ │Nodemailer│ │             │  │
                         │  └─────────┘ └──────────┘ └─────────────┘  │
                         │                                             │
                         │     Supabase PostgreSQL · pgvector · Redis  │
                         └──────────────────┬──────────────────────────┘
                                            │ REST API
         ┌──────────────┬───────────────┬───┴───┬───────────────┬──────────────┐
         │              │               │       │               │              │
   ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐ │  ┌───────────┴──┐  ┌───────┴───────┐
   │  Main     │  │  Admin    │  │  Society  │ │  │  Haazir      │  │  Tools        │
   │  Client   │  │  Portal   │  │  Portal   │ │  │  Portal      │  │  (Deployed)   │
   │  :5173    │  │  :5174    │  │  :5175    │ │  │  :5176       │  │  Vercel       │
   │  (Public) │  │  (Super   │  │  (Club    │ │  │  (Attendance │  │  20+ Utils    │
   │           │  │   Admin)  │  │   Admins) │ │  │   System)    │  │               │
   └───────────┘  └───────────┘  └───────────┘ │  └──────────────┘  └───────────────┘
                                                │
                                   ┌────────────┴────────────┐
                                   │                         │
                              ┌────┴────┐             ┌──────┴──────┐
                              │ Nexsus  │             │  Haazir     │
                              │ Mobile  │             │  Mobile     │
                              │ (Expo)  │             │  (Expo)     │
                              │ Android │             │  Android    │
                              └─────────┘             └─────────────┘
```

### Multi-Portal Architecture

| Portal             | Port                                                  | Audience                          | Tech                    | Description                                                                                         |
| ------------------ | ----------------------------------------------------- | --------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Main Client**    | `5173`                                                | Public / Students                 | React + Vite + Tailwind | Public website — notices, marketplace, PYQs, AI bots, societies, events, virtual labs               |
| **Admin Portal**   | `5174`                                                | Super Admin                       | React + Vite + Tailwind | Complete system administration — departments, students, hostels, hackathons, marketplace moderation |
| **Society Portal** | `5175`                                                | Club Admins                       | React + Vite + Tailwind | CMS for societies — events, members, gallery, achievements, bulk email, certificates                |
| **Haazir Portal**  | `5176`                                                | Faculty / Students / Coordinators | React + Vite + Tailwind | Smart attendance — QR codes, face recognition, timetable generation, analytics                      |
| **Nexsus Mobile**  | —                                                     | Students                          | React Native (Expo 54)  | Full-featured mobile app — all student features natively on Android                                 |
| **Haazir Mobile**  | —                                                     | Faculty + Students                | React Native (Expo 54)  | Mobile attendance — session management, face setup, geofenced QR scan                               |
| **Student Tools**  | [Deployed](https://nexsus-tools-frontend.vercel.app/) | Students                          | React + Vite            | 20+ productivity utilities (PDF compressor, GPA calculator, resume builder, etc.)                   |

---

## ✨ Core Platform Modules

### 📚 Academic Hub

- **Intelligent PYQ Archive** — OCR-powered extraction (Tesseract.js) of previous year questions with AI-generated answers, search, and filtering by department/semester/batch
- **Structured Learning Resources** — Courses → Chapters → Video lectures, Notes, Reference books with progress tracking
- **Notice Board** — Pinned/categorized academic announcements with expiry dates
- **Know Your College** — Comprehensive college info: departments, hostels, placement records, alumni, fresher guide, campus places

### 🤖 AI Suite (5 Specialized Bots)

Built on **LangChain + LangGraph** with **RAG (Retrieval-Augmented Generation)**, powered by Google Gemini, Groq, and OpenAI:

| Bot                | Purpose                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Super Bot**      | Campus info chatbot — answers any question about MMMUT using RAG over a universal knowledge base (web-scraped + indexed) |
| **PYQ Expert**     | Analyzes past papers, generates AI-powered answers, identifies trends and important questions                            |
| **Career Guide**   | Personalized career roadmaps, skill gap analysis, and actionable study plans                                             |
| **Wellness Bot**   | Mood tracking, mental state persistence, crisis detection, and campus wellness resources                                 |
| **Code Assistant** | AI code help with syntax highlighting, debugging assistance, and concept explanations                                    |

**AI Infrastructure:**

- Vector store with pgvector embeddings for semantic search
- LangFuse observability for monitoring AI interactions
- Redis caching layer for response optimization
- Multi-provider API key rotation (Gemini, Groq, OpenAI, Anthropic)
- Persistent conversations with session management
- Admin-configurable rate limits per service

### 🎯 Haazir — Smart Attendance System

A complete attendance management sub-platform with its own web portal and mobile app:

- **3 Verification Methods**: QR-only, Face-only, QR + Face combined
- **Face Recognition**: Student face embedding registration (512D vectors), multi-angle capture, OTP-verified enrollment
- **Smart Class Photo Attendance**: Teacher uploads a class photo → system auto-marks attendance via face matching
- **Geofencing**: Location-based verification ensures students are physically present
- **QR Code Sessions**: Time-limited, faculty-generated QR codes for session-based attendance
- **Coordinator Dashboard**: Timetable generation, classroom management, college timing configuration, faculty assignment
- **Faculty Dashboard**: Session creation, real-time monitoring, attendance reports, slot exchange requests
- **Student Dashboard**: Attendance history, timetable view, face setup, elective selection, absence notifications
- **Exam Control System**: Semester/session-aware exam scheduling with draft editing, quick revalidation, and filtered exports
- **Visual Seating Planner**: Room-wise bench table showing exact roll-number placement with blocked-bench layout support
- **Strict Branch Separation**: No same-branch adjacency on same/neighbor benches; constrained seats are intentionally left vacant
- **Eligibility Filtering**: Fee-defaulter (excluded roll-number) filtering during seat generation

### 🏢 Super Admin Dashboard

22+ management pages for complete institutional control:

- **Master Data**: Departments, Courses (with syllabus units), Faculty, Batches, Sections
- **Student Management**: Manual entry + bulk CSV upload, auto-generated emails (`rollnumber@mmmut.ac.in`), roll-number lookup
- **Hostel & Room Management**: Bulk room creation, allocation tracking by academic year, occupancy monitoring
- **Mess Menu Management**: Hostel-specific daily meal schedules (breakfast, lunch, snacks, dinner)
- **Marketplace Moderation**: Listing approval/rejection workflow with admin history
- **AI Configuration**: Enable/disable bots, manage API keys, monitor usage logs
- **Hackathon Aggregator**: Auto-scrapes hackathons from Devpost, Unstop, HackEarth, Hack2Skill
- **Email System**: SMTP credential management, bulk emailing, templated notifications
- **Learning Content**: Course creation, chapter management, resource uploads (videos, notes, PDFs)
- **Competition Manager**: Hackathon management dashboard

### 🏛️ Societies & Clubs Portal

Full CMS for college societies with dedicated login credentials:

- **Rich Profiles**: HTML-based about pages, vision/mission statements, cover images, social links
- **Member Management**: Student-linked profiles with positions, bios, LinkedIn integration, joined year
- **Event System**: Event creation with custom registration forms (drag-and-drop form builder), registration tracking
- **Gallery**: Photo/video gallery with albums and highlights
- **Achievements**: Trophy/award showcase with descriptions and dates
- **Notices**: Society-specific announcements with priority levels and pinning
- **Bulk Email**: Send templated emails to registered members or event participants
- **Certificate Generation**: Auto-generate PDF certificates for event participants
- **Theme Customization**: Society-specific theme colors and branding
- **Instagram Integration**: Embed society Instagram feeds

### 🛒 Malviya Market (Campus Marketplace)

- Peer-to-peer buying/selling platform with admin verification
- Categories: Books, Electronics, Furniture, Clothing, Sports, Services
- Seller-buyer connection via email notifications
- Buy request workflow with status tracking and admin history audit trail

### 🔬 Virtual Labs

- Engineering labs simulated online (Physics, Programming, etc.)
- Experiments with theory, procedure, simulation, quiz, and viva
- Student progress tracking, activity logs, certificates, and feedback
- Mobile-compatible experiment views

### 🔍 Lost & Found Center

- Digital board for reporting lost/found items
- Search and filter by category, date, and location

### 🛠️ Student Utility Toolkit (20+ Tools)

**Deployed independently**: [nexsus-tools-frontend.vercel.app](https://nexsus-tools-frontend.vercel.app/)

Includes: YouTube Downloader, Image/PDF Converters, GPA/CGPA Calculator, Citation Generator, Resume Builder, Code Formatter, and more.

### 📱 Nexsus Mobile App

Full-featured React Native app for students with:

- Onboarding flow, authentication, profile management
- Notices, marketplace, PYQs, societies, events, hackathons
- AI chatbots, learning hub, services directory
- Push notifications, haptic feedback, offline caching (React Query + AsyncStorage)
- Dark mode, biometric authentication

---

## 🛠️ Tech Stack

### Frontend (Web)

| Technology           | Usage                           |
| -------------------- | ------------------------------- |
| React 18             | UI framework across all portals |
| TypeScript           | Type safety end-to-end          |
| Vite                 | Build tool and dev server       |
| Tailwind CSS         | Utility-first styling           |
| Framer Motion + GSAP | Animations and transitions      |
| Zustand              | State management (main client)  |
| React Router DOM v6  | Client-side routing             |
| Radix UI             | Accessible headless components  |
| Lucide React         | Iconography                     |
| Axios                | HTTP client                     |
| KaTeX                | Math equation rendering         |
| React Markdown       | Markdown rendering in AI chat   |

### Frontend (Mobile)

| Technology              | Usage                              |
| ----------------------- | ---------------------------------- |
| React Native 0.81       | Cross-platform mobile framework    |
| Expo SDK 54             | Managed workflow with EAS Build    |
| React Navigation 7      | Native navigation stack + tabs     |
| React Query (TanStack)  | Server state + offline persistence |
| Expo Camera             | Face capture for attendance        |
| Expo Location           | Geofence verification              |
| Expo Notifications      | Push notifications                 |
| Expo Secure Store       | Encrypted token storage            |
| React Native Reanimated | 60fps native animations            |

### Backend

| Technology           | Usage                                               |
| -------------------- | --------------------------------------------------- |
| Node.js + Express.js | REST API server                                     |
| TypeScript           | Full backend type safety                            |
| Prisma ORM           | Database access with 70+ models (2,240-line schema) |
| JWT + bcryptjs       | Authentication with role-based access control       |
| Multer + Cloudinary  | File upload and cloud storage                       |
| Nodemailer + Resend  | Dual email service (SMTP + API)                     |
| Playwright           | Web scraping engine (hackathons, college portal)    |
| Tesseract.js         | OCR for PYQ paper extraction                        |
| Zod                  | Runtime schema validation                           |
| pdf-lib              | PDF generation (certificates, reports)              |

### AI & ML

| Technology            | Usage                                          |
| --------------------- | ---------------------------------------------- |
| LangChain + LangGraph | AI orchestration framework with agentic graphs |
| Google Gemini         | Primary LLM provider                           |
| Groq                  | High-speed inference (Llama models)            |
| OpenAI                | Alternate LLM provider                         |
| pgvector              | Vector embeddings in PostgreSQL                |
| LangFuse              | AI observability and tracing                   |
| Redis (ioredis)       | Response caching layer                         |
| Custom embeddings     | BGE + Nomic Atlas for semantic search          |

### Database & Infrastructure

| Technology          | Usage                            |
| ------------------- | -------------------------------- |
| Supabase PostgreSQL | Managed database with PgBouncer  |
| pgvector extension  | Vector similarity search for RAG |
| Redis               | AI response caching              |
| Cloudinary          | Image/file CDN                   |
| Vercel              | Frontend deployments             |
| Render              | Backend deployment               |

---

## 🗄️ Database Schema Overview

The Prisma schema spans **2,240 lines** with **70+ models** organized into these domains:

```
┌─ Core Academic ──────────────────────────────┐
│  Department → Course → SyllabusUnit          │
│  Batch → Section → Student                   │
│  Faculty → CourseFacultyAssignment           │
├─ Attendance (Haazir) ────────────────────────┤
│  AttendanceSession → AttendanceRecord        │
│  StudentFace (512D embeddings)               │
│  AttendanceNotification                      │
├─ Timetable Generator ────────────────────────┤
│  TimetableConfig → TimetableVersion → Slot   │
│  Coordinator, Classroom, CollegeTiming       │
│  FacultyPreference → CourseOffering          │
│  TimetableFacultyAssignment                  │
├─ Campus Life ────────────────────────────────┤
│  Society → Member, Event, Post, Gallery      │
│  SocietyAchievement, SocietyNotice           │
│  EventForm → EventRegistration               │
│  MarketListing → BuyRequest → History        │
│  Hostel → Room → RoomAllocation              │
│  MessMenu, Notice, LostItem, FoundItem       │
├─ AI System ──────────────────────────────────┤
│  UniversalKnowledge (vector embeddings)      │
│  AIConversation → AIMessage                  │
│  AIUsageLog, AIServiceConfig, AIRateLimit    │
│  WellnessState, EmotionHistory               │
│  KnowledgeBase (legacy RAG)                  │
├─ Learning & PYQ ─────────────────────────────┤
│  Chapter → VideoLecture, Note, ReferenceBook │
│  PyqPaper → PyqQuestion                      │
├─ Virtual Labs ───────────────────────────────┤
│  VLabDiscipline → VLabExperiment             │
│  VLabProgress, VLabQuizQuestion              │
│  VLabCertificate, VLabFeedback               │
├─ College Info ───────────────────────────────┤
│  CollegeInfo, DepartmentDetails              │
│  HostelDetails, CollegePlace                 │
│  PlacementRecord, Alumni, FresherGuide       │
├─ Hackathons ─────────────────────────────────┤
│  ExternalHackathon, ScraperLog               │
│  Festival                                    │
└─ Email & Auth ───────────────────────────────┘
   User (RBAC), EmailLog, EmailSettings
   PasswordResetOtp, LoginOtp, EmailTemplate
```

Full schema: [`server/prisma/schema.prisma`](server/prisma/schema.prisma)

---

## 🔐 Authentication & Authorization

### Flow

1. User registers with email + password (or bulk-imported by admin)
2. Password hashed with **bcryptjs**
3. **JWT** token issued on login
4. Token validated on every authenticated request via middleware
5. **Role-Based Access Control (RBAC)** enforces permissions

### User Roles

| Role          | Access Level                                                     |
| ------------- | ---------------------------------------------------------------- |
| `SUPER_ADMIN` | Full system access — all admin pages, data management, AI config |
| `ADMIN`       | Department-level admin                                           |
| `FACULTY`     | Attendance sessions, timetable, reports, slot exchange           |
| `STUDENT`     | Public features, marketplace, AI bots, attendance                |
| `CLUB_ADMIN`  | Society portal — events, members, gallery, email                 |
| `COORDINATOR` | Timetable generation, faculty assignment, classroom management   |
| `ALUMNI`      | Alumni-specific access                                           |

---

## 🎨 API Surface

57 route files covering the entire platform. Key endpoint groups:

<details>
<summary><strong>Authentication & Users</strong></summary>

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — User login
- `GET /api/auth/me` — Get current user
- Password reset with OTP verification
</details>

<details>
<summary><strong>Academic & Admin</strong></summary>

- `/api/departments` — CRUD departments
- `/api/courses` — CRUD courses with syllabus units
- `/api/batches` — Batch management
- `/api/sections` — Section management
- `/api/students` — Student CRUD + bulk CSV upload
- `/api/faculty` — Faculty management
- `/api/hostels` — Hostel management
- `/api/rooms` — Room CRUD + bulk creation
- `/api/room-allocations` — Academic year-based room allocation
- `/api/mess-menus` — Hostel-specific mess menus
- `/api/notices` — Notice board CRUD
- `/api/college-info` — Know Your College data
</details>

<details>
<summary><strong>Societies & Events</strong></summary>

- `/api/societies` — Society CRUD with auth
- `/api/society/auth` — Society-specific login
- `/api/society/members` — Member management
- `/api/society/events` — Event CRUD
- `/api/event-forms` — Dynamic form builder
- `/api/event-registrations` — Registration tracking
- `/api/society/gallery` — Image gallery
- `/api/society/achievements` — Achievement showcase
- `/api/society/notices` — Society announcements
- `/api/instagram` — Instagram feed integration
</details>

<details>
<summary><strong>Marketplace</strong></summary>

- `/api/market` — Listing CRUD with admin approval workflow
- Buy requests, status history, seller notifications
</details>

<details>
<summary><strong>AI & Chatbots</strong></summary>

- `/api/nexus-ai` — Super Bot, Wellness, Career, Code, PYQ Expert
- `/api/ai` — Legacy AI routes
- Conversation persistence, usage tracking, rate limiting
</details>

<details>
<summary><strong>Attendance (Haazir)</strong></summary>

- `/api/attendance` — Session management, QR generation, face verification
- Auto-mark attendance via class photo
- Geofence validation
- Student/faculty dashboards
- Attendance reports and analytics
- `/api/exams` — Exam lifecycle, scheduler, seat arrangement generation/save, invigilator duty workflows
</details>

<details>
<summary><strong>Timetable Generator</strong></summary>

- `/api/timetable` — Timetable CRUD
- `/api/timetable-generator` — AI-powered timetable generation
- `/api/coordinators` — Coordinator management
- `/api/classrooms` — Classroom management
- `/api/college-timings` — Period/slot configuration
- `/api/course-offerings` — Semester course offerings
- `/api/faculty-preferences` — Faculty preference submission
- `/api/faculty-assignments` — Faculty-course assignment
- `/api/faculty-designations` — Workload designation
</details>

<details>
<summary><strong>Learning & PYQ's</strong></summary>

- `/api/pyq` — PYQ paper CRUD + OCR extraction + AI answers
- `/api/learning-resources` — Course → Chapter → Resources
</details>

<details>
<summary><strong>Other</strong></summary>

- `/api/lost-found` — Lost & Found board
- `/api/hackathons` — Aggregated hackathon listings
- `/api/virtual-labs` — Virtual lab experiments
- `/api/email` — Email sending + logs
- `/api/bulk-email` — Bulk email campaigns
- `/api/email-templates` — Templated emails
- `/api/email-credentials` — SMTP config management
- `/api/upload` — File upload (Cloudinary)
- `/api/pdf` — PDF generations
- `/api/metrics` — Platform analytics
- `/api/slot-exchange` — Faculty slot swap requests
- `/api/elective-enrollment` — Elective course enrollment
- `/api/public-events` — Public event listing
</details>

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- **Git**
- **Supabase** account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/priyu-1006/MMMUT-Nexsus.git
cd MMMUT-Nexsus/Nexsus

# Install root dependencies (installs server + client via workspaces)
npm install

# Install portal dependencies (each is independent)
cd admin-portal && npm install && cd ..
cd society-portal && npm install && cd ..
cd haazir-portal && npm install && cd ..
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"

# AI (at least one required for AI features)
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"        # Optional
GROQ_API_KEY="your-groq-api-key"            # Optional

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Initialize Database

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Push schema to Supabase
npm run prisma:push

# (Optional) Open Prisma Studio to inspect data
npm run prisma:studio
```

> **Note:** Enable the `pgvector` extension in your Supabase project for AI features: Supabase Dashboard → Database → Extensions → Search "vector" → Enable.

### 4. Run the Platform

#### Development (Frontend + Backend concurrently)

```bash
# From the root Nexsus/ directory
npm run dev
# → Backend at http://localhost:5000
# → Main Client at http://localhost:5173
```

#### Individual Portals

```bash
# Admin Portal
cd admin-portal && npm run dev    # → http://localhost:5174

# Society Portal
cd society-portal && npm run dev  # → http://localhost:5175

# Haazir Portal
cd haazir-portal && npm run dev   # → http://localhost:5176
```

#### Mobile Apps

```bash
# Nexsus Mobile
cd nexsus-mobile && npm start     # Expo Go / Dev Build

# Haazir Mobile
cd haazir-mobile && npm start     # Expo Go / Dev Build
```

#### Production Build

```bash
cd client && npm run build
cd ../server && npm run build && npm start
```

---

## 📁 Project Structure

```
Nexsus/
├── client/                        # 🌐 Main public website (React + Vite)
│   └── src/
│       ├── pages/                 #   24 pages + AI suite (6 bots) + Virtual Labs (3)
│       ├── components/            #   66 components (home, events, marketplace, pyq, societies, learning, UI)
│       ├── hooks/                 #   Custom React hooks
│       ├── context/               #   Auth context provider
│       └── styles/                #   Global CSS
│
├── admin-portal/                  # 🔧 Super Admin dashboard (React + Vite)
│   └── src/
│       ├── pages/                 #   22 admin pages + competition manager
│       └── components/            #   60 admin components
│
├── society-portal/                # 🏛️ Society CMS portal (React + Vite)
│   └── src/
│       ├── pages/                 #   17 pages (events, gallery, members, email, certificates)
│       └── components/            #   86 components
│
├── haazir-portal/                 # 📋 Attendance web portal (React + Vite)
│   └── src/
│       ├── pages/                 #   24 pages (coordinator, faculty, student dashboards + exam seating planner)
│       └── components/            #   14 components
│
├── nexsus-mobile/                 # 📱 Student mobile app (React Native + Expo 54)
│   └── src/
│       ├── screens/               #   37 screens across 16 categories
│       ├── services/              #   API service layer
│       └── navigation/            #   Stack + Tab navigators
│
├── haazir-mobile/                 # 📱 Attendance mobile app (React Native + Expo 54)
│   └── src/
│       ├── screens/               #   27 screens (faculty 14, student 9, auth)
│       ├── services/              #   14 service modules
│       └── navigation/            #   Role-based navigation
│
├── server/                        # ⚙️ Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/           #   52 controller files
│   │   ├── routes/                #   57 route files
│   │   ├── services/              #   Email, Face Recognition, Hackathon scrapers, Timetable
│   │   ├── lib/                   #   AI (LangChain, RAG, embeddings), Cloudinary, PDF, email
│   │   │   └── langchain/         #     14 files (agents, graphs, vector store, RAG chain)
│   │   ├── scraper/               #   Web scraper (Playwright-based)
│   │   ├── middleware/            #   Auth + validation middleware
│   │   └── scripts/               #   62 seed/utility scripts
│   └── prisma/
│       └── schema.prisma          #   2,240-line schema with 70+ models
│
├── virtual-labs-app/              # 🔬 Virtual labs standalone app
├── docs/                          # 📚 34 documentation files
├── scraped_content/               # 🕷️ Scraped college portal data (for AI indexing)
└── package.json                   # Root workspace config (client + server)
```

---

## 📊 Codebase Stats

| Metric                    | Count                                   |
| ------------------------- | --------------------------------------- |
| Web Portals               | 5 (Main, Admin, Society, Haazir, Tools) |
| Mobile Apps               | 2 (Nexsus + Haazir)                     |
| Backend Route Files       | 57                                      |
| Backend Controllers       | 52                                      |
| Prisma Models             | 70+                                     |
| Schema Lines              | 2,240                                   |
| Client Pages              | 33 (24 main + 6 AI + 3 VLabs)           |
| Admin Pages               | 26                                      |
| Society Portal Pages      | 17                                      |
| Haazir Portal Pages       | 24                                      |
| Mobile Screens (Nexsus)   | 37                                      |
| Mobile Screens (Haazir)   | 27                                      |
| AI Bot Services           | 5                                       |
| Documentation Files       | 34                                      |
| Total Frontend Components | 226+                                    |

---

## 📚 Documentation

Detailed documentation lives in the [`docs/`](docs/) directory:

| Document                                                         | Description                       |
| ---------------------------------------------------------------- | --------------------------------- |
| [Architecture](docs/ARCHITECTURE.md)                             | High-level system design          |
| [Architecture (Detailed)](docs/ARCHITECTURE_DOCUMENTATION.md)    | In-depth architecture analysis    |
| [Installation Guide](docs/INSTALLATION.md)                       | Comprehensive setup instructions  |
| [Quick Start](docs/QUICK_START.md)                               | Fast onboarding guide             |
| [Admin Portal Guide](docs/ADMIN_PORTAL_QUICK_START.md)           | Admin dashboard documentation     |
| [Super Admin Guide](docs/SUPER_ADMIN_GUIDE.md)                   | Complete admin feature guide      |
| [Multi-Portal Architecture](docs/MULTI_PORTAL_ARCHITECTURE.md)   | Portal separation rationale       |
| [Haazir Documentation](docs/HAAZIR_DOCUMENTATION.md)             | Attendance system docs            |
| [Haazir App Docs](docs/HAAZIR_APP_DOCUMENTATION.md)              | Mobile attendance app guide       |
| [Timetable Workflow](docs/TIMETABLE_WORKFLOW.md)                 | Timetable generation architecture |
| [Chatbot & Haazir Workflow](docs/CHATBOT_AND_HAAZIR_WORKFLOW.md) | AI + Attendance integration       |
| [Security Fixes Guide](docs/SECURITY_FIXES_GUIDE.md)             | Security hardening documentation  |
| [Nexsus Features](docs/NEXSUS_FEATURES.md)                       | Complete feature listing          |
| [File Structure](docs/FILE_STRUCTURE.md)                         | Codebase organization             |

---

## 🚀 Deployment

| Component     | Platform  | URL                                                                           |
| ------------- | --------- | ----------------------------------------------------------------------------- |
| Main Client   | Vercel    | `mmmut-nexsus.vercel.app`                                                     |
| Admin Portal  | Vercel    | `mmmut-nexsus-admin.vercel.app`                                               |
| Haazir Portal | Vercel    | `haazir-nexsus.vercel.app`                                                    |
| Student Tools | Vercel    | [nexsus-tools-frontend.vercel.app](https://nexsus-tools-frontend.vercel.app/) |
| Backend API   | Render    | Deployed                                                                      |
| Database      | Supabase  | Managed PostgreSQL                                                            |
| Mobile Apps   | EAS Build | Android APKs via Expo                                                         |

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Tips

- Run `npm run prisma:studio` to visually inspect the database
- Use `npm run prisma:generate` after any schema changes
- Each portal can be developed independently — they share only the backend API
- Check `server/.env.example` for all available environment variables

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed with 💙 by the **MMMUT Nexsus Team**

---

## 🙏 Acknowledgments

- **MMMUT** (Madan Mohan Malaviya University of Technology) — Campus community and inspiration
- **Supabase** — Managed PostgreSQL + Auth infrastructure
- **Google Gemini & LangChain** — AI/RAG capabilities
- **Vercel & Render** — Hosting and deployment
- **Expo** — React Native managed workflow

---

<div align="center">

**Made with 💙 for MMMUT Gorakhpur**

_Replacing 10+ fragmented tools with one unified platform._

[⬆ Back to Top](#-mmmut-nexsus--universe)

</div>
