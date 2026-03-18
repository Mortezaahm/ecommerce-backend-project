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


