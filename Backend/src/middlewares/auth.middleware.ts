// check JWT token and add user to req object (req.user)

/* 1 read header
2 extract token
3 verify token
4 attach user to req.user
5 next() */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/mysql/user.model";
import type { AuthRequest } from "../types/types";

interface JwtPayload {
    id: number;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Invalid authorization header"
        })
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }


        req.user = {
            id:user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
