// order model mysql

import pool from "../../config/mysql";

export interface Order {
  order_id?: number;
  user_id: number;
  created_at?: Date;
  total_price?: number;
}

// create order
export const createOrder = async (order: Order): Promise<number> => {
  const { user_id, total_price } = order;

  const [result]: any = await pool.execute(
    `INSERT INTO Orders (user_id, total_price) VALUES (?, ?)`,
    [user_id, total_price || 0]
  );

  return result.insertId;
};

// get order by id
export const getOrderById = async (id: number): Promise<Order | null> => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM Orders WHERE order_id = ?",
    [id]
  );

  return (rows as Order[])[0] || null;
};

// get all orders for a user
export const getOrdersByUserId = async (user_id: number): Promise<Order[]> => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM Orders WHERE user_id = ?",
    [user_id]
  );

  return rows as Order[];
};
