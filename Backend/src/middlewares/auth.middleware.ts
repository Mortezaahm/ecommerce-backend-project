// check JWT token and add user to req object (req.user)

/* 1 read header
2 extract token
3 verify token
4 attach user to req.user
5 next() */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Invalid authorization header"
        })
    }

    const token = authHeader.split(" ")[0];

    console.log("HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);
    console.log("SPLIT:", authHeader.split(" "));

    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as unknown as JwtPayload;
        req.user = {
            id:decoded.id,
            name: "",
            email:""
        };


        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
