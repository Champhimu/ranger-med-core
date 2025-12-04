import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  dosage: String,
  frequency: String, // "once_daily", "twice_daily", "custom"
  timeSlots: [String], // ["08:00", "20:00"]
  startDate: Date,
  endDate: Date,
});

export default mongoose.model("Capsule", capsuleSchema);
