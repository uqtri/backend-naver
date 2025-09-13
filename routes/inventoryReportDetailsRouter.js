import express from "express";
import {
  getAllInventoryReportDetails,
  getInventoryReportDetail,
  createInventoryReportDetail,
  updateInventoryReportDetail,
  deleteInventoryReportDetail,
} from "../controllers/inventoryReportDetailsController.js";

const router = express.Router();

// Get all inventory report details
router.get("/", getAllInventoryReportDetails);

// Get inventory report details by ID
router.get("/:reportId/:productId", getInventoryReportDetail);

// Create new inventory report details
router.post("/", createInventoryReportDetail);

// Update inventory report details
router.put("/:reportId/:productId", updateInventoryReportDetail);

// Delete inventory report details
router.delete("/:reportId/:productId", deleteInventoryReportDetail);

export default router;
