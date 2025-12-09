import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["ranger", "doctor", "admin"], default: "ranger" },
  refreshToken: String,
  fcmToken: String,
});

export default mongoose.model("User", userSchema);
