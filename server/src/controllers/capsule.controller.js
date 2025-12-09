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
    capsule.timeSlots = req.body.time;

    const doses = generateDoses(capsule);

    // ---- SAFETY CHECK ----
    if (!doses || doses.length === 0) {
      await capsule.deleteOne();  // rollback capsule creation
      return res.status(400).json({
        error: "Invalid dose schedule. No doses generated.",
      });
    }
    
    // Save all doses
    await Dose.insertMany(doses);

    // Update capsule with refillDate and remaining stock
    await capsule.save();

    res.json({
      message: "Capsule created and doses scheduled",
      capsule,
      dosesCount: doses.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/capsules
export const getCapsules = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Step 1: Find all past doses which are not taken
    const pendingPastDoses = await Dose.find({
      userId,
      status: { $in: ["scheduled", "snoozed"] },
      $expr: {
        $lte: [
          { $dateFromString: { dateString: { $concat: ["$date", "T", "$time"] } } },
          today
        ]
      }
    });

    // Step 2: Mark them as missed
    await Dose.updateMany(
      {
        _id: { $in: pendingPastDoses.map(d => d._id) }
      },
      { $set: { status: "missed" } }
    );

    // Step 3: Fetch user's capsules
    const capsules = await Capsule.find({ userId });

    // Step 4: Include today's doses
    const capsulesWithDoses = await Promise.all(
      capsules.map(async (capsule) => {
        const todaysDoses = await Dose.find({
          capsuleId: capsule._id,
          userId,
          date: todayStr
        }).select("-__v -createdAt -updatedAt");

        return {
          ...capsule.toObject(),
          todaysDoses
        };
      })
    );

    res.json(capsulesWithDoses);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// PATCH /api/capsule/dose/DOSE_ID/taken
export const markDoseTaken = async (req, res) => {
  try {
    const doseId = req.params.id;

    // 1. Find dose
    const dose = await Dose.findById(doseId);
    if (!dose) return res.status(404).json({ error: "Dose not found" });

    // 2. Find capsule
    const capsule = await Capsule.findById(dose.capsuleId);
    if (!capsule) return res.status(404).json({ error: "Capsule not found" });

    // 3. Determine pill count for this dose
    const pillsPerDose = capsule.doseAmount ? Number(capsule.doseAmount) : 1;

    // Ensure stock never becomes negative
    const updatedStock = Math.max((capsule.stock || 0) - pillsPerDose, 0);

    // 4. Update dose
    const updatedDose = await Dose.findByIdAndUpdate(
      doseId,
      {
        status: "taken",
        actualTime: new Date(),
      },
      { new: true }
    );

    // 5. Update capsule stock + last taken time
    const updatedCapsule = await Capsule.findByIdAndUpdate(
      dose.capsuleId,
      {
        lastTaken: new Date(),
        stock: updatedStock,
      },
      { new: true }
    );

    res.json({
      message: "Dose marked as taken, stock reduced, capsule updated",
      dose: updatedDose,
      capsule: updatedCapsule
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while marking dose as taken" });
  }
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
    const today = new Date();

    // Fetch all capsules that have ended
    const capsules = await Capsule.find({ 
      userId: req.user.id, 
      endDate: { $lte: today } 
    });

    const history = [];

    for (const cap of capsules) {
      const doses = await Dose.find({ capsuleId: cap._id, userId: req.user.id });

      const totalDoses = doses.length;
      const takenDoses = doses.filter(d => d.status === "taken").length;
      const missedDoses = doses.filter(d => d.status === "missed").length;
      const skippedDoses = doses.filter(d => d.status === "skipped").length;

      history.push({
        id: cap._id,
        name: cap.name,
        dosage: `${cap.doseAmount} ${cap.doseUnit}`,
        period: `${cap.startDate.toISOString().split("T")[0]} - ${cap.endDate.toISOString().split("T")[0]}`,
        prescribedBy: cap.prescribedBy,
        reason: cap.reason || "N/A",
        totalDoses,
        takenDoses,
        missedDoses,
        skippedDoses,
        status: "Completed"
      });
    }

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
    const now = new Date();
    // Fetch all capsules and doses
    const capsules = await Capsule.find({ userId: req.user.id });
    const doses = await Dose.find({ userId: req.user.id });

    // Filter capsules that are still ongoing or not yet ended
    const activeCapsules = capsules.filter(capsule => !capsule.endDate || new Date(capsule.endDate) >= now);

    const recommendations = activeCapsules.map(capsule => {
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
        endDate: capsule.endDate || null,   // include endDate
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

// GET /api/capsules/pattern
export const getAdherencePattern = async (req, res) => {
  try {
    const today = new Date();

    // Get all active capsules
    const activeCapsules = await Capsule.find({ endDate: { $gte: today } }).lean();

    const insights = await Promise.all(
      activeCapsules.map(async (capsule) => {
        const history = await Dose.find({ capsuleId: capsule._id }).lean();

        if (history.length < 2) {
          return {
            capsuleId: capsule._id,
            name: capsule.name,
            adherence: {
              pattern: "insufficient-data",
              avgDelay: 0,
              consistency: "unknown",
              stdDev: 0
            }
          };
        }

        const taken = history.filter(d => d.status === "taken");

        if (taken.length === 0) {
          return {
            capsuleId: capsule._id,
            name: capsule.name,
            adherence: {
              pattern: "no-doses-taken",
              avgDelay: 0,
              consistency: "unknown",
              stdDev: 0
            }
          };
        }

        const delays = taken.map(d => {
          const [schedH, schedM] = d.time.split(":").map(Number);
          const actual = new Date(d.actualTime);
          return (actual.getHours() * 60 + actual.getMinutes()) - (schedH * 60 + schedM);
        });

        const avgDelay = Math.round(delays.reduce((a, b) => a + b, 0) / delays.length);
        const variance = delays.reduce((sum, d) => sum + Math.pow(d - avgDelay, 2), 0) / delays.length;
        const stdDev = Math.sqrt(variance);

        let consistency = "excellent";
        if (stdDev > 15) consistency = "poor";
        else if (stdDev > 10) consistency = "fair";
        else if (stdDev > 5) consistency = "good";

        let pattern = "on-time";
        if (avgDelay > 10) pattern = "consistently-late";
        else if (avgDelay < -10) pattern = "consistently-early";

        return {
          capsuleId: capsule._id,
          name: capsule.name,
          adherence: {
            pattern,
            avgDelay,
            consistency,
            stdDev: Math.round(stdDev)
          }
        };
      })
    );

    res.json(insights);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
