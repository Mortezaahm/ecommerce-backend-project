import { registerUser, loginUser } from "../services/auth.service";
import type { Request, Response } from "express";

// controllers for authentication - register
export const registerController = async (req: Request, res: Response) => {
    const {name, email, password, address, phone} = req.body;

    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({message: (error as Error).message});
    }
}


export const loginController = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const data = await loginUser(req.body);
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(401).json({message: (error as Error).message});
    }
}
