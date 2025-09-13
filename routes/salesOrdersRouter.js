import express from "express";

import {
  getAllSalesOrders,
  getSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  createSalesOrder,
} from "../controllers/salesOrderController.js";

const router = express.Router();

router.route("/").get(getAllSalesOrders).post(createSalesOrder);

router
  .route("/:sales_order_id")
  .get(getSalesOrder)
  .put(updateSalesOrder)
  .delete(deleteSalesOrder);

export default router;
