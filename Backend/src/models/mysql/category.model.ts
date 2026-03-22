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

// ADMIN ONLY PART

// create a new category admin only
export const createCategory = async (title: string): Promise<number> =>{
    const [result]:any = await pool.execute(
        "INSERT INTO categories (title) VALUES (?)",
        [title]
    );
    return result.insertId;
}

// update categories admin only
export const updateCategory = async (id: number, title: string) :Promise<boolean> =>{
    const[result]: any = await pool.execute(
        "UPDATE categories SET title = ? WHERE category_id = ?",
        [title, id]
    );

    return result.affectedRows > 0;
}

// delete category - little tricky - admin only
export const deleteCategory = async (id: number) : Promise<boolean> => {
    const [result]:any = await pool.execute(
        "DELETE FROM categories WHERE category_id = ?",
        [id]
    );
    return result.affectedRows > 0;
}
