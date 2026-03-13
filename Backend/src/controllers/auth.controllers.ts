import type { Error } from "mongoose";
import { registerUser, loginUser } from "../services/auth.service";
import type { Request, Response } from "express";

// controllers for authentication - register
export const registerController = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    try {
        const user = await registerUser(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
}


export const loginController = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const data = await loginUser(email, password);
        res.status(200).json({data});
    } catch (error) {
        res.status(401).json({message: (error as Error).message});
    }
}
