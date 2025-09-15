import express from "express";
import { getPriorities } from "../controllers/priority.js";

const router = express.Router();

router.get("/", getPriorities);

export default router;
