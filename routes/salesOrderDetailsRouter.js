import {
  getSalesOrderDetails,
  updateSalesOrderDetails,
  createSalesOrderDetails,
  deleteSalesOrderDetails,
  getAllSalesOrderDetails,
} from "../controllers/salesOrderDetailsController.js";

import express from "express";

const router = express.Router();

router.get("/:sales_order_id", getAllSalesOrderDetails);
router.get("/:sales_order_id/:product_id", getSalesOrderDetails);
router.post("/", createSalesOrderDetails);
router.put("/:sales_order_id/:product_id", updateSalesOrderDetails);
router.delete("/:sales_order_id/:product_id", deleteSalesOrderDetails);
export default router;
