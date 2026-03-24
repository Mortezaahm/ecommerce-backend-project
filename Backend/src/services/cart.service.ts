// Backend/src/services/cart.service.ts
import {
  getCartByUserId as getCartFromDB,
  createCart as createCartInDB,
  addCartItem as addCartItemInDB,
  updateCartItemQuantity as updateCartItemQuantityInDB,
  removeCartItem as removeCartItemInDB
} from "../models/mysql/cart.model";
import type { CartItem } from "../models/mysql/cart.model";

// Get all cart items for a user
export const getCartService = async (userId: number): Promise<CartItem[]> => {
    if (!userId || userId <= 0) throw new Error("Invalid user id");
    return await getCartFromDB(userId);
}

// Create a new cart for a user
export const createCartService = async (userId: number) => {
    if (!userId || userId <= 0) throw new Error("Invalid user id");
    return await createCartInDB(userId);
}

// Add an item to a cart
export const addCartItemService = async (
    cartId: number,
    productId: number,
    quantity: number,
    price: number
) => {
    if (!cartId || cartId <= 0) throw new Error("Invalid cart id");
    if (!productId || productId <= 0) throw new Error("Invalid product id");
    if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");
    if (!price || price < 0) throw new Error("Price cannot be negative");

    return await addCartItemInDB(cartId, productId, quantity, price);
}

// Update quantity of a cart item
export const updateCartItemQuantityService = async (cartItemId: number, quantity: number) => {
    if (!cartItemId || cartItemId <= 0) throw new Error("Invalid cart item id");
    if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");

    return await updateCartItemQuantityInDB(cartItemId, quantity);
}

// Remove an item from the cart
export const removeCartItemService = async (cartItemId: number) => {
    if (!cartItemId || cartItemId <= 0) throw new Error("Invalid cart item id");
    return await removeCartItemInDB(cartItemId);
}
