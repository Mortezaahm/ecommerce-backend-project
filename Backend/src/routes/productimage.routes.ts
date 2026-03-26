// productImage routes
import express from "express";
import {
  getAllProductImages,
  getImagesByProductId,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  getProductWithImages
} from "../controllers/productImage.controllers";

const router = express.Router();

// Get all product images
router.get("/", getAllProductImages);

// Get all images for a specific product
router.get("/product/:productId", getImagesByProductId);

// Get product with all images
router.get("/product-with-images/:productId", getProductWithImages);

// Create a new product image
router.post("/", createProductImage);

// Update an existing product image
router.put("/:imageId", updateProductImage);

// Delete a product image
router.delete("/:imageId", deleteProductImage);

export default router;
