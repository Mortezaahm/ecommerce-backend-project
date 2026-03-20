import { Router } from "express";
import {
    // getAllProductsController,
    getProductByIdController,
    getProductsByFilterController,
    createProductController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validations/product.validation";

const router = Router();

// Get all products
// router.get("/", getAllProductsController);

// Get all products (with filter and sorting)
router.get("/", getProductsByFilterController)

// Get product by id
router.get("/:id", getProductByIdController);

// create product - admin only
router.post("/", authMiddleware, adminMiddleware, validate(createProductSchema), createProductController);

// update product - admin only
router.put("/:id", authMiddleware, adminMiddleware, validate(updateProductSchema), updateProductController);

//delete product - admin only
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);

export default router;
