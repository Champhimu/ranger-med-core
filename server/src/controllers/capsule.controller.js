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

    const doses = generateDoses(capsule);
    await Dose.insertMany(doses);

    res.json({
      message: "Capsule created and doses scheduled",
      capsule,
      dosesCount: doses.length,
    });
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
