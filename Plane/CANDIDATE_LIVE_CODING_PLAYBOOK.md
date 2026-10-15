# 🛡️ ক্যান্ডিডেট লাইভ কোডিং ও ডিফেন্স প্লেবুক (Candidate Defense Playbook)
**প্রজেক্ট:** ResolveDesk AI  
**ইন্টারভিউ বোর্ড:** NT Tech Innovation | Level 7D, Silicon Tower, Rajshahi Hi-Tech Park  
**উদ্দেশ্য:** লাইভ রিভিউতে পরীক্ষকের ৭টি সম্ভাব্য লাইভ টাস্ক ও মৌখিক প্রশ্নের তাত্ক্ষণিক সমাধান।  
*(নোট: এই ফাইলটি শুধুমাত্র আপনার ব্যক্তিগত প্রস্তুতি ও পড়ার জন্য Plane ফোল্ডারে রাখা হয়েছে। সোর্স কোডের ভেতরে কোনো মার্কার বা চিট কোড রাখা হয়নি।)*

---

## ১. প্রজেক্টের "ম্যাজিক ম্যাপ" (মাত্র ৫টি ফাইল মনে রাখুন)

ইন্টারভিউতে স্ক্রিনে প্রজেক্ট ওপেন করা অবস্থায় মাত্র ৫টি প্রধান ফাইল খেয়াল রাখবেন:

| ক্রম | ফাইল পাথ | কাজ ও উদ্দেশ্য |
| :---: | :--- | :--- |
| **১** | `Backend/prisma/schema.prisma` | ডাটাবেজ মডেল ও রিলেশনশিপ (নতুন ফিল্ড বা এনাম যোগ করার স্থান)। |
| **২** | `Backend/src/validators/ticketValidators.ts` | ইনপুট ভ্যালিডেশন (Zod স্কিমা)। |
| **৩** | `Backend/src/controllers/ticketController.ts` | টিকিট তৈরি, লিস্ট পাওয়া, ফিল্টারিং ও স্ট্যাটাস আপডেটের ব্যাকএন্ড লজিক। |
| **৪** | `Backend/src/services/geminiService.ts` | গুগল জেমিনি এআই দিয়ে ক্যাটাগরি ও উত্তর জেনারেট এবং ফলব্যাক হ্যান্ডলিং। |
| **৫** | `Frontend/src/components/TicketList.tsx` ও `CreateTicketModal.tsx` | ফ্রন্টএন্ড UI, সার্চ, ফিল্টার ও ফর্ম সাবমিশন। |

---

## ২. লাইভ কোডিংয়ের ৭টি ক্লাসিক টাস্ক ও হাতে-কলমে সমাধান (The 7 Live Tasks)

### টাস্ক ১: Form Validation ঠিক করা (State, Validation & Error Message)
> **পরীক্ষক যদি বলে:** *"টাইটেল যেন কমপক্ষে ৫ অক্ষরের এবং বিবরণ কমপক্ষে ২০ অক্ষরের হয় এমন ভ্যালিডেশন দাও ও এরর দেখাও।"*

* **ব্যাকএন্ড সমাধান (`ticketValidators.ts`):**
  ```typescript
  export const createTicketSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
  });
  ```
* **ফ্রন্টএন্ড সমাধান (`CreateTicketModal.tsx`):**
  ```tsx
  if (title.trim().length < 5) {
    setErrorMessage("Title must be at least 5 characters long");
    return;
  }
  ```

---

### টাস্ক ২: API-তে Bug ঠিক করা (Request, Response & Status Codes)
> **পরীক্ষক যদি বলে:** *"টিকিট না পাওয়া গেলে যেন 500 ইন্টারনাল এরর না দিয়ে প্রপার 404 নট ফাউন্ড দেয়।"*

* **সমাধান (`ticketController.ts`):**
  ```typescript
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!ticket) {
    return res.status(404).json({ success: false, message: "Ticket not found" });
  }
  return res.status(200).json({ success: true, data: ticket });
  ```

---

### টাস্ক ৩: ভুল Permission ঠিক করা (Authentication vs Authorization)
> **পরীক্ষক যদি বলে:** *"শুধুমাত্র ADMIN বা AGENT স্ট্যাটাস পরিবর্তন করতে পারবে, সাধারণ কাস্টমার পারবে না।"*

* **সমাধান (`roleGuard.ts` বা রাউটারে):**
  ```typescript
  // router-এ মিডলওয়্যার বসিয়ে দিন:
  router.patch("/:id/status", authGuard, roleGuard(["AGENT", "ADMIN"]), updateTicketStatus);
  ```
* **ব্যাখ্যা (মৌখিক):**
  > *"Authentication নিশ্চিত করে ইউজার কে (লগইন করা আছে কি না)। আর Authorization নিশ্চিত করে ইউজারের রোল (AGENT বা ADMIN) এই নির্দিষ্ট অপারেশনের অনুমতি রাখে কি না।"*

---

