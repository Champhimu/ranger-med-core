import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateReport } from "../controllers/report.controller.js";

const router = express.Router();

// Generate and download medical report PDF
router.get("/generate", auth, generateReport);

export default router;
