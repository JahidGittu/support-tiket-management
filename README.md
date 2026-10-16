# 🚀 Support Ticket Management System — Intelligent Customer Support & Smart Queue

An end-to-end full-stack customer support and issue resolution platform.

Support Ticket Management automates issue triage by analyzing user-submitted support tickets using **Google Gemini AI** to predict categories, urgency levels, and generate professional response drafts for support agents.

---

## 🌟 Key Features

- **Automated AI Triage:** Classifies support tickets into categories (`BILLING`, `TECHNICAL`, `ACCOUNT`, `GENERAL`) and priorities (`URGENT`, `HIGH`, `MEDIUM`, `LOW`) using Google Gemini with reliable keyword fallback.
- **Role-Based Access Control (RBAC):** Three distinct roles:
  - **CUSTOMER:** Submit tickets, view progress, and reply.
  - **AGENT:** View assigned queue, update ticket statuses (`IN_PROGRESS`, `RESOLVED`, `CLOSED`), and use AI-drafted replies.
  - **ADMIN:** Full system visibility, filter and assign tickets to support staff.
- **Clean Relational Database:** Powered by PostgreSQL and Prisma ORM with strict foreign keys, indexing, and cascade delete protection.
- **Human-Centric & Fast UI:** Responsive React dashboard with instant status filters, search, and dynamic modals.
- **Type-Safe Validation:** Zod schemas applied across client and server boundaries.
- **Unit Tested:** Business calculations and workflow state transitions validated via Vitest.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **AI Integration** | Google Gemini API (Structured JSON & Fallback) |
| **Security** | JWT (JSON Web Tokens), Bcryptjs Password Hashing |
| **Validation & Testing** | Zod Schema Validation, Vitest Test Suite |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v20+ or v24+)
- PostgreSQL service running locally on port 5432

### 2. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Ensure DATABASE_URL and GEMINI_API_KEY are configured in .env
npx prisma db push
npm run seed     # Seeds demo users and sample tickets
npm run dev      # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev      # Starts client on http://localhost:5173
```

---

## 👥 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@supportticket.com` | `password123` |
| **Support Agent** | `agent@supportticket.com` | `password123` |
| **Customer** | `arif@example.com` | `password123` |

---

## 🏗️ Architecture & Data Flow

1. **Client Submission:** React frontend sends ticket data with client validation.
2. **API Layer:** Express route validates payload via Zod and checks JWT auth.
3. **AI Triage:** Gemini 2.5 Flash classifies category, urgency, and auto-generates agent drafts with keyword heuristic fallback.
4. **Database Persistence:** PostgreSQL via Prisma stores ticket, user relations, and audit activity.
5. **Real-Time Notification:** Frontend reflects unread ticket events and SLA metrics dynamically.
