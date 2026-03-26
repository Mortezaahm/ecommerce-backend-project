// logic for order items
import type { OrderItem } from "../models/mysql/orderItem.model";

import {
  createOrderItem as createOrderItemInDB,
  getOrderItemsByOrderId as getOrderItemsFromDB,
  updateOrderItem as updateOrderItemInDB,
  deleteOrderItem as removeOrderItemInDB
} from "../models/mysql/orderItem.model";
import { getProductById } from "../models/mysql/product.model";

// Add a new order item
export const addOrderItemService = async (orderItem: OrderItem) => {
  const { order__id, product__id, quantity, price_at_order } = orderItem;

  if (!order__id || order__id <= 0) throw new Error("Invalid order id");
  if (!product__id || product__id <= 0) throw new Error("Invalid product id");
  if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");
  if (price_at_order === undefined || price_at_order < 0)
    throw new Error("Price cannot be negative");

  // Check if product is in stock
  const product = await getProductById(product__id);
  if (!product) throw new Error("Product not found");
  if (product.in_stock === false || product.in_stock === 0) {
    throw new Error("Product is out of stock");
  }

  return await createOrderItemInDB(orderItem);
};

// Get all items for a specific order
export const getOrderItemsService = async (orderId: number) => {
  if (!orderId || orderId <= 0) throw new Error("Invalid order id");
  return await getOrderItemsFromDB(orderId);
};

// Update quantity or details of an order item
export const updateOrderItemService = async (
  orderItemId: number,
  data: Partial<OrderItem>
) => {
  if (!orderItemId || orderItemId <= 0) throw new Error("Invalid order item id");
  return await updateOrderItemInDB(orderItemId, data);
};

// Remove an order item
export const removeOrderItemService = async (orderItemId: number) => {
  if (!orderItemId || orderItemId <= 0) throw new Error("Invalid order item id");
  return await removeOrderItemInDB(orderItemId);
};
