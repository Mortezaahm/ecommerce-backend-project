import express from "express";
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItemsByCartId
} from "../models/mysql/cartitem.model";

const router = express.Router();

// Get all items in a cart
router.get("/:cartId/items", async (req, res) => {
  const cartId = Number(req.params.cartId);
  const items = await getCartItemsByCartId(cartId);
  res.json(items);
});

// Add a product to the cart
router.post("/:cartId/items", async (req, res) => {
  const cartId = Number(req.params.cartId);
  const { productId, quantity } = req.body;
  const newItem = await createCartItem({ cartId, productId, quantity });
  res.status(201).json(newItem);
});

// Update quantity of a cart item
router.put("/items/:cartItemId", async (req, res) => {
  const cartItemId = Number(req.params.cartItemId);
  const { quantity } = req.body;
  const updated = await updateCartItem(cartItemId, { quantity });
  res.json(updated);
});

// Remove a product from the cart
router.delete("/items/:cartItemId", async (req, res) => {
  const cartItemId = Number(req.params.cartItemId);
  const success = await deleteCartItem(cartItemId);
  res.json({ success });
});

export default router;
