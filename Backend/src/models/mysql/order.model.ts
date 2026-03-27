// order model mysql

import pool from "../../config/mysql";

export interface Order {
  order_id?: number;
  user_id: number;
  created_at?: Date;
  total_price?: number;
}

// get all orders
export const getAllOrdersFromDB = async () => {
  const [rows]: any = await pool.execute("SELECT o.*, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id");
  return rows;
};

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

// update order
export const updateOrder = async (
  id: number,
  order: Partial<Order>
): Promise<boolean> => {
  let query = "UPDATE Orders SET ";
  const params: (string | number)[] = [];

  if (order.user_id !== undefined) {
    query += "user_id = ?, ";
    params.push(order.user_id);
  }

  if (order.total_price !== undefined) {
    query += "total_price = ?, ";
    params.push(order.total_price);
  }

  // ta bort sista kommatecknet
  query = query.slice(0, -2);

  query += " WHERE order_id = ?";
  params.push(id);

  const [result]: any = await pool.execute(query, params);
  return result.affectedRows > 0;
};

// delete order
export const deleteOrder = async (id: number): Promise<boolean> => {
  const [result]: any = await pool.execute(
    "DELETE FROM Orders WHERE order_id = ?",
    [id]
  );

  return result.affectedRows > 0;
};
