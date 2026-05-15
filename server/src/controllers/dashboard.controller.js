import Dose from "../models/Dose.js";
import Symptom from "../models/Symptom.js";

// GET /api/symptoms/dashboard
export const healthDashboard = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  // Today’s doses
  const todaysDoses = await Dose.find({ userId, date: today });

  // Adherence score
  const total = await Dose.countDocuments({ userId });
  const taken = await Dose.countDocuments({ userId, status: "taken" });

  const adherence = total ? Math.round((taken / total) * 100) : 0;

  // Missed streak
  const missed = await Dose.countDocuments({ userId, status: "missed" });

  // Symptom urgency trend
  const symptoms = await Symptom.find({ userId }).sort({ date: -1 }).limit(10);
  const avgUrgency =
    symptoms.length ?
    Math.round(symptoms.map(s => s.urgencyLevel).reduce((a,b)=>a+b)/symptoms.length)
    : 0;

  // Wellness Score = 100 - missed*2 - avgUrgency*2
  let wellness = 100 - missed * 2 - avgUrgency * 2;
  if (wellness < 0) wellness = 0;

  res.json({
    todaysDoses,
    adherence,
    missedStreak: missed,
    urgencyTrend: avgUrgency,
    wellnessScore: wellness
  });
};
