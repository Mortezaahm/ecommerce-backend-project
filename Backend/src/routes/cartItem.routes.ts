// cart items routes
import express from "express";
import {
  getCartItems,
  addCartItem,
  updateCartItemController,
  deleteCartItemController
} from "../controllers/cartItem.controllers";

const router = express.Router();

// get all items in a cart
router.get("/:cartId/items", getCartItems);

// add a product to the cart
router.post("/:cartId/items", addCartItem);

// update quantity of a cart item
router.put("/items/:cartItemId", updateCartItemController);

// remove a product from the cart
router.delete("/items/:cartItemId", deleteCartItemController);

export default router;
