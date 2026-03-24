// cart item model mysql
import pool from "../../config/mysql";

// Interface for CartItem
export interface CartItem {
    cart_item_id?: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price_at_added_time: number;
    created_at?: Date;
    updated_at?: Date;
}

// Create a new cart item
export const createCartItem = async (item: CartItem): Promise<number> => {
    const { cart_id, product_id, quantity, price_at_added_time } = item;
    const [result]: any = await pool.execute(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_added_time)
         VALUES (?, ?, ?, ?)`,
        [cart_id, product_id, quantity, price_at_added_time]
    );
    return result.insertId;
};

// Get all items in a cart
export const getCartItemsByCartId = async (cartId: number): Promise<CartItem[]> => {
    const [rows] = await pool.execute(
        `SELECT * FROM cart_items WHERE cart_id = ?`,
        [cartId]
    );
    return rows as CartItem[];
};

// Get a specific cart item by ID
export const getCartItemById = async (cartItemId: number): Promise<CartItem | null> => {
    const [rows] = await pool.execute(
        `SELECT * FROM cart_items WHERE cart_item_id = ?`,
        [cartItemId]
    );
    return (rows as CartItem[])[0] || null;
};

// Update a cart item (quantity or price)
export const updateCartItem = async (
    cartItemId: number,
    fields: Partial<CartItem>
): Promise<boolean> => {
    const set: string[] = [];
    const params: (string | number)[] = [];

    if (fields.quantity !== undefined) {
        set.push("quantity = ?");
        params.push(fields.quantity);
    }

    if (fields.price_at_added_time !== undefined) {
        set.push("price_at_added_time = ?");
        params.push(fields.price_at_added_time);
    }

    if (set.length === 0) return false;

    const query = `UPDATE cart_items SET ${set.join(", ")} WHERE cart_item_id = ?`;
    params.push(cartItemId);

    const [result]: any = await pool.execute(query, params);
    return result.affectedRows > 0;
};

// Delete a cart item
export const deleteCartItem = async (cartItemId: number): Promise<boolean> => {
    const [result]: any = await pool.execute(
        `DELETE FROM cart_items WHERE cart_item_id = ?`,
        [cartItemId]
    );
    return result.affectedRows > 0;
};
