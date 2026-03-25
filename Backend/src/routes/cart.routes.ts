// cart routes
import express from "express";
import {
  getCart,
  createCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem
} from "../controllers/cart.controllers";

const router = express.Router();

// Create a new cart
router.post("/", createCart);

// Get all cart items for a specific user
router.get("/user/:userId", getCart);

// Add an item to the cart
router.post("/item", addCartItem);

// Update quantity of a cart item
router.put("/item/:cartItemId", updateCartItemQuantity);

// Remove an item from the cart
router.delete("/item/:cartItemId", removeCartItem);

export default router;
