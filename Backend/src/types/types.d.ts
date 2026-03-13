import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
}
