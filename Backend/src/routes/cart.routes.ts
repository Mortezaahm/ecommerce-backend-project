import express from "express";
import {
  createCart,
  getCartByUserId,
  getCartById,
  updateCart,
  deleteCart
} from "../models/mysql/cart.model";

const router = express.Router();

// create
router.post("/:userId", async (req, res) => {
  const id = await createCart(Number(req.params.userId));
  res.json({ cartId: id });
});

// get by user
router.get("/user/:userId", async (req, res) => {
  const cart = await getCartByUserId(Number(req.params.userId));
  res.json(cart);
});

// get by id
router.get("/:id", async (req, res) => {
  const cart = await getCartById(Number(req.params.id));
  res.json(cart);
});

// update
router.put("/:id", async (req, res) => {
  const success = await updateCart(
    Number(req.params.id),
    req.body.user_id
  );
  res.json({ success });
});

// delete
router.delete("/:id", async (req, res) => {
  const success = await deleteCart(Number(req.params.id));
  res.json({ success });
});

export default router;
