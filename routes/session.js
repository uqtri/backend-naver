import express from "express";
import {
  getSessions,
  deleteSession,
  updateSession,
  createSession,
  setCurrentSession,
} from "../controllers/session.js";
const router = express.Router();

router.get("/", getSessions);
router.delete("/:sessionId", deleteSession);
router.put("/:sessionId", updateSession);
router.post("/", createSession);
router.put("/current/:sessionId", setCurrentSession);
export default router;
