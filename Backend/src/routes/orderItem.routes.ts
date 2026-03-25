// route for order items
import express from "express";
import {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  removeOrderItem
} from "../controllers/orderItem.controllers";

const router = express.Router();

// Add a new order item
router.post("/", addOrderItem);

// Get all items for a specific order
router.get("/:orderId", getOrderItems);

// Update an order item
router.put("/:orderItemId", updateOrderItem);

// Remove an order item
router.delete("/:orderItemId", removeOrderItem);

export default router;
