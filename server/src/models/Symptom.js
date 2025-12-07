import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symptomName: { type: String, required: true },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
  bodyPart: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  triggers: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' }
}, { timestamps: true });

export default mongoose.model("Symptom", symptomSchema);
