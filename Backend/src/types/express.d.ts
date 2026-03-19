// Define types for Express Request and Response objects
import { Request, Response } from 'express';
// Extend the Express Request interface to include custom properties
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
    export interface Response {
      sendSuccess: (data: any) => void;
      sendError: (message: string, statusCode?: number) => void;
    }
    }
}
