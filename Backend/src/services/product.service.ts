// logic for product management, including CRUD operations and business logic related to products
import {
    getAllProducts,
  getProductById,
  getProductByFilter,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByIdWithCategory,
  getProductsWithCategoryAndFilter
} from "../models/mysql/product.model";
import type { Product, ProductDB, ProductWithCategory } from "../models/mysql/product.model";

export const getProductsService = async (): Promise<ProductDB[]> => {
    return await getAllProducts();
}

export const getProductsByFilterService = async (
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    inStock?: boolean,
    sort?: string
) => {
    if (minPrice !== undefined && maxPrice !== undefined) {
        if (minPrice > maxPrice) {
            throw new Error("minPrice cannot be greater than maxPrice");
        }
  }

  return await getProductsWithCategoryAndFilter(categoryId, minPrice, maxPrice, inStock, sort);
}

export const getProductByIdService = async (id: number): Promise<ProductWithCategory | null> => {
    if (!id || id <= 0) {
        throw new Error ("Invalid product id");
    }

    const product = await getProductByIdWithCategory(id);
    return product;
}

export const createProductService = async (product: Product): Promise<number> => {
    if (product.price < 0) {
    throw new Error("Price cannot be negative");
  }
  return await createProduct(product);
}

export const updateProductService = async (
    id: number,
    product: Partial<Product>
): Promise<boolean> => {

    if (Object.keys(product).length === 0) {
        throw new Error("No fields provided for update");
    }

    if (product.price !== undefined && product.price < 0) {
        throw new Error("Price cannot be negative");
    }

    return await updateProduct(id,product);
}

export const deleteProductService = async (id: number): Promise<boolean> => {
    return await deleteProduct(id);
}
