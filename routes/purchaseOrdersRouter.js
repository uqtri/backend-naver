import express from "express";
import {
  getAllPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from "../controllers/purchaseOrdersController.js";

const router = express.Router();

// Get all purchase orders
router.get("/", getAllPurchaseOrders);

// Get purchase order by ID
router.get("/:orderId", getPurchaseOrder);

// Create new purchase order
router.post("/", createPurchaseOrder);

// Update purchase order
router.put("/:orderId", updatePurchaseOrder);

// Delete purchase order
router.delete("/:orderId", deletePurchaseOrder);

export default router;
