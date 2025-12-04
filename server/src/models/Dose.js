import mongoose from "mongoose";

const doseSchema = new mongoose.Schema({
  capsuleId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  date: String,  // 2025-01-10
  time: String,  // 08:00 or 20:00
  status: {
    type: String,
    enum: ["scheduled", "taken", "missed", "snoozed"],
    default: "scheduled"
  },
  snoozeTime: String,   // optional new reminder time
  uniqueKey: {
    type: String,
    unique: true
  }
});

export default mongoose.model("Dose", doseSchema);
