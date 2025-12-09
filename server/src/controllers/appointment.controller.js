import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const getAppointments = async (req, res) => {
  try {
    console.log("REQ",req.user.id);
    const today = new Date().setHours(0, 0, 0, 0);

    let appointments = await Appointment.find({ user: req.user.id })
      .sort({ date: 1 })
      .populate("doctor", "name specialty location");

    // Auto-cancel past pending appointments
    const updates = [];
    console.log("app",appointments);
    appointments.forEach(a => {
      const isPast = new Date(a.date).setHours(0, 0, 0, 0) < today;
      console.log(isPast, "PAST", today);
      if (isPast && (a.status === "pending" || a.status === "confirmed")) {
        // status update to cancelled
        updates.push(
          Appointment.findByIdAndUpdate(a._id, { status: "cancelled" }, { new: true })
        );
      }
    });

    if (updates.length > 0) {
      // Apply the updates and reload fresh data
      await Promise.all(updates);
      appointments = await Appointment.find({ user: req.user.id })
        .sort({ date: 1 })
        .populate("doctor", "name specialty location");
    }

    console.log(appointments);
    // Now split upcoming vs past
    const upcoming = appointments.filter(
      a => new Date(a.date).setHours(0, 0, 0, 0) >= today && (a.status === "pending" || a.status === "confirmed")
    );

    const past = appointments.filter(
      a =>
        new Date(a.date).setHours(0, 0, 0, 0) <= today &&
        (a.status === "completed" || a.status === "cancelled")
    );

    res.status(200).json({ upcoming, past });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments for a user
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate('doctor', 'name specialty'); // populate doctor info
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { type, doctor, date, time, reason, notes } = req.body;
    const user = req.user.id;
    console.log(req.body, user);
    const newAppointment = new Appointment({
      type,
      doctor,
      date,
      time,
      reason,
      notes,
      user
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({
      message: "Appointment Booked Successful!"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = req.body.status || appointment.status;
    const updated = await appointment.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
