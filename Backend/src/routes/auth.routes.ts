import express from "express";
import {
  registerController,
  loginController,
  updateUserController,
  deleteUserController
} from "../controllers/auth.controllers";

import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { updateUserSchema } from "../validations/user.validation";

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

// update user - ADMIN ONLY
router.put(
  "/update/:id",
  validate(updateUserSchema), // ZOD
  authMiddleware, // JWT
  adminMiddleware, // Role check
  updateUserController
);

// delete user - ADMIN ONLY
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserController
);

export default router;
