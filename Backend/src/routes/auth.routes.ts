// auth routes
// POST /auth/register
// POST /auth/login
// GET /auth/me
import express from "express";
import {
  registerController,
  loginController
} from "../controllers/auth.controllers";

import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";

const router = express.Router();

// register
router.post("/register", validate(registerSchema) ,registerController);

// login
router.post("/login", validate(loginSchema) ,loginController);

// get current user
router.get("/me", authMiddleware , (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
