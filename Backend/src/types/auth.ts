import { Request } from "express";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "AGENT" | "CUSTOMER";
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
