// productImage service
import type { ProductImage, ProductWithImages } from "../models/mysql/productImage.model";
import {
  getAllProductImages as getAllImagesFromDB,
  getImagesByProductId as getImagesByProductIdFromDB,
  createProductImage as createProductImageInDB,
  updateProductImage as updateProductImageInDB,
  deleteProductImage as deleteProductImageInDB,
  getProductWithImages as getProductWithImagesFromDB
} from "../models/mysql/productImage.model";

// Get all product images
export const getAllProductImagesService = async (): Promise<ProductImage[]> => {
  return await getAllImagesFromDB();
}

// Get images for a specific product
export const getImagesByProductIdService = async (productId: number): Promise<ProductImage[]> => {
  if (!productId || productId <= 0) throw new Error("Invalid product id");
  return await getImagesByProductIdFromDB(productId);
}

// Create a new product image
export const createProductImageService = async (productImage: ProductImage) => {
  return await createProductImageInDB(productImage);
}

// Update a product image
export const updateProductImageService = async (id: number, productImage: Partial<ProductImage>) => {
  if (!id || id <= 0) throw new Error("Invalid image id");
  return await updateProductImageInDB(id, productImage);
}

// Delete a product image
export const deleteProductImageService = async (id: number) => {
  if (!id || id <= 0) throw new Error("Invalid image id");
  return await deleteProductImageInDB(id);
}

// Get product with all images
export const getProductWithImagesService = async (productId: number): Promise<ProductWithImages | null> => {
  if (!productId || productId <= 0) throw new Error("Invalid product id");
  return await getProductWithImagesFromDB(productId);
}
