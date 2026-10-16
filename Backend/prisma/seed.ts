import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning all mock database records (tickets, comments, activity logs, customer users)...");
  
  // 1. Delete all ticket comments
  await prisma.ticketComment.deleteMany();
  console.log("✓ Cleared all ticket comments");

  // 2. Delete all tickets
  await prisma.ticket.deleteMany();
  console.log("✓ Cleared all tickets");

  // 3. Delete all activity logs
  await prisma.activityLog.deleteMany();
  console.log("✓ Cleared all activity logs");

  // 4. Delete all existing users
  await prisma.user.deleteMany();
  console.log("✓ Cleared all users");

  console.log("Seeding ONLY verified Admin and Support Agents...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Super Admin
  const admin = await prisma.user.create({
    data: {
      name: "Rafsan Ahmed",
      email: "admin@supportticket.com",
      password: hashedPassword,
      role: "ADMIN",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Escalations & Admin",
    },
  });
  console.log(`✓ Created Admin: ${admin.name} (${admin.email})`);

  // 2. Support Agent 1 (Technical Support)
  const agent1 = await prisma.user.create({
    data: {
      name: "Rahat Ahmed",
      email: "agent@supportticket.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Technical Support",
    },
  });
  console.log(`✓ Created Agent: ${agent1.name} (${agent1.email})`);

  // 3. Support Agent 2 (Billing Specialist)
  const agent2 = await prisma.user.create({
    data: {
      name: "Farhan Kabir",
      email: "farhan@supportticket.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Billing Specialist",
    },
  });
  console.log(`✓ Created Agent: ${agent2.name} (${agent2.email})`);

  // 4. Support Agent 3 (Account Services)
  const agent3 = await prisma.user.create({
    data: {
      name: "Riya Sultana",
      email: "riya@supportticket.com",
      password: hashedPassword,
      role: "AGENT",
      dailyCapacity: 5,
      availabilityStatus: "AVAILABLE",
      serviceType: "Account Services",
    },
  });
  console.log(`✓ Created Agent: ${agent3.name} (${agent3.email})`);

  console.log("\nDatabase clean setup complete! Database contains ZERO mock tickets and ONLY Admin and Agents.");
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
