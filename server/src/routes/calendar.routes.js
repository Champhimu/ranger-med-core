import express from "express";
import { auth } from "../middlewares/auth.js";
import { getCalendarData, getTimelineData } from "../controllers/calendar.controller.js";

const router = express.Router();

router.get("/", auth, getCalendarData);
router.get("/timeline",auth, getTimelineData);

export default router;
