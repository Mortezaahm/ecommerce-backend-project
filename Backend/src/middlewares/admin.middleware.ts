import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/types";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};
