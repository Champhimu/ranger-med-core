import express from 'express';
import { getAllDoctors, getDoctorById } from '../controllers/doctor.controller.js';
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get('/', auth, getAllDoctors);
router.get('/:id', auth, getDoctorById);

export default router;
