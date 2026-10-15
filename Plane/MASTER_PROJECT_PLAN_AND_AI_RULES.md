# 📋 MASTER SPECIFICATION & ARCHITECTURAL BLUEPRINT
**Project:** ResolveDesk AI — AI-Powered Support Ticket Management System  
**Organization / Assessment:** NT Tech Innovation | Full-Stack Developer Assessment  
**Submission Target:** 17 October 2026 | **Physical Review & Live Coding:** 18 October 2026  
**Document Path:** `C:\Users\USAMA\Desktop\interview\Project\Plane\MASTER_PROJECT_PLAN_AND_AI_RULES.md`

---

> [!IMPORTANT]
> ### 🚨 BINDING GOVERNANCE FOR ALL DEVELOPERS & AI MODELS (বাধ্যতামূলক দিকনির্দেশনা)
> এই ডকুমেন্টটি **ResolveDesk AI** প্রজেক্টের একমাত্র ও চূড়ান্ত আনুষ্ঠানিক দিকনির্দেশনা (Single Source of Truth)।  
> বর্তমান এআই বা ভবিষ্যতে অন্য যেকোনো এআই মডেল (Claude, ChatGPT, Cursor ইত্যাদি) অথবা কোনো ডেভেলপার যখনই এই প্রজেক্টের কোড লিখবে বা এডিট করবে—তাকে নিচের ১০টি স্পেসিফিকেশন চেকলিস্ট, সহজ নামকরণ নীতি, ডিরেক্টরি কাঠামো এবং এআই ব্যবহারের সীমারেখা ১০০% অক্ষরে অক্ষরে মেনে চলতে হবে।

---

## 📑 স্পেসিফিকেশন ও প্রস্তুতি চেকলিস্ট (10/10 Complete Checklist)

- [x] **১. Project Scope (প্রজেক্ট পরিধি ও সীমানা)**
- [x] **২. Architecture (সিস্টেম আর্কিটেকচার ও ডেটা ফ্লো)**
- [x] **৩. Database Design & ER Diagram (ডাটাবেজ রিলেশন)**
- [x] **৪. API Contract & Error Cases (এন্ডপয়েন্ট ও এরর রেসপন্স)**
- [x] **৫. Security & Ownership Checks (নিরাপত্তা ও অ্যাক্সেস কন্ট্রোল)**
- [x] **৬. AI Feature, Privacy & Fallback (এআই ট্রায়াজ ও ফলব্যাক)**
- [x] **৭. Code Standards & Naming (সহজ কোডিং মানদণ্ড)**
- [x] **৮. Testing Strategy (Vitest টেস্ট কেস)**
- [x] **৯. Git & Delivery Plan (কমিট শৃঙ্খলা ও ডেপ্লয়মেন্ট)**
- [x] **১০. Live Review Preparation & The 7 Tasks (লাইভ কোডিং প্রস্তুতি)**

---

## ১. Project Scope (প্রজেক্টের পরিধি ও সীমানা)

### ১.১ লক্ষ্য ও সমস্যা (Problem Statement):
সাপোর্ট ডেস্কে প্রতিদিন জমা পড়া শত শত টিকিটের ক্যাটাগরি ও প্রায়োরিটি ম্যানুয়ালি নির্ধারণ করতে প্রচুর সময় নষ্ট হয়। **ResolveDesk AI** একটি আধুনিক ফুল-স্ট্যাক প্ল্যাটফর্ম যা গ্রাহকের টিকিট গ্রহণ করে, **Google Gemini AI** দিয়ে স্বয়ংক্রিয়ভাবে ট্রায়াজ (Triage) করে ক্যাটাগরি ও প্রায়োরিটি নির্ধারণ করে এবং এজেন্টের জন্য তাৎক্ষণিক খসড়া উত্তরের পরামর্শ তৈরি করে।

