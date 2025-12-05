import express from "express";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { processDoseReminders } from "./src/utils/reminderEngine.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import capsuleRoutes from "./src/routes/capsule.routes.js";
import symptomRoutes from "./src/routes/symptom.routes.js";
// import aiRoutes from "./src/routes/ai.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
dotenv.config();
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);
app.use("/api/symptoms", symptomRoutes);
// app.use("/api/ai", aiRoutes);

app.listen(5000, () => console.log("Ranger Med-Core API running on 5000"));

// Run reminder engine every 1 minute
cron.schedule("* * * * *", () => {
  processDoseReminders();
});