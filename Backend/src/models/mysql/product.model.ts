// product model mysql
import pool from "../../config/mysql";

export interface Product {
    product_id?: number,
    title: string,
    info?: string,
    price: number,
    category_id?: number,
    created_at?: Date,
    updated_at?: Date
}

// get all products
export const getAllProducts = async(): Promise<Product[]> => {
    const [rows] = await pool.execute("SELECT * FROM products");
    return rows as Product[];
}

// get product by Id
export const getProductById = async(id:number): Promise<Product | null> => {
    const [rows] = await pool.execute("SELECT * FROM products WHERE product_id = ?" , [id]);
    return (rows as Product[])[0] || null;
}

// get product with filter
export const getProductByFilter = async(
    categoryId?: number,
    minPrice?:number,
    maxPrice?:number
):Promise<Product[]> => {
    let query = "SELECT * FROM products WHERE 1 = 1";
    const params :(string | number)[] = [];

    if (categoryId) {
        query += " AND category_id = ?";
        params.push(categoryId);
    }

    if (minPrice !== undefined) {
        query += " AND price >= ?";
        params.push(minPrice);
    }

    if (maxPrice !== undefined) {
        query += " AND price <= ?";
        params.push(maxPrice);
    }

    const [rows] = await pool.execute(query, params);
    return rows as Product[];
}

// create product
export const createProduct = async (product: Product) => {
  const { title, info, price, category_id } = product;

  const [result]: any = await pool.execute(
    `
    INSERT INTO products (title, info, price, category_id)
    VALUES (?, ?, ?, ?)
    `,
    [title, info || null, price, category_id || null]
  );

  return result.insertId;
};
