import express from "express";

const router = express.Router();

import {
  getCurrentIntervalByUser,
  createInterval,
  getTimeOfSessions,
  updateInterval,
} from "../controllers/interval.js";

router.get("/current", getCurrentIntervalByUser);
router.put("/:intervalId", updateInterval);
router.post("/", createInterval);
router.get("/time/:sessionId", getTimeOfSessions);
export default router;