### ১.২ ব্যবহারকারীর ভূমিকা (User Roles):
1. **CUSTOMER (গ্রাহক):**
   - টিকিট সাবমিট করা (টাইটেল ও বিস্তারিত সমস্যা)।
   - নিজের তৈরি টিকিটের অগ্রগতি দেখা ও মেসেজে রিপ্লাই দেওয়া।
2. **AGENT (সাপোর্ট এজেন্ট):**
   - সকল বা নিজের অ্যাসাইন করা টিকিট দেখা।
   - স্ট্যাটাস পরিবর্তন করা (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`)।
   - এআই সাজেশনের সাহায্য নিয়ে দ্রুত নির্ভুল রিপ্লাই দেওয়া।
3. **ADMIN (অ্যাডমিন):**
   - পুরো সিস্টেম পর্যবেক্ষণ, যেকোনো টিকিট যেকোনো এজেন্টের কাছে অ্যাসাইন করা।
   - ক্যাটাগরি ও প্রায়োরিটি অনুযায়ী ফিল্টারিং ও অ্যানালিটিক্স দেখা।

### ১.৩ MVP-তে যা থাকবে না (What is Out of Scope for MVP):
- জটিল থার্ড পার্টি পেমেন্ট গেটওয়ে ইন্টিগ্রেশন (শুধু টিকিট ম্যানেজমেন্টের মধ্যে সীমাবদ্ধ)।
- ভিডিও/অডিও চ্যাট বা জটিল মাল্টি-চ্যানেল টেলিফোনি সিস্টেম।
- ভারী মাইক্রোসার্ভিস আর্কিটেকচার (ইন্টারভিউতে যেন ক্যান্ডিডেট সহজেই একটি সার্ভারে রান ও ব্যাখ্যা করতে পারে)।

---

## ২. Architecture (সিস্টেম আর্কিটেকচার ও ডেটা ফ্লো)

```
[ Frontend: React + Vite + Tailwind CSS ]
                    │
                    ▼  (REST API / JSON / JWT Bearer)
[ Backend: Node.js + Express.js + TypeScript ]
  ├── [ Middleware: authGuard, roleGuard, validate(Zod), errorHandler ]
  ├── [ Controllers: authController, ticketController, aiController ]
  └── [ Services: ticketService, geminiService ]
          │                           │
          ▼                           ▼
[ Database: PostgreSQL ]      [ External AI: Google Gemini ]
  (via Prisma ORM)             (JSON Mode with Regex Fallback)
```

### ডেটা ফ্লো:
1. ইউজার ফ্রন্টএন্ড থেকে টিকিট সাবমিট করে।
2. ব্যাকএন্ডের `authGuard` টোকেন যাচাই করে এবং `Zod` ইনপুট ভ্যালিডেট করে।
3. `geminiService` ব্যাকগ্রাউন্ডে টেক্সট বিশ্লেষণ করে ক্যাটাগরি ও প্রায়োরিটি নির্ধারণ করে।
4. `ticketService` প্রিজমার মাধ্যমে পোস্টগ্রেস ডাটাবেজে রেকর্ড সেভ করে।
5. ফ্রন্টএন্ড রিয়েল-টাইম রেসপন্স পেয়ে UI কার্ড ও টেবিল আপডেট করে।

---

## ৩. Database Design & ER Diagram

```
┌─────────────────────────┐          ┌──────────────────────────────────┐
│          User           │          │              Ticket              │
├─────────────────────────┤          ├──────────────────────────────────┤
│ id (UUID, PK)           │ 1      * │ id (UUID, PK)                    │
│ email (String, Unique)  │──────────│ customerId (FK -> User.id)       │
│ name (String)           │          │ assignedToId (FK -> User.id, Opt)│
│ password (Hash)         │ 1      * │ title (String)                   │
│ role (CUSTOMER/AGENT/   │──────────│ description (Text)               │
│       ADMIN)            │          │ category (BILLING/TECH/ACC/GEN)  │
│ createdAt (DateTime)    │          │ priority (URGENT/HIGH/MED/LOW)   │
└─────────────────────────┘          │ status (OPEN/IN_PROG/RESOLVED)   │
                                     │ aiSummary (String, Opt)          │
                                     │ aiSuggestedReply (Text, Opt)     │
                                     │ createdAt / updatedAt (DateTime) │
                                     └──────────────────────────────────┘
                                                       │ 1
                                                       │
                                                       │ *
                                     ┌──────────────────────────────────┐
                                     │          TicketComment           │
                                     ├──────────────────────────────────┤
                                     │ id (UUID, PK)                    │
                                     │ message (Text)                   │
                                     │ isInternal (Boolean)             │
                                     │ ticketId (FK -> Ticket.id)       │
                                     │ userId (FK -> User.id)           │
                                     │ createdAt (DateTime)             │
                                     └──────────────────────────────────┘
```

### Prisma Schema Definition (`Backend/prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  AGENT
  CUSTOMER
}

