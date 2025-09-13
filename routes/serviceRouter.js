import express from "express";

const router = express.Router();

import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

// Get all services
router.get("/", getAllServices);

// Get service by ID
router.get("/:id", getServiceById);

// Create new service
router.post("/", createService);

// Update service
router.put("/:id", updateService);

// Delete service
router.delete("/:id", deleteService);

export default router;
