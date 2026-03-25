// controllers for orders
import type { Request, Response } from "express";
import {
  createOrderService,
  getOrderService,
  getOrdersByUserService,
  updateOrderService,
  deleteOrderService,
  addOrderItemService,
  getOrderItemsService,
  updateOrderItemService,
  removeOrderItemService
} from "../services/order.service";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, totalPrice } = req.body;
    const result = await createOrderService(userId, totalPrice);
    res.status(201).json({ orderId: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single order by id
export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await getOrderService(orderId);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Get all orders for a user
export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const orders = await getOrdersByUserService(userId);
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Update an order
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const result = await updateOrderService(orderId, req.body);
    res.json({ success: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const result = await deleteOrderService(orderId);
    res.json({ success: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Add an order item
export const addOrderItem = async (req: Request, res: Response) => {
  try {
    const result = await addOrderItemService(req.body);
    res.status(201).json({ orderItemId: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Get all order items for an order
export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const items = await getOrderItemsService(orderId);
    res.json(items);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Update an order item
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItemId = Number(req.params.orderItemId);
    const result = await updateOrderItemService(orderItemId, req.body);
    res.json({ success: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Remove an order item
export const removeOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItemId = Number(req.params.orderItemId);
    const result = await removeOrderItemService(orderItemId);
    res.json({ success: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
