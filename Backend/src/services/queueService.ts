import { prisma } from "../prismaClient";

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getWaitingQueue = async () => {
  const queueTickets = await prisma.ticket.findMany({
    where: {
      assignedToId: null,
      status: { in: ["OPEN", "CUSTOMER_REPLIED"] },
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return queueTickets.map((ticket, index) => ({
    ...ticket,
    queuePosition: index + 1,
  }));
};

export const getStaffLoadSummary = async () => {
  const staffMembers = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "AGENT"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      dailyCapacity: true,
      availabilityStatus: true,
      serviceType: true,
    },
    orderBy: { name: "asc" },
  });

  const staffLoadList = await Promise.all(
    staffMembers.map(async (staff) => {
      const activeTicketsCount = await prisma.ticket.count({
        where: {
          assignedToId: staff.id,
          status: { in: ["OPEN", "IN_PROGRESS", "CUSTOMER_REPLIED"] },
        },
      });

      const capacity = staff.dailyCapacity || 5;
      const isAtCapacity = activeTicketsCount >= capacity;

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        serviceType: staff.serviceType || "General Support",
        dailyCapacity: capacity,
        currentLoad: activeTicketsCount,
        availabilityStatus: staff.availabilityStatus,
        isAtCapacity,
        statusLabel: isAtCapacity ? "Booked" : "OK",
      };
    })
  );

  return staffLoadList;
};

export const assignFromQueue = async () => {
  // 1. Get the earliest eligible unassigned ticket in queue
  const earliestTicket = await prisma.ticket.findFirst({
    where: {
      assignedToId: null,
      status: { in: ["OPEN", "CUSTOMER_REPLIED"] },
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!earliestTicket) {
    return {
      success: false,
      message: "The waiting queue is currently empty. No tickets waiting.",
    };
  }

  // 2. Find eligible staff with capacity < dailyCapacity and AVAILABLE
  const staffList = await getStaffLoadSummary();
  const eligibleStaff = staffList.find(
    (s) => s.availabilityStatus === "AVAILABLE" && s.currentLoad < s.dailyCapacity
  );

  if (!eligibleStaff) {
    return {
      success: false,
      message: `All staff members are currently at full capacity (5/5) or on leave. Ticket #${earliestTicket.id.slice(
        0,
        8
      )} remains in Waiting Queue.`,
      ticket: earliestTicket,
    };
  }

  // 3. Assign ticket to staff member
  const updatedTicket = await prisma.ticket.update({
    where: { id: earliestTicket.id },
    data: {
      assignedToId: eligibleStaff.id,
      status: "IN_PROGRESS",
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  // 4. Create Activity Log
  const logMessage = `${formatTime(new Date())} — Ticket #${earliestTicket.id.slice(
    0,
    8
  )} ("${earliestTicket.title}") auto-assigned from Waiting Queue to ${eligibleStaff.name}.`;

  await prisma.activityLog.create({
    data: {
      action: "QUEUE_ASSIGNED",
      message: logMessage,
      ticketId: earliestTicket.id,
      userId: eligibleStaff.id,
    },
  });

  return {
    success: true,
    message: `Ticket successfully assigned to ${eligibleStaff.name} (${eligibleStaff.currentLoad + 1}/${eligibleStaff.dailyCapacity})`,
    ticket: updatedTicket,
    assignedStaff: eligibleStaff,
  };
};

export const assignTicketWithValidation = async (
  ticketId: string,
  staffId: string | null,
  forceOverride: boolean = false
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // If unassigning, ticket returns to waiting queue
  if (!staffId) {
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { assignedToId: null, status: "OPEN" },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "MOVED_TO_QUEUE",
        message: `${formatTime(new Date())} — Ticket #${ticket.id.slice(0, 8)} moved to Waiting Queue.`,
        ticketId: ticket.id,
      },
    });

    return { success: true, ticket: updated };
  }

  const staff = await prisma.user.findUnique({
    where: { id: staffId },
  });

  if (!staff) {
    throw new Error("Staff member not found");
  }

  // Check capacity & availability
  const activeCount = await prisma.ticket.count({
    where: {
      assignedToId: staffId,
      status: { in: ["OPEN", "IN_PROGRESS", "CUSTOMER_REPLIED"] },
    },
  });

  const capacity = staff.dailyCapacity || 5;

  if (staff.availabilityStatus === "ON_LEAVE" && !forceOverride) {
    return {
      conflict: true,
      message: `${staff.name} is currently marked as On Leave. Please select another staff member or send to Waiting Queue.`,
    };
  }

  if (activeCount >= capacity && !forceOverride) {
    return {
      conflict: true,
      message: `${staff.name} already has ${activeCount} / ${capacity} active tickets today (Daily capacity reached).`,
    };
  }

  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assignedToId: staffId,
      status: ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status,
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MANUAL_ASSIGNMENT",
      message: `${formatTime(new Date())} — Ticket #${ticket.id.slice(0, 8)} assigned to ${staff.name} (${activeCount + 1}/${capacity}).`,
      ticketId: ticket.id,
      userId: staff.id,
    },
  });

  return { success: true, ticket: updated };
};

export const getActivityLogs = async (limit: number = 10) => {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

export const toggleStaffAvailability = async (
  staffId: string,
  newStatus: "AVAILABLE" | "ON_LEAVE" | "BUSY"
) => {
  const staff = await prisma.user.update({
    where: { id: staffId },
    data: { availabilityStatus: newStatus },
  });

  await prisma.activityLog.create({
    data: {
      action: "AVAILABILITY_CHANGE",
      message: `${formatTime(new Date())} — ${staff.name} availability status changed to ${newStatus}.`,
      userId: staffId,
    },
  });

  return staff;
};
