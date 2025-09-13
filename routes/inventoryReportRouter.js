import express from "express";
import {
  getAllInventoryReports,
  getInventoryReportById,
  getInventoryReportByMonthYear,
  createInventoryReport,
  updateInventoryReport,
  deleteInventoryReport,
} from "../controllers/inventoryReportController.js";

const router = express.Router();

// Get all inventory reports
router.get("/", getAllInventoryReports);

// Get inventory report by ID
router.get("/:id", getInventoryReportById);

// Get inventory report by month and year
router.get("/month/:month/year/:year", getInventoryReportByMonthYear);

// Create new inventory report
router.post("/", createInventoryReport);

// Update inventory report details
router.put("/:id", updateInventoryReport);

// Delete inventory report
router.delete("/:id", deleteInventoryReport);

export default router;
