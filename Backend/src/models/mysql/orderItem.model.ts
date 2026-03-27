// orderitem.model.ts
import pool from "../../config/mysql";

// Interface for OrderItem
export interface OrderItem {
    order_item_id?: number;   // Primary key
    order_id: number;         // Foreign key to Orders
    product_id: number;       // Foreign key to Products
    quantity: number;
    price_at_order: number;
}

// Get all order items
export const getAllOrderItems = async (): Promise<OrderItem[]> => {
    const [rows] = await pool.execute("SELECT * FROM OrderItems");
    return rows as OrderItem[];
}

// Get a single order item by id
export const getOrderItemById = async (id: number): Promise<OrderItem | null> => {
    const [rows] = await pool.execute(
        "SELECT * FROM OrderItems WHERE order_item_id = ?",
        [id]
    );
    return (rows as OrderItem[])[0] || null;
}

// Get all order items for a specific order
export const getOrderItemsByOrderId = async (orderId: number): Promise<OrderItem[]> => {
    const [rows] = await pool.execute(
        "SELECT * FROM OrderItems WHERE order_id = ?",
        [orderId]
    );
    return rows as OrderItem[];
}

// Create a new order item
export const createOrderItem = async (orderItem: OrderItem) => {
    const { order_id, product_id, quantity, price_at_order } = orderItem;

    const [result]: any = await pool.execute(
        `INSERT INTO OrderItems (order_id, product_id, quantity, price_at_order)
         VALUES (?, ?, ?, ?)`,
        [order_id, product_id, quantity, price_at_order]
    );

    return result.insertId;
}

// Update an existing order item
export const updateOrderItem = async (id: number, orderItem: Partial<OrderItem>): Promise<boolean> => {
    let query = "UPDATE OrderItems SET ";
    const params: (string | number | null)[] = [];

    if (orderItem.order_id !== undefined) {
        query += "order_id = ?, ";
        params.push(orderItem.order_id);
    }

    if (orderItem.product_id !== undefined) {
        query += "product_id = ?, ";
        params.push(orderItem.product_id);
    }

    if (orderItem.quantity !== undefined) {
        query += "quantity = ?, ";
        params.push(orderItem.quantity);
    }

    if (orderItem.price_at_order !== undefined) {
        query += "price_at_order = ?, ";
        params.push(orderItem.price_at_order);
    }

    query = query.slice(0, -2); // Remove trailing comma
    query += " WHERE order_item_id = ?";
    params.push(id);

    const [result]: any = await pool.execute(query, params);
    return result.affectedRows > 0;
}

// Delete an order item
export const deleteOrderItem = async (id: number): Promise<boolean> => {
    const [result]: any = await pool.execute(
        "DELETE FROM OrderItems WHERE order_item_id = ?",
        [id]
    );
    return result.affectedRows > 0;
}
