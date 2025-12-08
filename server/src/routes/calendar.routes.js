import express from "express";
import { auth } from "../middlewares/auth.js";
import { getCalendarData } from "../controllers/calendar.controller.js";

const router = express.Router();

router.get("/", auth, getCalendarData);

export default router;
