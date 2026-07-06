import express from "express";
import { auth } from "../middlewares/auth.js";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

// POST /api/ai/chat — authenticated AI chatbot endpoint
router.post("/chat", auth, chatWithAI);

export default router;
