import express from "express";
import {
  analyzeUserSymptoms,
  getAnalysisHistory,
  getAnalysisById,
  updateAnalysisStatus,
  addDoctorReview,
  getSymptomFollowUp,
  getUrgentCases
} from "../controllers/symptomAnalysis.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   POST /api/symptom-analysis/analyze
 * @desc    Analyze symptoms using AI
 * @access  Private (Rangers)
 */
router.post("/analyze", analyzeUserSymptoms);

/**
 * @route   POST /api/symptom-analysis/follow-up-questions
 * @desc    Get AI-generated follow-up questions
 * @access  Private
 */
router.post("/follow-up-questions", getSymptomFollowUp);

/**
 * @route   GET /api/symptom-analysis/history
 * @desc    Get user's symptom analysis history
 * @access  Private (Rangers)
 * @query   page, limit, status
 */
router.get("/history", getAnalysisHistory);

/**
 * @route   GET /api/symptom-analysis/urgent
 * @desc    Get urgent cases for doctors
 * @access  Private (Doctors only)
 */
router.get("/urgent", getUrgentCases);

/**
 * @route   GET /api/symptom-analysis/:id
 * @desc    Get specific analysis by ID
 * @access  Private
 */
router.get("/:id", getAnalysisById);

/**
 * @route   PATCH /api/symptom-analysis/:id/status
 * @desc    Update analysis status
 * @access  Private
 */
router.patch("/:id/status", updateAnalysisStatus);

/**
 * @route   PATCH /api/symptom-analysis/:id/review
 * @desc    Add doctor review to analysis
 * @access  Private (Doctors only)
 */
router.patch("/:id/review", addDoctorReview);

export default router;
