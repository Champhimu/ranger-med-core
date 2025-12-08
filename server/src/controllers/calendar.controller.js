// controllers/calendarController.js
import Appointment from "../models/Appointment.js";
import Capsule from "../models/Capsule.js";
import Dose from "../models/Dose.js";
import Symptom from "../models/Symptom.js";

export const getCalendarData = async (req, res) => {
  try {
    const { date } = req.query; // "2025-12-08"
    if (!date) return res.status(400).json({ message: "Date is required" });

    const userId = req.user.id;

    // --------- Appointments ---------
    const appointments = await Appointment.find({
      user: userId,
      date: new Date(date),
      status: 'confirmed'
    }).select("-__v").populate('doctor', 'name specialty');

    // --------- Capsules ---------
    const capsules = await Capsule.find({ userId });

    // Flatten all doses with capsule info
    let allDoses = [];
    for (let capsule of capsules) {
      const todaysDoses = await Dose.find({
        capsuleId: capsule._id,
        userId,
        date
      }).select("-__v -createdAt -updatedAt");

      todaysDoses.forEach(dose => {
        allDoses.push({
          ...dose.toObject(),
          capsule: {
            _id: capsule._id,
            name: capsule.name,
            doseAmount: capsule.doseAmount,
            doseUnit: capsule.doseUnit,
            frequency: capsule.frequency
          }
        });
      });
    }

    // Sort by time
    allDoses.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });

    // --------- Symptoms ---------
    const symptoms = await Symptom.find({ userId, date }).select("-__v");

    // --------- Send Response ---------
    res.json({
      date,
      appointments,
      doses: allDoses,   // now flat sorted array
      symptoms
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
