import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symptom: String,
  severity: Number,
  predictedCondition: String,
  urgencyLevel: Number,
  riskLevel: String,
  category: String,
  explanation: String,
  isSerious: Boolean,
  notes: String,
  date: String,   // "2025-01-01"
  time: String    // "09:30"
});

export default mongoose.model("Symptom", symptomSchema);
