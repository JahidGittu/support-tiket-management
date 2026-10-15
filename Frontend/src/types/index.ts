export type Role = "ADMIN" | "AGENT" | "CUSTOMER";
export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Category = "BILLING" | "TECHNICAL" | "ACCOUNT" | "GENERAL";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface TicketComment {
  id: string;
  message: string;
  isInternal: boolean;
  ticketId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  aiSummary?: string | null;
  aiSuggestedReply?: string | null;
  customerId: string;
  customer: User;
  assignedToId?: string | null;
  assignedTo?: User | null;
  comments?: TicketComment[];
  _count?: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AiTriageResult {
  category: Category;
  priority: Priority;
  aiSummary: string;
  aiSuggestedReply: string;
}