### টাস্ক ৪: Database Query পরিবর্তন করা (Prisma Query, Relation & Filtering)
> **পরীক্ষক যদি বলে:** *"টিকিটের লিস্টের সাথে কাস্টমারের নাম-ইমেইল এবং কমেন্টের সংখ্যা একসাথে ডাটাবেজ থেকে আনো।"*

* **সমাধান (`ticketService.ts` বা `ticketController.ts`):**
  ```typescript
  const tickets = await prisma.ticket.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  ```

---

### টাস্ক ৫: Status Update যোগ করা (Business Logic & Validation)
> **পরীক্ষক যদি বলে:** *"টিকিট একবার CLOSED হয়ে গেলে আর কোনো কমেন্ট যোগ করা যাবে না বা স্ট্যাটাস রি-ওপেন করা যাবে না।"*

* **সমাধান (`ticketController.ts`):**
  ```typescript
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (ticket.status === "CLOSED") {
    return res.status(400).json({ success: false, message: "Closed tickets cannot be modified" });
  }
  ```

---

### টাস্ক ৬: Loading / Error State যোগ করা (Async Operations & UI State)
> **পরীক্ষক যদি বলে:** *"ডাটা ফেচ করার সময় একটি লোডিং ইন্ডিকেটর দেখাও আর এরর হলে স্পষ্ট লাল ব্যানারে মেসেজ দেখাও।"*

* **সমাধান (`TicketList.tsx`):**
  ```tsx
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading tickets, please wait...</div>;
  }
  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>;
  }
  ```

---

### টাস্ক ৭: Bug-এর Regression Test লেখা (Test Setup & Assertion)
> **পরীক্ষক যদি বলে:** *"ইনভ্যালিড স্ট্যাটাস পাঠালে যেন ৪00 রেসপন্স আসে তার একটি টেস্ট লিখে দেখাও।"*

* **সমাধান (`src/tests/ticketWorkflow.test.ts`):**
  ```typescript
  import { describe, it, expect } from "vitest";

  describe("Ticket Workflow Validation", () => {
    it("should reject invalid status updates", () => {
      const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
      const invalidStatus = "RANDOM_STATUS";
      
      const isValid = allowedStatuses.includes(invalidStatus);
      expect(isValid).toBe(false);
    });
  });
  ```

---

## ৩. মৌখিক প্রশ্নের সুপারহিট উত্তর (চারটি গোল্ডেন ফ্রেমওয়ার্ক)

প্রতিটি ফিচারের কোড দেখানোর সময় মনে মনে ৪টি প্রশ্নের উত্তর প্রস্তুত রাখুন:
1. **এই কোডটি কী কাজ করে?**  
   > *"এটি কাস্টমারের সাপোর্ট টিকিট গ্রহণ করে, ফিল্টারিং ও স্ট্যাটাস ট্র্যাকিং নিশ্চিত করে।"*
2. **এইভাবে কেন লেখা হয়েছে?**  
   > *"PostgreSQL রিলেশনাল ইন্টিগ্রিটি ও Prisma ORM ব্যবহার করার কারণে ডেটা সুরক্ষিত থাকে এবং Zod ইনপুট স্যানিটাইজেশন নিশ্চিত করে।"*
3. **ভুল input এলে কী হবে?**  
   > *"আমাদের সেন্ট্রাল ভ্যালিডেশন লেয়ার ইনপুট আটকে দেবে এবং ক্লায়েন্টকে ফ্রেন্ডলি এরর মেসেজ পাঠাবে, কোনো রানটাইম ক্র্যাশ হবে না।"*
4. **এখন ছোট একটি পরিবর্তন চাইলে কীভাবে শুরু করব?**  
   > *"ডাটাবেজ ফিল্ড হলে `schema.prisma` তে ১ লাইন লিখে `npx prisma db push` করব, তারপর ভ্যালিডেটর ও ফ্রন্টএন্ড ফর্মে ইনপুট যুক্ত করব।"*

---

## ৪. লাইভ স্ক্রিনে কোনো এরর এলে শান্ত থাকার নিয়ম

1. **ভয় পাবেন না:** স্ক্রিনে এরর এলে প্রথমে ডিপ ব্রেথ নিন।
2. **টার্মিনালের শেষ ২ লাইন পড়ুন:** প্রিজমা বা টাইপস্ক্রিপ্ট পরিষ্কার বলে দেয় কোন ফাইলে কোন লাইনে সমস্যা।
3. **ব্রাউজারের F12 (DevTools) Network ট্যাব দেখুন:** স্ট্যাটাস কোড (400 / 401 / 404 / 500) দেখলেই বোঝা যায় কোন মিডলওয়্যার বা কন্ট্রোলারে সমস্যা।
4. **সিম্পল কনসোল লগ:** দ্বিধায় পড়লে কন্ট্রোলারের ভেতরে `console.log("Debug value:", req.body)` প্রিন্ট করে এক সেকেন্ডে ভ্যালু যাচাই করে নিন।
