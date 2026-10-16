import axios from "axios";
import { Ticket, TicketComment, User, AiTriageResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api/v1";

// 1. PUBLIC AXIOS INSTANCE (No token attached, for public login/signup)
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. PRIVATE AXIOS INSTANCE (Authenticated endpoints with JWT Bearer token & 401 interceptor)
export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to headers
privateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("resolvedesk_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
privateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("resolvedesk_token");
      // Optional: dispatch event so App can detect session expiry
      window.dispatchEvent(new Event("auth_unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Backward-compatible alias
export const apiClient = privateAxios;

export const api = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const res = await publicAxios.post("/auth/login", { email, password });
    return res.data.data;
  },

  register: async (name: string, email: string, password: string, role?: string): Promise<{ user: User; token: string }> => {
    const res = await publicAxios.post("/auth/register", { name, email, password, role });
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await privateAxios.get("/auth/me");
    return res.data.data;
  },

  getStaff: async (): Promise<User[]> => {
    const res = await privateAxios.get("/auth/staff");
    return res.data.data;
  },

  getCustomers: async (): Promise<any[]> => {
    const res = await privateAxios.get("/auth/customers");
    return res.data.data;
  },

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

  classifyTicket: async (title: string, description: string): Promise<AiTriageResult> => {
    const res = await apiClient.post("/ai/classify", { title, description });
    return res.data.data;
  },

  getWaitingQueue: async (): Promise<Ticket[]> => {
    const res = await apiClient.get("/queue");
    return res.data.data;
  },

  assignFromQueue: async (): Promise<{ success: boolean; message: string; ticket?: Ticket; assignedStaff?: any }> => {
    const res = await apiClient.post("/queue/assign-next");
    return res.data;
  },

  getStaffLoadSummary: async (): Promise<any[]> => {
    const res = await apiClient.get("/queue/staff-load");
    return res.data.data;
  },

  getActivityLogs: async (): Promise<any[]> => {
    const res = await apiClient.get("/queue/activity-logs");
    return res.data.data;
  },

  toggleStaffAvailability: async (staffId: string, status: "AVAILABLE" | "ON_LEAVE" | "BUSY"): Promise<any> => {
    const res = await apiClient.patch(`/queue/staff/${staffId}/availability`, { status });
    return res.data.data;
  },

  assignTicketWithValidation: async (
    ticketId: string,
    staffId: string | null,
    forceOverride?: boolean
  ): Promise<{ success: boolean; data?: Ticket; conflict?: boolean; message?: string }> => {
    try {
      const res = await apiClient.post(`/queue/tickets/${ticketId}/assign`, {
        staffId,
        forceOverride,
      });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 409) {
        return {
          success: false,
          conflict: true,
          message: err.response.data?.message || "Staff member capacity exceeded.",
        };
      }
      throw err;
    }
  },
};
