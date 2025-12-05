import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

// Utils & Config
import connectDB from "./src/config/db.js";
import { processDoseReminders } from "./src/utils/reminderEngine.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import capsuleRoutes from "./src/routes/capsule.routes.js";
// import symptomRoutes from "./src/routes/symptom.routes.js";
// import aiRoutes from "./src/routes/ai.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectDB(); // Your custom Mongo connection

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);
// app.use("/api/symptoms", symptomRoutes);
// app.use("/api/ai", aiRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message });
});

// Cron Job - every minute
cron.schedule("* * * * *", () => {
  processDoseReminders();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Ranger Med-Core API running on port ${PORT}`)
);
