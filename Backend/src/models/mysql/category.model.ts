// category model mysql
import pool from "../../config/mysql";

export interface Category {
    category_id?: number,
    title: string
}

// get all categories
export const getAllCategories = async (): Promise<Category[]> => {
    const [rows] = await pool.execute("SELECT * FROM categories");
    return rows as Category[];
}

// get category by id
export const getCategoryById = async(id: number): Promise<Category | null> => {
    const [rows] = await pool.execute ("SELECT * FROM categories WHERE category_id = ?", [id]);
    return (rows as Category[])[0] || null;
}
