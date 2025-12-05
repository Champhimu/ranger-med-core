import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addCapsule,
  markDoseTaken,
  markDoseMissed,
  snoozeDose,
  capsuleHistory
} from "../controllers/capsule.controller.js";

const router = express.Router();

router.post("/add", auth, addCapsule);

router.patch("/dose/:id/taken", auth, markDoseTaken);
router.patch("/dose/:id/missed", auth, markDoseMissed);
router.patch("/dose/:id/snooze", auth, snoozeDose);

router.get("/history/:capsuleId", auth, capsuleHistory);

export default router;
