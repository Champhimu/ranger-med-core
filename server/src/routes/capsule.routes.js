import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addCapsule,
  markDoseTaken,
  markDoseMissed,
  snoozeDose,
  capsuleHistory,
  getCapsules,
  getAllHistory,
  getReminders,
  getRecommendations
} from "../controllers/capsule.controller.js";

const router = express.Router();

// Capsules
router.post("/add", auth, addCapsule);
router.get("/", auth, getCapsules);

// Dose actions
router.patch("/dose/:id/taken", auth, markDoseTaken);
router.patch("/dose/:id/missed", auth, markDoseMissed);
router.patch("/dose/:id/snooze", auth, snoozeDose);

// History
router.get("/history/:capsuleId", auth, capsuleHistory);
router.get("/history", auth, getAllHistory);

// Reminders
router.get("/reminders", auth, getReminders);

// AI Smart Recommendations
router.get("/recommendations", auth, getRecommendations);

export default router;
