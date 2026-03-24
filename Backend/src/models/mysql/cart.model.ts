// cart model mysql
import pool from "../../config/mysql";

// Interface for Cart
export interface Cart {
    cart_id?: number;    // Primary key
    user_id: number;     // Foreign key to user
    created_at?: Date;   // Timestamp when cart was created
    updated_at?: Date;   // Timestamp when cart was last updated
}

// Create a new cart
export const createCart = async (userId: number): Promise<number> => {
    const [result]: any = await pool.execute(
        `INSERT INTO carts (user_id) VALUES (?)`,
        [userId]
    );
    return result.insertId;
};

// Get cart by user ID
export const getCartByUserId = async (userId: number): Promise<Cart | null> => {
    const [rows] = await pool.execute(
        `SELECT * FROM carts WHERE user_id = ?`,
        [userId]
    );
    return (rows as Cart[])[0] || null;
};

// Get cart by cart ID
export const getCartById = async (cartId: number): Promise<Cart | null> => {
    const [rows] = await pool.execute(
        `SELECT * FROM carts WHERE cart_id = ?`,
        [cartId]
    );
    return (rows as Cart[])[0] || null;
};

// Update a cart (e.g., link to a different user)
export const updateCart = async (
    cartId: number,
    userId: number
): Promise<boolean> => {
    const [result]: any = await pool.execute(
        `UPDATE carts SET user_id = ? WHERE cart_id = ?`,
        [userId, cartId]
    );
    return result.affectedRows > 0;
};

// Delete a cart
export const deleteCart = async (cartId: number): Promise<boolean> => {
    const [result]: any = await pool.execute(
        `DELETE FROM carts WHERE cart_id = ?`,
        [cartId]
    );
    return result.affectedRows > 0;
};
