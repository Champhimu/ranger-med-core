import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  doseAmount: Number,
  doseUnit: String,
  dosage: String, // optional, can be computed from amount + unit
  frequency: String, // "once_daily", "twice_daily", etc.
  timeSlots: [String], // ["08:00", "20:00"]
  stock: Number,
  prescribedBy: String,
  condition: String,
  instructions: String,
  sideEffects: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  refillDate: Date, // date when user should refill medication
  lastTaken: Date, // timestamp of the last taken dose
  reason: String,
}, {
  timestamps: true // adds createdAt and updatedAt
});

export default mongoose.model("Capsule", capsuleSchema);
