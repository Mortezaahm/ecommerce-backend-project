// auth routes
// POST /auth/register
// POST /auth/login
// GET /auth/me
import express from "express";
import {
  registerController,
  loginController
} from "../controllers/auth.controllers";

const router = express.Router();

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// get current user
router.get("/me", (req, res) => {
  res.json({
    message: "Get current user"
  });
});

export default router;
