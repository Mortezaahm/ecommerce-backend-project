// logic for orders
import type { Order } from "../models/mysql/order.model";
import type { OrderItem as OrderItemModel } from "../models/mysql/orderItem.model";

import {
  getAllOrdersFromDB,
  createOrder as createOrderInDB,
  getOrderById as getOrderFromDB,
  getOrdersByUserId as getOrdersFromDB,
  updateOrder as updateOrderInDB,
  deleteOrder as deleteOrderInDB
} from "../models/mysql/order.model";

import {
  createOrderItem as createOrderItemInDB,
  getOrderItemsByOrderId as getOrderItemsFromDB,
  updateOrderItem as updateOrderItemInDB,
  deleteOrderItem as deleteOrderItemInDB
} from "../models/mysql/orderItem.model";

// Get all orders

export const getAllOrdersService = async () => {
  return await getAllOrdersFromDB();
}

// Create a new order
export const createOrderService = async (userId: number, totalPrice: number) => {
  if (!userId || userId <= 0) throw new Error("Invalid user id");
  if (totalPrice < 0) throw new Error("Total price cannot be negative");

  return await createOrderInDB({ user_id: userId, total_price: totalPrice });
}

// Get a single order by id
export const getOrderService = async (orderId: number): Promise<Order | null> => {
  if (!orderId || orderId <= 0) throw new Error("Invalid order id");
  return await getOrderFromDB(orderId);
}

// Get all orders for a user
export const getOrdersByUserService = async (userId: number): Promise<Order[]> => {
  if (!userId || userId <= 0) throw new Error("Invalid user id");
  return await getOrdersFromDB(userId);
}

// Update an order
export const updateOrderService = async (orderId: number, order: Partial<Order>) => {
  if (!orderId || orderId <= 0) throw new Error("Invalid order id");
  return await updateOrderInDB(orderId, order);
}

// Delete an order
export const deleteOrderService = async (orderId: number) => {
  if (!orderId || orderId <= 0) throw new Error("Invalid order id");
  return await deleteOrderInDB(orderId);
}

// Add an order item
export const addOrderItemService = async (orderItem: OrderItemModel) => {
  const { order_id, product_id, quantity, price_at_order } = orderItem;

  if (!order_id || order_id <= 0) throw new Error("Invalid order id");
  if (!product_id || product_id <= 0) throw new Error("Invalid product id");
  if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");
  if (price_at_order < 0) throw new Error("Price cannot be negative");

  return await createOrderItemInDB(orderItem);
}

// Get all order items for a specific order
export const getOrderItemsService = async (orderId: number): Promise<OrderItemModel[]> => {
  if (!orderId || orderId <= 0) throw new Error("Invalid order id");
  return await getOrderItemsFromDB(orderId);
}

// Update an order item
export const updateOrderItemService = async (orderItemId: number, data: Partial<OrderItemModel>) => {
  if (!orderItemId || orderItemId <= 0) throw new Error("Invalid order item id");
  return await updateOrderItemInDB(orderItemId, data);
}

// Delete an order item
export const removeOrderItemService = async (orderItemId: number) => {
  if (!orderItemId || orderItemId <= 0) throw new Error("Invalid order item id");
  return await deleteOrderItemInDB(orderItemId);
}
