// controllers for product images
import type { Request, Response } from "express";
import {
  getAllProductImagesService,
  getImagesByProductIdService,
  createProductImageService,
  updateProductImageService,
  deleteProductImageService,
  getProductWithImagesService
} from "../services/productimage.service";

// Get all product images
export const getAllProductImages = async (req: Request, res: Response) => {
    try {
        const images = await getAllProductImagesService();
        res.json(images);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// Get images for a specific product
export const getImagesByProductId = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const images = await getImagesByProductIdService(productId);
        res.json(images);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// Create a new product image
export const createProductImage = async (req: Request, res: Response) => {
    try {
        const { product_id, image_name } = req.body;
        const insertId = await createProductImageService({ product_id, image_name });
        res.status(201).json({ image_id: insertId });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// Update a product image
export const updateProductImage = async (req: Request, res: Response) => {
    try {
        const imageId = Number(req.params.imageId);
        const success = await updateProductImageService(imageId, req.body);
        res.json({ success });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a product image
export const deleteProductImage = async (req: Request, res: Response) => {
    try {
        const imageId = Number(req.params.imageId);
        const success = await deleteProductImageService(imageId);
        res.json({ success });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

// Get product with all images
export const getProductWithImages = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const product = await getProductWithImagesService(productId);
        res.json(product);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
