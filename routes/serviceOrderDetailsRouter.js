import {
  getServiceOrderDetails,
  updateServiceOrderDetails,
  createServiceOrderDetails,
  deleteServiceOrderDetails,
  getAllServiceOrderDetails,
} from "../controllers/serviceOrderDetailsController.js";

import express from "express";
const router = express.Router();

router.get("/:service_order_id", getAllServiceOrderDetails);
router.get("/:service_order_id/:service_id", getServiceOrderDetails);
router.post("/", createServiceOrderDetails);
router.put("/:service_order_id/:service_id", updateServiceOrderDetails);
router.delete("/:service_order_id/:service_id", deleteServiceOrderDetails);
export default router;
