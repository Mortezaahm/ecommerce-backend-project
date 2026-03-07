import { Router } from "express";
import { getProducts } from "../controllers/product.controllers";

const router = Router();

router.get("/", getProducts);
// router.post("/", createProduct);

export default router;
