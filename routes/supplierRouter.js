import express from "express";

import {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  deleteSupplier,
  updateSupplier,
} from "../controllers/supplierController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllSuppliers);
router.get("/:id", getSupplier);
router.post("/", createSupplier);
router.delete("/:id", deleteSupplier);
router.put("/:id", updateSupplier);

export default router;
