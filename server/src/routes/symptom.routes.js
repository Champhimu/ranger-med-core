import express from "express";
import { previewSymptomAI, addSymptom, getSymptoms } from "../controllers/symptom.controller.js";
import { healthDashboard } from "../controllers/dashboard.controller.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();

router.post("/ai-preview", auth, previewSymptomAI);
router.post("/add", auth, addSymptom);
router.get("/history", auth, getSymptoms);
router.get("/dashboard", auth, healthDashboard);

export default router;
