// orderItem model mysql
import pool from "../../config/mysql";

// OrderItem represents a row in order__items table
export interface OrderItem {
    orderitem__id?: number
    order__id: number
    product__id: number
    quantity: number
    price_at_order: number
}

// Get all order items
export const getAllOrderItems = async (): Promise<OrderItem[]> => {
    const [rows] = await pool.execute("SELECT * FROM order__items");
    return rows as OrderItem[];
}

// Get a single order item by its primary key (orderitem__id)
export const getOrderItemById = async (id: number): Promise<OrderItem | null> => {
    const [rows] = await pool.execute(
        "SELECT * FROM order__items WHERE orderitem__id = ?",
        [id]
    );
    return (rows as OrderItem[])[0] || null;
}

// Get all order items for a specific order (order__id)
export const getOrderItemsByOrderId = async (orderId: number): Promise<OrderItem[]> => {
    const [rows] = await pool.execute(
        "SELECT * FROM order__items WHERE order__id = ?",
        [orderId]
    );
    return rows as OrderItem[];
}

// Create a new order item
export const createOrderItem = async (orderItem: OrderItem) => {
    const { order__id, product__id, quantity, price_at_order } = orderItem;

    const [result]: any = await pool.execute(
        `
        INSERT INTO order__items (order__id, product__id, quantity, price_at_order)
        VALUES (?, ?, ?, ?)
        `,
        [order__id, product__id, quantity, price_at_order]
    );

    // Return the id of the newly created order item
    return result.insertId;
}

// Update an existing order item by its primary key (orderitem__id)
export const updateOrderItem = async (
    id: number,
    orderItem: Partial<OrderItem>
): Promise<boolean> => {
    let query = "UPDATE order__items SET ";
    const params: (string | number | null)[] = [];

    if (orderItem.order__id !== undefined) {
        query += "order__id = ?, ";
        params.push(orderItem.order__id);
    }

    if (orderItem.product__id !== undefined) {
        query += "product__id = ?, ";
        params.push(orderItem.product__id);
    }

    if (orderItem.quantity !== undefined) {
        query += "quantity = ?, ";
        params.push(orderItem.quantity);
    }

    if (orderItem.price_at_order !== undefined) {
        query += "price_at_order = ?, ";
        params.push(orderItem.price_at_order);
    }

    // Remove trailing comma and space
    query = query.slice(0, -2);

    query += " WHERE orderitem__id = ?";
    params.push(id);

    const [result]: any = await pool.execute(query, params);

    return result.affectedRows > 0;
}

// Delete an order item by its primary key (orderitem__id)
export const deleteOrderItem = async (id: number): Promise<boolean> => {
    const [result]: any = await pool.execute(
        "DELETE FROM order__items WHERE orderitem__id = ?",
        [id]
    );

    // Return true if a row was deleted
    return result.affectedRows > 0;
}
