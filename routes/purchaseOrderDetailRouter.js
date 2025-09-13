import express from "express";
import {
  getAllPurchaseOrderDetails,
  getPurchaseOrderDetail,
  createPurchaseOrderDetail,
  deletePurchaseOrderDetail,
  updatePurchaseOrderDetail,
} from "../controllers/purchaseOrderDetailsController.js";

const router = express.Router();

router.get("/:id", getAllPurchaseOrderDetails);
router.get("/:id/:id2", getPurchaseOrderDetail);
router.post("/", createPurchaseOrderDetail);
router.delete("/:id/:id2", deletePurchaseOrderDetail);
router.put("/:id/:id2", updatePurchaseOrderDetail);

export default router;
