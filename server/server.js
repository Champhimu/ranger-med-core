import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
// import capsuleRoutes from "./routes/capsule.routes.js";
// import symptomRoutes from "./routes/symptom.routes.js";
// import aiRoutes from "./routes/ai.routes.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
// app.use("/api/capsules", capsuleRoutes);
// app.use("/api/symptoms", symptomRoutes);
// app.use("/api/ai", aiRoutes);

app.listen(5000, () => console.log("Ranger Med-Core API running on 5000"));
