import { Router } from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController
} from "../controllers/category.controllers";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

export default router;
