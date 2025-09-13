import {
  updateCart,
  getCartByUserId,
  addToCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getCartByUserId);
router.post("/add/:product_id", verifyToken, addToCart);
router.post("/remove/:product_id", verifyToken, removeFromCart);
router.put("/update/:product_id", verifyToken, updateCart);

export default router;
