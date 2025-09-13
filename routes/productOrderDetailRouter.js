import express from "express";
import {
  getAllPurchaseOrderDetails,
  getPurchaseOrderDetail,
  createPurchaseOrderDetail,
  deletePurchaseOrderDetail,
  updatePurchaseOrderDetail,
} from "../controllers/purchaseOrderDetailsController.js";

const router = express.Router();

router.get("/", getAllPurchaseOrderDetails);
router.get("/:id", getPurchaseOrderDetail);
router.post("/", createPurchaseOrderDetail);
router.delete("/:orderId", deletePurchaseOrderDetail);
router.put("/:orderId", updatePurchaseOrderDetail);

export default router;
