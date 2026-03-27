// route for orders
import express from "express";
import {
  getAllOrders,
  createOrder,
  getOrder,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  removeOrderItem
} from "../controllers/order.controllers";

const router = express.Router();

// get all orders
router.get("/", getAllOrders);

// Orders endpoints
router.post("/", createOrder);
router.get("/:orderId", getOrder);
router.get("/user/:userId", getOrdersByUser);
router.put("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);

// OrderItems endpoints
router.post("/item", addOrderItem);
router.get("/item/:orderId", getOrderItems);
router.put("/item/:orderItemId", updateOrderItem);
router.delete("/item/:orderItemId", removeOrderItem);

export default router;
