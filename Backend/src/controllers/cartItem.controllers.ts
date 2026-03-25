// logic for cart items
import {
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem
} from "../services/cartItem.service";

// get all items in a cart
export async function getCartItems(req, res) {
  const cartId = Number(req.params.cartId);
  const items = await getCartItemsByCartId(cartId);
  res.json(items);
}

// add a product to the cart
export async function addCartItem(req, res) {
  const cartId = Number(req.params.cartId);
  const { productId, quantity } = req.body;
  const newItem = await createCartItem({ cartId, productId, quantity });
  res.status(201).json(newItem);
}

// update quantity of a cart item
export async function updateCartItemController(req, res) {
  const cartItemId = Number(req.params.cartItemId);
  const { quantity } = req.body;
  const updated = await updateCartItem(cartItemId, { quantity });
  res.json(updated);
}

// remove a product from the cart
export async function deleteCartItemController(req, res) {
  const cartItemId = Number(req.params.cartItemId);
  const success = await deleteCartItem(cartItemId);
  res.json({ success });
}
