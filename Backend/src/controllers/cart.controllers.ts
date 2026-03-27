// logic for cart
import type { Request, Response } from "express";
import {
  getCartService,
  createCartService,
  addCartItemService,
  updateCartItemQuantityService,
  removeCartItemService
} from "../services/cart.service";

// Get all cart items for a user
export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const cart = await getCartService(userId);
        res.json(cart);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

// Create a new cart for a user
export const createCart = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.body.userId);
        const result = await createCartService(userId);
        res.status(201).json({ cartId: result.insertId });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

// Add an item to the cart
export const addCartItem = async (req: Request, res: Response) => {
    try {
        const { cartId, productId, quantity, price } = req.body;
        const result = await addCartItemService(cartId, productId, quantity, price);
        res.status(201).json({ cartItemId: result.insertId });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

// Update quantity of a cart item
export const updateCartItemQuantity = async (req: Request, res: Response) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        const { quantity } = req.body;
        const result = await updateCartItemQuantityService(cartItemId, quantity);
        res.json({ success: result.affectedRows > 0 });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

// Remove an item from the cart
export const removeCartItem = async (req: Request, res: Response) => {
    try {
        const cartItemId = Number(req.params.cartItemId);
        const result = await removeCartItemService(cartItemId);
        res.json({ success: result.affectedRows > 0 });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}
