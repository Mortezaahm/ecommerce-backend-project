import { Router } from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from "../controllers/category.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { createCategorySchema, updateCategorySchema} from "../validations/category.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

// admin only part
router.post("/", authMiddleware, adminMiddleware, validate(createCategorySchema) ,createCategoryController);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateCategorySchema) ,updateCategoryController);
router.delete("/:id",authMiddleware, adminMiddleware, deleteCategoryController);

export default router;
