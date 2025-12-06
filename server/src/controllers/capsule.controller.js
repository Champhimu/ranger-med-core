import Capsule from "../models/Capsule.js";
import Dose from "../models/Dose.js";
import { generateDoses } from "../utils/doseScheduler.js";

// POST /api/capsules/add
export const addCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.create({
      userId: req.user.id,
      ...req.body
    });

    const { doses, refillDate, remainingStock } = generateDoses(capsule);

    // Save all doses
    await Dose.insertMany(doses);

    // Update capsule with refillDate and remaining stock
    capsule.refillDate = refillDate;
    capsule.stock = remainingStock;
    capsule.timeSlots = req.body.time;
    await capsule.save();

    res.json({
      message: "Capsule created and doses scheduled",
      capsule,
      dosesCount: doses.length,
      refillDate,
      remainingStock
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/capsules
export const getCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.user.id });
    res.json(capsules);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// PATCH /api/capsule/dose/DOSE_ID/taken
export const markDoseTaken = async (req, res) => {
  const id = req.params.id;
  await Dose.findByIdAndUpdate(id, { status: "taken" });

  res.json({ message: "Dose marked as taken" });
};

// PATCH /api/capsule/dose/DOSE_ID/missed
export const markDoseMissed = async (req, res) => {
  const id = req.params.id;
  await Dose.findByIdAndUpdate(id, { status: "missed" });

  res.json({ message: "Dose marked as missed" });
};

// PATCH /api/capsule/dose/DOSE_ID/snooze
export const snoozeDose = async (req, res) => {
  const { snoozeTime } = req.body;
  const id = req.params.id;

  await Dose.findByIdAndUpdate(id, {
    status: "snoozed",
    snoozeTime
  });

  res.json({ message: `Dose snoozed until ${snoozeTime}` });
};

export const capsuleHistory = async (req, res) => {
  const history = await Dose.find({
    capsuleId: req.params.capsuleId,
  });

  res.json(history);
};

// FULL HISTORY (ALL MEDICATIONS)
// GET /api/capsules/history
export const getAllHistory = async (req, res) => {
  try {
    const doses = await Dose.find({ userId: req.user.id }).populate("capsuleId");
    const history = doses.map(dose => ({
      id: dose._id,
      name: dose.capsuleId.name,
      dosage: `${dose.capsuleId.doseAmount} ${dose.capsuleId.doseUnit}`,
      period: `${dose.capsuleId.startDate.toDateString()} - ${dose.capsuleId.endDate.toDateString()}`,
      prescribedBy: dose.capsuleId.prescribedBy,
      reason: dose.reason || "N/A",
      status: dose.status
    }));
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// REMINDERS FOR TODAY
// GET /api/capsules/reminders
export const getReminders = async (req, res) => {
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  try {
    const doses = await Dose.find({
      userId: req.user.id,
      date: today,
      status: "pending"
    }).populate("capsuleId");

    const reminders = doses.map(dose => ({
      id: dose._id,
      medication: dose.capsuleId.name,
      dosage: `${dose.capsuleId.doseAmount} ${dose.capsuleId.doseUnit}`,
      time: dose.timeSlot,
      status: dose.status
    }));

    res.json(reminders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// AI-POWERED SMART RECOMMENDATIONS
export const getRecommendations = async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.user.id });
    const doses = await Dose.find({ userId: req.user.id });

    // Simple AI logic placeholder
    const recommendations = capsules.map(capsule => {
      const missedCount = doses.filter(d => d.capsuleId.toString() === capsule._id.toString() && d.status === "missed").length;
      let type = "consistency-alert";
      let priority = "low";
      let message = "You're taking this medication consistently.";

      if (missedCount > 2) {
        type = "consistency-alert";
        priority = "high";
        message = `You missed ${missedCount} doses recently. Try to take it on time.`;
      } else if (capsule.stock && capsule.stock < 5) {
        type = "refill-alert";
        priority = "high";
        message = `Low stock: only ${capsule.stock} pills left. Refill soon.`;
      }

      return {
        medication: capsule.name,
        type,
        priority,
        message,
        suggestedTime: capsule.timeSlots?.[0] || null,
        suggestedAction: type === "refill-alert" ? "Refill medication" : "Take on schedule",
        confidence: 90 
      };
    });

    res.json(recommendations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};