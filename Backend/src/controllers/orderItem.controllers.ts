// controllers for order items
import type { Request, Response } from "express";
import {
  addOrderItemService,
  getOrderItemsService,
  updateOrderItemService,
  removeOrderItemService
} from "../services/orderItem.service";

// Add a new order item
export const addOrderItem = async (req: Request, res: Response) => {
  try {
    const result = await addOrderItemService(req.body);
    res.status(201).json({ orderItemId: result.insertId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Get all items for a specific order
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
    const success = await updateOrderItemService(orderItemId, req.body);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Remove an order item
export const removeOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItemId = Number(req.params.orderItemId);
    const success = await removeOrderItemService(orderItemId);
    res.json({ success });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
