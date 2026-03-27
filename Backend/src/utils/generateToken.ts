// generate token for user - HJÄLPER FUNKTION
import jwt from "jsonwebtoken";

export const generateToken = (userId: number, role: "user" | "admin") => {
    return jwt.sign(
        {id: userId, role},
        process.env.JWT_SECRET!,
        {expiresIn: "3h"}
    );
};
