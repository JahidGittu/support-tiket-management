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
      name: "System Admin",
      email: "admin@resolvedesk.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: "Support Specialist Rahat",
      email: "agent@resolvedesk.com",
      password: hashedPassword,
      role: "AGENT",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Tanvir Hasan",
      email: "user@resolvedesk.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Seeding sample tickets...");

  const ticket1 = await prisma.ticket.create({
    data: {
      title: "bKash payment completed but subscription not activated",
      description: "I paid 1500 BDT through bKash merchant gateway (TrxID: 9X82KD71) at 10:15 AM today. My balance was deducted, but the dashboard still shows my account as Free Tier.",
      category: "BILLING",
      priority: "URGENT",
      status: "OPEN",
      aiSummary: "bKash payment processed but automated subscription tier activation failed.",
      aiSuggestedReply: "Hello Tanvir, thank you for reaching out. We apologize for the delay. We have verified your bKash TrxID: 9X82KD71 with our payment gateway and your account has been manually upgraded to Pro.",
      customerId: customer.id,
      assignedToId: agent.id,
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket1.id,
      userId: customer.id,
      message: "Here is the screenshot confirmation: TRX-9X82KD71.",
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket1.id,
      userId: agent.id,
      message: "Checking the gateway logs now, will resolve within 15 minutes.",
      isInternal: true,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "500 Internal Server error when exporting monthly reports to PDF",
      description: "Whenever I click on 'Export PDF' in the analytics dashboard for September 2026, the browser loads for 30 seconds and then displays a 500 error screen.",
      category: "TECHNICAL",
      priority: "HIGH",
      status: "IN_PROGRESS",
      aiSummary: "PDF generation timeout causing 500 server error on September report export.",
      aiSuggestedReply: "Hello, our engineering team is reviewing the memory allocation on the PDF rendering worker. In the meantime, you can export the data in CSV format without issues.",
      customerId: customer.id,
      assignedToId: agent.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Unable to reset two-factor authentication on mobile device",
      description: "I switched to a new phone and lost access to Google Authenticator. Need help resetting 2FA for my work email tanvir@example.com.",
      category: "ACCOUNT",
      priority: "MEDIUM",
      status: "OPEN",
      aiSummary: "Customer lost device and requested manual 2FA reset.",
      aiSuggestedReply: "Hello Tanvir, to reset your 2FA securely, please reply with the last 4 digits of your registered payment card or identity verification code.",
      customerId: customer.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Question regarding annual discount policy for educational teams",
      description: "We are a team of 15 researchers at Rajshahi University. Do you offer an educational discount on the annual enterprise tier?",
      category: "GENERAL",
      priority: "LOW",
      status: "RESOLVED",
      aiSummary: "Inquiry about educational team discounts for university researchers.",
      aiSuggestedReply: "Hello Tanvir, yes! We offer a 30% discount for registered academic and non-profit organizations. Please submit your university accreditation letter.",
      customerId: customer.id,
      assignedToId: agent.id,
    },
  });

  console.log("Database seeded successfully with demo accounts & sample tickets!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
