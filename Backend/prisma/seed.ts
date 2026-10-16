import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing database records...");
  await prisma.ticketComment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Rafsan Ahmed",
      email: "admin@resolvedesk.com",
      password: hashedPassword,
      role: "ADMIN",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Escalations & Admin",
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      name: "Rahat Ahmed",
      email: "agent@resolvedesk.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Technical Support",
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      name: "Farhan Kabir",
      email: "farhan@resolvedesk.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Billing Specialist",
    },
  });

  const agent3 = await prisma.user.create({
    data: {
      name: "Riya Sultana",
      email: "riya@resolvedesk.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Account Services",
    },
  });

  const customerList = [
    { name: "Arif Rahman", email: "arif@example.com" },
    { name: "Nusrat Jahan", email: "nusrat@example.com" },
    { name: "Hasan Mahmud", email: "hasan@example.com" },
    { name: "Sadia Islam", email: "sadia@example.com" },
    { name: "Imran Hossain", email: "imran@example.com" },
    { name: "Tania Akter", email: "tania@example.com" },
    { name: "Fahim Rahman", email: "fahim@example.com" },
    { name: "Jannatul Ferdous", email: "jannatul@example.com" },
  ];

  const createdCustomers: Record<string, any> = {};
  for (const c of customerList) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });
    createdCustomers[c.email] = user;
  }

  console.log("Seeding reference UI tickets...");

  const ticketsData = [
    {
      title: "Payment not working",
      description: "Customer encountered a failure when attempting checkout via bKash and credit card gateway.",
      category: "BILLING" as const,
      priority: "HIGH" as const,
      status: "OPEN" as const,
      customerEmail: "arif@example.com",
      aiSummary: "Payment gateway timeout on checkout page with credit card and bKash.",
      aiSuggestedReply: "Hello Arif, we have verified the gateway logs. The transaction timed out on the provider side. Please try again now, or let us know if you need manual invoice generation.",
      timeOffsetHours: 0.15,
    },
    {
      title: "Feature request: Dark mode",
      description: "Requesting dark mode theme support for the customer support portal and dashboard.",
      category: "GENERAL" as const,
      priority: "MEDIUM" as const,
      status: "IN_PROGRESS" as const,
      customerEmail: "nusrat@example.com",
      aiSummary: "Customer requested native dark mode UI toggle for eye comfort.",
      aiSuggestedReply: "Hello Nusrat, dark mode is currently in active development for our Q4 release! We've added your account to the early beta access list.",
      timeOffsetHours: 0.5,
    },
    {
      title: "Bug in dashboard charts",
      description: "Metrics donut chart fails to update in real-time when switching date filters on Firefox.",
      category: "TECHNICAL" as const,
      priority: "HIGH" as const,
      status: "OPEN" as const,
      customerEmail: "hasan@example.com",
      aiSummary: "Browser compatibility rendering glitch on SVG charts in Firefox.",
      aiSuggestedReply: "Hello Hasan, thanks for reporting this. We reproduced the Firefox SVG redraw glitch and our team is deploying a patch shortly.",
      timeOffsetHours: 1.0,
    },
    {
      title: "Account access issue",
      description: "User is unable to log in after password reset link expired.",
      category: "ACCOUNT" as const,
      priority: "MEDIUM" as const,
      status: "CUSTOMER_REPLIED" as any,
      customerEmail: "sadia@example.com",
      aiSummary: "Password reset token expired; customer replied requesting direct OTP access.",
      aiSuggestedReply: "Hello Sadia, we have issued a fresh 24-hour secure password reset link to your registered email address.",
      timeOffsetHours: 2.0,
    },
    {
      title: "Billing question",
      description: "Inquiry regarding the sales tax calculation on the annual subscription invoice.",
      category: "BILLING" as const,
      priority: "LOW" as const,
      status: "RESOLVED" as const,
      customerEmail: "imran@example.com",
      aiSummary: "Customer inquiry about VAT deduction on annual tax invoice.",
      aiSuggestedReply: "Hello Imran, we have updated your invoice with the zero-rated VAT certificate as requested.",
      timeOffsetHours: 3.0,
    },
    {
      title: "API integration help",
      description: "Need guidance on configuring webhook signature verification in Node.js.",
      category: "TECHNICAL" as const,
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      customerEmail: "tania@example.com",
      aiSummary: "Assistance requested with HMAC SHA256 webhook header verification.",
      aiSuggestedReply: "Hello Tania, here is a working sample snippet in TypeScript verifying the X-Signature header using crypto.createHmac.",
      timeOffsetHours: 4.0,
    },
    {
      title: "UI issue on mobile",
      description: "Sidebar navigation drawer does not close properly upon selecting a menu item on iOS Safari.",
      category: "TECHNICAL" as const,
      priority: "LOW" as const,
      status: "RESOLVED" as const,
      customerEmail: "fahim@example.com",
      aiSummary: "Mobile drawer touch event handling bug on iOS webkit.",
      aiSuggestedReply: "Hello Fahim, we fixed the mobile navigation backdrop touch listener and deployed version 1.4.2.",
      timeOffsetHours: 5.0,
    },
    {
      title: "Refund request",
      description: "Customer requested a pro-rated refund after downgrading from Enterprise to Pro tier.",
      category: "BILLING" as const,
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      customerEmail: "jannatul@example.com",
      aiSummary: "Pro-rated refund calculation for Enterprise downgrade.",
      aiSuggestedReply: "Hello Jannatul, your refund of 45.00 USD has been initiated to your original payment method and will appear in 3-5 business days.",
      timeOffsetHours: 6.0,
    },
  ];

  const now = new Date();
  const staffAgents = [agent1, agent2, agent3];

  for (let idx = 0; idx < ticketsData.length; idx++) {
    const t = ticketsData[idx];
    const customer = createdCustomers[t.customerEmail];
    const ticketCreatedAt = new Date(now.getTime() - t.timeOffsetHours * 3600 * 1000);

    // Leave 3 tickets unassigned so they are in the Waiting Queue!
    const isWaitingQueue = idx === 0 || idx === 2 || idx === 5; // e.g. Payment not working, Bug in charts, API help
    const assignedAgent = isWaitingQueue ? null : staffAgents[idx % staffAgents.length];

    const ticket = await prisma.ticket.create({
      data: {
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        aiSummary: t.aiSummary,
        aiSuggestedReply: t.aiSuggestedReply,
        customerId: customer.id,
        assignedToId: assignedAgent ? assignedAgent.id : null,
        createdAt: ticketCreatedAt,
        updatedAt: ticketCreatedAt,
      },
    });

    await prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        userId: customer.id,
        message: t.description,
        createdAt: ticketCreatedAt,
      },
    });

    if (assignedAgent && (t.status === "IN_PROGRESS" || t.status === "RESOLVED")) {
      await prisma.ticketComment.create({
        data: {
          ticketId: ticket.id,
          userId: assignedAgent.id,
          message: t.aiSuggestedReply,
          createdAt: new Date(ticketCreatedAt.getTime() + 15 * 60 * 1000),
        },
      });
    }
  }

  console.log("Seeding initial Activity Logs...");
  const sampleLogs = [
    {
      action: "QUEUE_ASSIGNED",
      message: "11:45 AM — Ticket #TKT-1024 auto-assigned from Waiting Queue to Rahat Ahmed.",
    },
    {
      action: "MOVED_TO_QUEUE",
      message: "12:10 PM — Ticket #TKT-1028 moved to Waiting Queue (Agents at 5/5 capacity).",
    },
    {
      action: "STATUS_CHANGE",
      message: "12:30 PM — Rahat Ahmed resolved Ticket #TKT-1021 (Capacity freed to 4/5).",
    },
    {
      action: "QUEUE_ASSIGNED",
      message: "01:15 PM — Ticket #TKT-1029 auto-assigned from Waiting Queue to Riya Sultana.",
    },
  ];

  for (const log of sampleLogs) {
    await prisma.activityLog.create({
      data: {
        action: log.action,
        message: log.message,
      },
    });
  }

  console.log("Database seeded successfully with capacity, queues, and activity logs!");
}

main()
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
