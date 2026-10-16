import { prisma } from "../prismaClient";
import { TicketStatus } from "@prisma/client";
import { analyzeTicketWithAi } from "./geminiService";

export interface TicketFilterOptions {
  userId: string;
  role: "ADMIN" | "AGENT" | "CUSTOMER";
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

export const getTickets = async (options: TicketFilterOptions) => {
  const { userId, role, status, priority, category, search } = options;

  const where: any = {};

  if (role === "CUSTOMER") {
    where.customerId = userId;
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (priority && priority !== "ALL") {
    where.priority = priority;
  }

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (search && search.trim() !== "") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.ticket.findMany({
    where,
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getTicketById = async (id: string) => {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      customer: {
        select: { id: true, name: true, email: true, role: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true, role: true },
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

export const createTicket = async (data: {
  title: string;
  description: string;
  category?: "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL";
  priority?: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  customerId: string;
}) => {
  let category = data.category;
  let priority = data.priority;
  let aiSummary: string | undefined;
  let aiSuggestedReply: string | undefined;

  if (!category || !priority) {
    const aiResult = await analyzeTicketWithAi(data.title, data.description);
    category = category || aiResult.category;
    priority = priority || aiResult.priority;
    aiSummary = aiResult.aiSummary;
    aiSuggestedReply = aiResult.aiSuggestedReply;
  }

  return prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      category,
      priority,
      status: "OPEN",
      aiSummary,
      aiSuggestedReply,
      customerId: data.customerId,
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const updateTicketStatus = async (
  ticketId: string,
  newStatus: TicketStatus | "CUSTOMER_REPLIED" | string
) => {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: newStatus as any },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
};

export const assignTicket = async (ticketId: string, assignedToId: string | null) => {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedToId },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
};

export const addComment = async (data: {
  ticketId: string;
  userId: string;
  message: string;
  isInternal?: boolean;
}) => {
  return prisma.ticketComment.create({
    data: {
      ticketId: data.ticketId,
      userId: data.userId,
      message: data.message,
      isInternal: data.isInternal || false,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
};
