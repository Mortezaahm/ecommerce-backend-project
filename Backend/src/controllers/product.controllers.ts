import type { Request, Response } from "express";
import {
  getProductByIdService,
  getProductsByFilterService,
  createProductService,
  updateProductService,
  deleteProductService
} from "../services/product.service";

// GET /products (with filter)
export const getProductsByFilterController = async (req: Request, res: Response) => {
  try {
    const { category_id, minPrice, maxPrice } = req.query;
    const products = await getProductsByFilterService (
      category_id ? Number(category_id) : undefined,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined
    );
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error
    })
  }
};

// GET /products/:id
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id"
      })
    }

    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product",
      error
    })
  }
}

// create product ==> /products
export const createProductController = async (req: Request, res: Response) => {
  try {
    const {title, info, price, category_id} = req.body;
    if (!title || price) {
      return res.status(400).json({
        message: "Title and price are required"
      })
    }

    const newProductId = await createProductService ({
      title, info, price, category_id
    });

    return res.status(201).json({
      message: "Product created successfully",
      product_id: newProductId
    })
  } catch (error) {
     return res.status(500).json({
      message: "Failed to create product",
      error
     })
  }
}

// Update product ==> /products/:id
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        message :"Invalid product id"
      })
    }

    const updated = await updateProductService (id, req.body);

    if(!updated) {
      return res.status(404).json({
        message: "Product not found or no changes applied"
      })
    }

    return res.status(200).json({
      message: "Product updated successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error
     })
  }
}

// delete product ==> /products/:id
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const deleted = await deleteProductService(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error
    });
  }
}
