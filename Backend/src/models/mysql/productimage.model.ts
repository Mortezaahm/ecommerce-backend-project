// productImage.model.ts
import pool from "../../config/mysql";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// interface for a row in product_images
export interface ProductImage extends RowDataPacket {
    image_id?: number;
    product_id: number;
    image_name: string;
}

// interface for product with images
export interface ProductWithImages {
    product_id: number;
    title: string;
    info?: string;
    price: number;
    category_id?: number;
    in_stock?: boolean;
    created_at?: Date;
    updated_at?: Date;
    images: ProductImage[];
}

// get all product images
export const getAllProductImages = async (): Promise<ProductImage[]> => {
    const [rows] = await pool.execute<ProductImage[]>("SELECT * FROM ProductImages");
    return rows;
}

// get images by product id
export const getImagesByProductId = async (productId: number): Promise<ProductImage[]> => {
    const [rows] = await pool.execute<ProductImage[]>(
        "SELECT * FROM ProductImages WHERE product_id = ?",
        [productId]
    );
    return rows;
}

// create new product image
export const createProductImage = async (productImage: ProductImage): Promise<number> => {
    const { product_id, image_name } = productImage;

    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO ProductImages (product_id, image_name) VALUES (?, ?)`,
        [product_id, image_name]
    );

    return result.insertId;
}

// update product image
export const updateProductImage = async (
    id: number,
    productImage: Partial<ProductImage>
): Promise<boolean> => {
    let query = "UPDATE ProductImages SET ";
    const params: (string | number)[] = [];

    if (productImage.product_id !== undefined) {
        query += "product_id = ?, ";
        params.push(productImage.product_id);
    }

    if (productImage.image_name !== undefined) {
        query += "image_name = ?, ";
        params.push(productImage.image_name);
    }

    // remove last comma
    query = query.slice(0, -2);

    query += " WHERE image_id = ?";
    params.push(id);

    const [result] = await pool.execute<ResultSetHeader>(query, params);
    return result.affectedRows > 0;
}

// delete product image
export const deleteProductImage = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM ProductImages WHERE image_id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

// get product with all images
export const getProductWithImages = async (productId: number): Promise<ProductWithImages | null> => {
    const [productRows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM products WHERE product_id = ?",
        [productId]
    );

    const product = productRows[0];
    if (!product) return null;

    const images = await getImagesByProductId(productId);

    return {
        product_id: product.product_id,
        title: product.title,
        info: product.info,
        price: product.price,
        category_id: product.category_id,
        in_stock: Boolean(product.in_stock),
        created_at: product.created_at,
        updated_at: product.updated_at,
        images
    };
}
