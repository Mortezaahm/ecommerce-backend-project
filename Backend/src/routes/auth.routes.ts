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

const router = express.Router();

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// get current user
router.get("/me", authMiddleware , (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
