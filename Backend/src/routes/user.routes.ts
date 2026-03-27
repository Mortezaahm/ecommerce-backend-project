import express from "express";
import * as userController from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema } from "../validations/user.validation";

const router = express.Router();

// Get all users - ADMIN ONLY
router.get("/", authMiddleware, adminMiddleware, userController.getUsers);


// update user - ADMIN ONLY
router.put(
  "/:id",
  validate(updateUserSchema), // ZOD
  authMiddleware, // JWT
  adminMiddleware, // Role check
  userController.updateUserController
);

// delete user - ADMIN ONLY
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUserController
);


export default router;
