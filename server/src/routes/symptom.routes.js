import express from "express";
import { 
  createSymptom,
  getSymptoms,
  getSymptom,
  updateSymptom,
  deleteSymptom,
  getProgress
 } from "../controllers/symptom.controller.js";
import { healthDashboard } from "../controllers/dashboard.controller.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();

router.post('/add', auth, createSymptom);
router.get('/', auth, getSymptoms);
router.get('/progress', auth, getProgress);
router.get('/:id', auth, getSymptom);
router.put('/:id', auth,  updateSymptom);
router.delete('/:id', auth, deleteSymptom);

router.get("/dashboard", auth, healthDashboard);

export default router;
