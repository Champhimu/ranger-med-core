import mongoose from "mongoose";

const doseSchema = new mongoose.Schema({
  capsuleId: { type: mongoose.Schema.Types.ObjectId, ref: "Capsule", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: String,  // 2025-01-10
  time: String,  // 08:00 or 20:00
  dosage: String,
  status: {
    type: String,
    enum: ["scheduled", "taken", "missed", "snoozed"],
    default: "scheduled"
  },
  snoozeTime: String,   // optional new reminder time
  actualTime: Date,     // When user actually took the dose
  uniqueKey: {
    type: String,
    unique: true
  },
  notes: String,
}, {
  timestamps: true
});

export default mongoose.model("Dose", doseSchema);