enum Priority {
  URGENT
  HIGH
  MEDIUM
  LOW
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum Category {
  BILLING
  TECHNICAL
  ACCOUNT
  GENERAL
}

model User {
  id              String          @id @default(uuid())
  email           String          @unique
  name            String
  password        String
  role            Role            @default(CUSTOMER)
  createdTickets  Ticket[]        @relation("CustomerTickets")
  assignedTickets Ticket[]        @relation("AssignedAgentTickets")
  comments        TicketComment[]
  createdAt       DateTime        @default(now())
}

model Ticket {
  id             String          @id @default(uuid())
  title          String
  description    String
  category       Category        @default(GENERAL)
  priority       Priority        @default(MEDIUM)
  status         TicketStatus    @default(OPEN)
  
  aiSummary      String?
  aiSuggestedReply String?
  
  customerId     String
  customer       User            @relation("CustomerTickets", fields: [customerId], references: [id], onDelete: Cascade)
  
  assignedToId   String?
  assignedTo     User?           @relation("AssignedAgentTickets", fields: [assignedToId], references: [id], onDelete: SetNull)
  
  comments       TicketComment[]
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([status])
  @@index([priority])
  @@index([customerId])
}

model TicketComment {
  id        String   @id @default(uuid())
  message   String
  isInternal Boolean @default(false)
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

---

## ৪. API Contract & Error Cases (ক্লিন REST এন্ডপয়েন্টস)

| Method | Endpoint | Access | রিকোয়েস্ট বডি / প্যারাম | সাকসেস (200/201) | এরর কেস (Status & Message) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | `{ name, email, password, role? }` | `{ token, user }` | `400` Validation Error / Email taken |
| `POST` | `/api/v1/auth/login` | Public | `{ email, password }` | `{ token, user }` | `401` Invalid credentials |
| `GET`  | `/api/v1/auth/me` | Logged In | Header: `Bearer <token>` | `{ user }` | `401` Missing or expired token |
| `GET`  | `/api/v1/tickets` | Logged In | Query: `?status=OPEN&priority=HIGH` | `[{ ticket, customer }]` | `401` Unauthorized |
| `POST` | `/api/v1/tickets` | Customer/Admin | `{ title, description }` | `{ ticket }` | `400` Title < 3 chars / invalid fields |
| `GET`  | `/api/v1/tickets/:id` | Logged In | URL Param: `id` | `{ ticket, comments }` | `404` Ticket not found, `403` Forbidden |
| `PATCH`| `/api/v1/tickets/:id/status` | Agent/Admin | `{ status: "RESOLVED" }` | `{ ticket }` | `400` Invalid status, `403` Role denied |
| `PATCH`| `/api/v1/tickets/:id/assign` | Admin | `{ agentId: "uuid" }` | `{ ticket }` | `404` Agent not found, `403` Not admin |
| `POST` | `/api/v1/tickets/:id/comments` | Logged In | `{ message, isInternal? }` | `{ comment }` | `400` Empty message |
| `POST` | `/api/v1/ai/classify` | Logged In | `{ title, description }` | `{ category, priority, reply }` | `200` (Fallback if AI fails) |

### স্ট্যান্ডার্ড এরর রেসপন্স ফরম্যাট:
```json
{
  "success": false,
  "message": "Title must be at least 5 characters long",
  "errors": []
}
```

---

## ৫. Security & Ownership Checks (নিরাপত্তা ও অ্যাক্সেস পলিসি)

1. **পাসওয়ার্ড নিরাপত্তা:** `bcryptjs` দিয়ে সল্টিং (salt rounds = 10) সহ পাসওয়ার্ড হ্যাশিং। ডেটাবেজে কোনো প্লেইন পাসওয়ার্ড সেভ হয় না।
2. **অথেনটিকেশন:** সাইনড JSON Web Token (JWT) যাতে ইউজার আইডি ও রোল এনকোড করা থাকে।
3. **ওনারশিপ পলিসি (Ownership Guard):**
   - একজন সাধারণ `CUSTOMER` শুধুমাত্র তার নিজের তৈরি টিকিট দেখতে ও কমেন্ট করতে পারে (`customerId === req.user.id`)।
   - `AGENT` ও `ADMIN` সকল ওপেন ও অ্যাসাইনড টিকিট অ্যাক্সেস করতে পারে।
4. **রোল গার্ড (RBAC):** স্ট্যাটাস পরিবর্তন এবং টিকিট অ্যাসাইনমেন্ট মেথডে `roleGuard(['AGENT', 'ADMIN'])` দিয়ে সুরক্ষিত।
5. **ইনপুট স্যানিটাইজেশন:** ক্লায়েন্ট ও সার্ভার দুই স্তরেই `Zod` দিয়ে টাইপ ও লেন্থ ভ্যালিডেশন।
6. **সিক্রেটস প্রোটেকশন:** কোনো ডাটাবেজ পাসওয়ার্ড বা জেমিনি এপিআই কি কোডে হার্ডকোড করা থাকবে না; সব `.env` ও `.env.example`-এ থাকবে।

---

## ৬. AI Feature: Privacy, Fallback & Testing (এআই ট্রায়াজ)

### ৬.১ ইনপুট ও আউটপুট কন্ট্রাক্ট:
- **ইনপুট:** `{ title: string, description: string }`
- **প্রম্পট নিয়ম:** জেমিনিকে কঠোরভাবে সিস্টেম নির্দেশনায় শুধু একটি JSON অবজেক্ট রিটার্ন করতে বলা হবে।
- **আউটপুট:**
  ```json
  {
    "category": "BILLING",
    "priority": "URGENT",
    "aiSummary": "bKash transaction charged but subscription inactive",
    "aiSuggestedReply": "Hello! We apologize for the delay. Please share your transaction ID so we can verify with our billing team immediately."
  }
  ```

### ৬.২ প্রাইভেসী (Data Privacy):
- কাস্টমারের কোনো সংবেদনশীল ডেটা (যেমন পাসওয়ার্ড, জাতীয় পরিচয়পত্র) এআই এপিআইতে পাঠানো হয় না; শুধুমাত্র সমস্যার বিবরণ পাঠানো হয়।

### ৬.৩ শক্তিশালী ফলব্যাক মেকানিজম (Offline/Quota Fallback):
- যদি জেমিনি এপিআই রেসপন্স করতে দেরি করে বা কোটা শেষ হয়ে যায়, কোড ক্র্যাশ করবে না।
- ব্যাকএন্ড সার্ভিসের ভেতরে লোকাল কি-ওয়ার্ড অ্যানালাইজার রাখা হয়েছে:
  - যদি টাইটেলে `urgent`, `down`, `payment`, `bkash`, `broken` থাকে ➔ `URGENT` / `HIGH` প্রায়োরিটি ও `BILLING`/`TECHNICAL` সেট হবে।
  - অন্যথায় ডিফল্ট `GENERAL` ও `MEDIUM` সেট হয়ে স্বাভাবিকভাবে টিকিট সংরক্ষিত হবে।

---

## ৭. Code Standards & Naming (সহজ কোডিং মানদণ্ড)

1. **সহজ ইংরেজি কী-ওয়ার্ড ব্যবহার:**
   - ভ্যারিয়েবল: `tickets`, `selectedTicket`, `loading`, `error`, `role`, `status`
   - ফাংশন: `getTickets`, `createTicket`, `updateTicketStatus`, `assignAgent`, `addComment`
2. **ছোট ও একক দায়িত্ববান ফাংশন (Small Functions):**
   - প্রতিটি কন্ট্রোলার ফাংশন ২০-৩০ লাইনের মধ্যে সীমাবদ্ধ। কোনো ২০০ লাইনের মনোলিথিক ফাংশন থাকবে না।
3. **ধারাবাহিক এরর হ্যান্ডলিং:**
   - কেন্দ্রীয় `errorHandler` মিডলওয়্যার যা সব আনহ্যান্ডেলড এক্সেপশন ও Zod এররকে সুন্দর JSON আকারে পাঠায়।
4. **অপ্রয়োজনীয় অ্যাবস্ট্রাকশন পরিহার:**
   - কোনো ফ্যাক্টরি প্যাটার্ন, ডেকোরেটর প্যাটার্ন বা রিডার-মোনাড নেই। সরাসরি Controller ➔ Service ➔ Prisma।

---

## ৮. Testing Strategy (Vitest টেস্ট কেস)

আমরা **Vitest** দিয়ে লাইটওয়েট এবং অত্যন্ত দ্রুত টেস্ট লিখব:
1. **টিকিট স্ট্যাটাস ট্রানজিশন টেস্ট:**
   - `OPEN` থেকে `IN_PROGRESS` এবং `RESOLVED`-এ বৈধ ট্রানজিশন পরীক্ষা।
   - অবৈধ ট্রানজিশন (`CLOSED` থেকে সরাসরি রি-ওপেন না করার নিয়ম) যাচাই।
2. **Zod ভ্যালিডেশন টেস্ট:**
   - ৩ অক্ষরের কম টাইটেল দিলে রিজেক্ট করে কি না।
3. **এআই ফলব্যাক লজিক টেস্ট:**
   - এআই অফলাইন থাকলে লোকাল কি-ওয়ার্ড ফলব্যাক সঠিক প্রায়োরিটি রিটার্ন করে কি না।

---

## ৯. Git ও Delivery Plan (কমিট শৃঙ্খলা ও ডেপ্লয়মেন্ট)

### গিট কমিট হিস্ট্রি (স্বাভাবিক মানুষের মতো ধাপে ধাপে):
1. `feat(backend): initialize express server, typescript, and prisma schema`
2. `feat(auth): implement jwt authentication, bcrypt hashing and role guards`
3. `feat(tickets): build ticket crud apis with zod input validation`
4. `feat(ai): integrate gemini api for ticket classification and auto-reply`
5. `feat(frontend): build responsive ticket dashboard with tailwind and filters`
6. `test: add vitest unit tests for ticket status transitions and validation`
7. `docs: add comprehensive readme with setup guide and test credentials`

### ডেপ্লয়মেন্ট প্রস্তুতি (Deployment Ready):
- ব্যাকএন্ডের জন্য `npm run build` ➔ `node dist/server.js` (PM2 রেডি)।
- ফ্রন্টএন্ডের জন্য `npm run build` ➔ Nginx স্ট্যাটিক সাইট সার্ভিং।
- `.env.example` ফাইলে সব প্রয়োজনীয় এনভায়রনমেন্ট ভ্যারিয়েবলের নমুনা সংযুক্ত।

---

## ১০. Live Review Preparation: ৭টি লাইভ টাস্ক ও ডিফেন্স গাইড

ইন্টারভিউ বোর্ডে (Level 7D, Silicon Tower, Rajshahi) পরীক্ষক স্ক্রিন দেখে যে যে লাইভ পরিবর্তন চাইতে পারেন:

| সম্ভাব্য লাইভ টাস্ক | কোন ধারণাটি বুঝতে হবে | কোথায় হাত দিতে হবে | কত সময় লাগবে |
| :--- | :--- | :--- | :---: |
| **১. Form validation ঠিক করা** | State, Zod schema ও Error message | `ticketValidators.ts` & `CreateTicketModal.tsx` | ১ মিনিট |
| **২. API-তে bug ঠিক করা** | Request body, response status codes | `ticketController.ts` | ২ মিনিট |
| **৩. ভুল permission ঠিক করা** | Auth token vs Role check (RBAC) | `authGuard.ts` & `roleGuard.ts` | ১ মিনিট |
| **৪. Database query পরিবর্তন** | Prisma `where`, `include`, `orderBy` | `ticketService.ts` | ২ মিনিট |
| **৫. Status update যোগ করা** | Business logic ও PATCH API | `ticketController.ts` & Button onClick | ১ মিনিট |
| **৬. Loading / error state যোগ করা** | Async state ও Tailwind spinner | `TicketList.tsx` (`loading && <Spinner />`) | ১ মিনিট |
| **৭. Bug-এর regression test লেখা** | Vitest expect assertions | `ticketWorkflow.test.ts` | ২ মিনিট |

### প্রতিটি ফিচারের ক্ষেত্রে নিজেকে ৪টি প্রশ্ন করা:
1. **এই কোডটি কী কাজ করে?** (সাপোর্ট টিকিট গ্রহণ, ফিল্টারিং ও স্ট্যাটাস ট্র্যাকিং)
2. **এইভাবে কেন লেখা হয়েছে?** (PostgreSQL রিলেশনাল ইন্টিগ্রিটি ও Zod টাইপ-সেফটির জন্য)
3. **ভুল input এলে কী হবে?** (Zod স্কিমা এরর রিটার্ন করবে এবং UI-তে পরিষ্কার এরর দেখাবে)
4. **আমাকে এখন ছোট পরিবর্তন করতে বললে কীভাবে শুরু করব?** (`schema.prisma` তে ফিল্ড যোগ ➔ `npx prisma db push` ➔ ভ্যালিডেটর ও ফর্মে ইনপুট যোগ)

---

## ১১. AI Coding Assistant ব্যবহারের সীমা ও নীতি (AI Usage Boundaries)

1. **শেখা ও আর্কিটেকচার বোঝার কাজে ব্যবহার:** এআই থেকে কনসেপ্ট বোঝা, ডকুমেন্টেশন চেক করা ও কাঠামোগত প্রশ্নের উত্তর নেওয়া যাবে।
2. **অযাচিত ব্ল্যাক-বক্স কোড নিষিদ্ধ:** এমন কোনো লাইব্রেরি বা কোড রাখা যাবে না যার প্রতিটি লাইনের অর্থ ক্যান্ডিডেট নিজে জানে না।
3. **সহজ ও মানুষের মতো স্বাভাবিক কোড:** কোডের ধরন সহজবোধ্য ও স্বাভাবিক হবে; কোনো কৃত্রিম লুকোচুরি থাকবে না।
4. **স্বাধীনভাবে ব্যাখ্যা করার সক্ষমতা:** প্রজেক্টের প্রতিটি টেবিল, এন্ডপয়েন্ট ও ফাংশন ক্যান্ডিডেট নিজের ভাষায় সাবলীলভাবে বোর্ডে উপস্থাপন করতে সক্ষম থাকবে।
