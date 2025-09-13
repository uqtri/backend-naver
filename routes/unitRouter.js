import express from "express";

import {
  getAllUnits,
  getUnit,
  createUnit,
  deleteUnit,
  updateUnit,
} from "../controllers/unitController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllUnits);
router.get("/:id", getUnit);
router.post("/", createUnit);
router.delete("/:id", deleteUnit);
router.put("/:id", updateUnit);

export default router;
