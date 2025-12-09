import express from "express";
import {
  getCurrentInsight,
  getInsightHistory,
  generateInsight,
  getInsightById,
  getInsightsByRange,
  getInsightStats,
  regenerateInsight,
  archiveInsight
} from "../controllers/weeklyInsight.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/weekly-insights/current
 * @desc    Get current week's insight
 * @access  Private
 */
router.get("/current", getCurrentInsight);

/**
 * @route   GET /api/weekly-insights/history
 * @desc    Get all weekly insights for user
 * @access  Private
 * @query   limit - Number of insights to return (default: 12)
 */
router.get("/history", getInsightHistory);

/**
 * @route   GET /api/weekly-insights/stats
 * @desc    Get insights statistics and trends
 * @access  Private
 */
router.get("/stats", getInsightStats);

/**
 * @route   GET /api/weekly-insights/range
 * @desc    Get insights by date range
 * @access  Private
 * @query   startDate, endDate
 */
router.get("/range", getInsightsByRange);

/**
 * @route   POST /api/weekly-insights/generate
 * @desc    Generate insight for a specific week
 * @access  Private
 * @body    date (optional) - Date within the week to generate
 */
router.post("/generate", generateInsight);

/**
 * @route   GET /api/weekly-insights/:id
 * @desc    Get specific insight by ID
 * @access  Private
 */
router.get("/:id", getInsightById);

/**
 * @route   PUT /api/weekly-insights/:id/regenerate
 * @desc    Regenerate a specific insight
 * @access  Private
 */
router.put("/:id/regenerate", regenerateInsight);

/**
 * @route   PATCH /api/weekly-insights/:id/archive
 * @desc    Archive an insight
 * @access  Private
 */
router.patch("/:id/archive", archiveInsight);

export default router;
