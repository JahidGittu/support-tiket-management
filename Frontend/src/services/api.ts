import axios from "axios";
import { Ticket, TicketComment, User, AiTriageResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("resolvedesk_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data.data;
  },

  register: async (name: string, email: string, password: string, role?: string): Promise<{ user: User; token: string }> => {
    const res = await apiClient.post("/auth/register", { name, email, password, role });
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get("/auth/me");
    return res.data.data;
  },

  getStaff: async (): Promise<User[]> => {
    const res = await apiClient.get("/auth/staff");
    return res.data.data;
  },

  // Tickets
  getTickets: async (params?: { status?: string; priority?: string; category?: string; search?: string }): Promise<Ticket[]> => {
    const res = await apiClient.get("/tickets", { params });
    return res.data.data;
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const res = await apiClient.get(`/tickets/${id}`);
    return res.data.data;
  },

  createTicket: async (data: { title: string; description: string; category?: string; priority?: string }): Promise<Ticket> => {
    const res = await apiClient.post("/tickets", data);
    return res.data.data;
  },

  updateTicketStatus: async (id: string, status: string): Promise<Ticket> => {
    const res = await apiClient.patch(`/tickets/${id}/status`, { status });
    return res.data.data;
  },

  assignTicket: async (id: string, assignedToId: string | null): Promise<Ticket> => {
    const res = await apiClient.patch(`/tickets/${id}/assign`, { assignedToId });
    return res.data.data;
  },

  addComment: async (ticketId: string, message: string, isInternal?: boolean): Promise<TicketComment> => {
    const res = await apiClient.post(`/tickets/${ticketId}/comments`, { message, isInternal });
    return res.data.data;
  },

  // AI
  classifyTicket: async (title: string, description: string): Promise<AiTriageResult> => {
    const res = await apiClient.post("/ai/classify", { title, description });
    return res.data.data;
  },
};
