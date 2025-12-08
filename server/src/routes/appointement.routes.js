import express from 'express';
import { getUserAppointments, bookAppointment, updateAppointmentStatus, getAppointments } from '../controllers/appointment.controller.js';
import { auth } from "../middlewares/auth.js";

const router = express.Router();
// Get all appointments of a user
router.get('/:userId', auth, getUserAppointments);

// Book a new appointment
router.post('/book', auth, bookAppointment);
router.get("/", auth, getAppointments);

// Update appointment status
router.patch('/:id/status', auth, updateAppointmentStatus);

export default router;
