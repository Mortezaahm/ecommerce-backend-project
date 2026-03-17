import type { Request, Response, NextFunction } from "express";
import { ZodType} from "zod";

export const validate =
(Schema: ZodType) => (req: Request, res:Response, next: NextFunction) => {
    try {
        req.body = Schema.parse(req.body);
        next()
    } catch (error:any) {
        return res.status(400).json({
            success: false,
            errors: error.errors,
        });
    }
};
