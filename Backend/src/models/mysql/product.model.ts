// product model mysql
import pool from "../../config/mysql";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface Product {
    product_id?: number,
    title: string,
    info?: string,
    price: number,
    category_id?: number,
    in_stock?: boolean,
    created_at?: Date,
    updated_at?: Date
}

// new interface for joins with category
export interface ProductWithCategory {
  product_id: number;
  title: string;
  info?: string;
  price: number;
  category: {
    category_id: number | null;
    name: string | null;
  };
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

// new function for join with categories
export const getProductByIdWithCategory = async (id: number) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT
      p.product_id,
      p.title,
      p.info,
      p.price,
      c.category_id AS c_id,
      c.title AS c_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.category_id
    WHERE p.product_id = ?
    `,
    [id]
  );

  const row = (rows as RowDataPacket[])[0];
  if (!row) return null;

  return {
    product_id: row.product_id,
    title: row.title,
    info: row.info,
    price: row.price,
    category: {
      category_id: row.c_id,
      name: row.c_name
    }
  };
};

// new function for both join and filter
export const getProductsWithCategoryAndFilter = async (
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
  in_stock?: boolean,
  sort?: string
) => {
  let query = `
    SELECT
      p.product_id,
      p.title,
      p.info,
      p.price,
      p.in_stock,
      p.created_at,
      c.category_id AS c_id,
      c.title AS c_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.category_id
    WHERE 1 = 1
  `;
  const params: (string | number)[] = [];

  if (categoryId) {
    query += " AND p.category_id = ?";
    params.push(categoryId);
  }

  if (minPrice !== undefined) {
    query += " AND p.price >= ?";
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    query += " AND p.price <= ?";
    params.push(maxPrice);
  }

    if (in_stock !== undefined) {
      query += " AND p.in_stock = ?";
      params.push(in_stock ? 1 : 0); // convert boolean to 1 or 0 for MySQL
    }

    // sorting only for MySQL fields
    if (sort) {
        switch (sort) {
        case "price_asc":
        query += " ORDER BY p.price ASC";
        break;
        case "price_desc":
        query += " ORDER BY p.price DESC";
        break;
        case "created_at_asc":
        query += " ORDER BY p.created_at ASC";
        break;
        case "created_at_desc":
        query += " ORDER BY p.created_at DESC";
        break;
        case "category_asc":
        query += " ORDER BY c.title ASC";
        break;
        case "category_desc":
        query += " ORDER BY c.title DESC";
        break;
        default:
        query += " ORDER BY p.product_id ASC"; // default
    }
  }

  const [rows] = await pool.execute<RowDataPacket[]>(query, params);
  return (rows as RowDataPacket[]).map((row) => ({
    product_id: row.product_id,
    title: row.title,
    info: row.info,
    price: row.price,
    in_stock: Boolean(row.in_stock), // convert to boolean
    created_at: row.created_at,
    category: {
      category_id: row.c_id,
      name: row.c_name
    }
  }));
};


// create product
export const createProduct = async (product: Product) => {
  const { title, info, price, category_id, in_stock } = product;

  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO products (title, info, price, category_id, in_stock)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, info || null, price, category_id || null, in_stock !== undefined ? (in_stock ? 1 : 0) : null]
  );

  return result.insertId;
};

// update product
export const updateProduct = async (
    id: number,
    product: Partial<Product>
): Promise<boolean> => {
    let query = "UPDATE products SET ";
    const params:( string | number | null )[] = [];

    if (product.title !== undefined) {
        query += "title = ?, ";
        params.push(product.title);
    }

    if (product.info !== undefined) {
        query += "info = ?, ";
        params.push(product.info);
    }

    if (product.price !== undefined) {
        query += "price = ?, ";
        params.push(product.price);
    }

    if (product.category_id !== undefined) {
        query += "category_id = ?, ";
        params.push(product.category_id);
    }

    if (product.in_stock !== undefined) {
        query += "in_stock = ?, ";
        params.push(product.in_stock ? 1 : 0);
    }

    // delete the last comma
    query = query.slice(0,-2);

    query += " WHERE product_id = ?";
    params.push(id);

    const [result] = await pool.execute<ResultSetHeader>(query, params);

    return result.affectedRows > 0;

}

// delete product
export const deleteProduct = async (id:number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
        "DELETE FROM products WHERE product_id = ?",
        [id]
    );

    return result.affectedRows > 0;
}
