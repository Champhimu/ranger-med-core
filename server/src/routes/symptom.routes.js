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

router.post('/add', createSymptom);
router.get('/', getSymptoms);
router.get('/progress', getProgress);
router.get('/:id', getSymptom);
router.put('/:id', updateSymptom);
router.delete('/:id', deleteSymptom);

router.get("/dashboard", auth, healthDashboard);

export default router;
