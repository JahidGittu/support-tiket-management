import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL"]).optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CUSTOMER_REPLIED", "RESOLVED", "CLOSED"], {
    errorMap: () => ({ message: "Status must be OPEN, IN_PROGRESS, CUSTOMER_REPLIED, RESOLVED, or CLOSED" }),
  }),
});

export const assignAgentSchema = z.object({
  assignedToId: z.string().uuid("Invalid Agent ID").nullable(),
});

export const createCommentSchema = z.object({
  message: z.string().min(1, "Comment message cannot be empty"),
  isInternal: z.boolean().optional().default(false),
});

export const aiClassifySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});
