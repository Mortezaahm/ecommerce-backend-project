import { Router } from "express";
import { getProducts } from "../controllers/product.controllers";

const router = Router();

router.get("/", getProducts);
// router.post("/", createProduct);

// admin routes - only admin can create, update, delete products
// router.post("/",authMiddleware,adminMiddleware,createProductController);
export default router;
