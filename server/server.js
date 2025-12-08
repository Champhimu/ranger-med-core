import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import morgan from "morgan";

// Utils & Config
import connectDB from "./src/config/db.js";
import { processDoseReminders } from "./src/utils/reminderEngine.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import capsuleRoutes from "./src/routes/capsule.routes.js";
import symptomRoutes from "./src/routes/symptom.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import appointmentRoutes from "./src/routes/appointement.routes.js";
import symptomAnalysisRoutes from "./src/routes/symptomAnalysis.routes.js";
import weeklyInsightRoutes from "./src/routes/weeklyInsight.routes.js";
import calendarRoutes from "./src/routes/calendar.routes.js";
// import aiRoutes from "./src/routes/ai.routes.js";

const app = express();

// Load environment variables first
dotenv.config();

// CORS Configuration - Allow requests from React app
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://ranger-med-core.netlify.app/'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Database
connectDB(); // Your custom Mongo connection

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/symptom-analysis", symptomAnalysisRoutes);
app.use("/api/weekly-insights", weeklyInsightRoutes);
app.use("/api/calendar", calendarRoutes);
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
// cron.schedule("* * * * *", () => {
//   processDoseReminders();
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Ranger Med-Core API running on port ${PORT}`)
);
