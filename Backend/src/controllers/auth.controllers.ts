import type { Error } from "mongoose";
import { registerUser, loginUser } from "../services/auth.service";
import type { Request, Response } from "express";

// controllers for authentication - register
export const registerController = async (req: Request, res: Response) => {
    const {name, email, confirmEmail, password, confirmPassword} = req.body;

    try {
        //basic validation
        if (!name || !email || !password) {
            return res.status(400). json ({
                message: "All fields are required"
            });
        }

        if (email !== confirmEmail) {
            return res.status(400). json ({
                message: "Emails are not match"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400). json ({
                message: "Passwords do not match"
            });
        }

        if (password.length < 6 ) {
            return res.status(400). json ({
                message: "Password must be at least 6 characters"
            });
        }

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
