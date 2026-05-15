import WeeklyInsight from "../models/WeeklyInsight.js";
import {
  generateWeeklyInsight,
  getUserWeeklyInsights,
  getCurrentWeekInsight
} from "../services/weeklyInsight.service.js";

/**
 * Get current week's insight
 * GET /api/weekly-insights/current
 */
export const getCurrentInsight = async (req, res) => {
  try {
    const userId = req.user.userId;

    const insight = await getCurrentWeekInsight(userId);

    if (!insight) {
      return res.status(404).json({
        message: "No insight available for current week"
      });
    }

    // Mark as viewed
    if (insight.status === 'generated' && !insight.viewedAt) {
      insight.status = 'viewed';
      insight.viewedAt = new Date();
      await insight.save();
    }

    return res.status(200).json({
      insight
    });

  } catch (error) {
    console.error("Error in getCurrentInsight:", error);
    return res.status(500).json({
      message: "Failed to get current week insight",
      error: error.message
    });
  }
};

/**
 * Get all weekly insights for user
 * GET /api/weekly-insights/history
 */
export const getInsightHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 12 } = req.query;

    const insights = await getUserWeeklyInsights(userId, parseInt(limit));

    return res.status(200).json({
      insights,
      count: insights.length
    });

  } catch (error) {
    console.error("Error in getInsightHistory:", error);
    return res.status(500).json({
      message: "Failed to get insight history",
      error: error.message
    });
  }
};

/**
 * Generate insight for a specific week
 * POST /api/weekly-insights/generate
 */
export const generateInsight = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.body;

    const targetDate = date ? new Date(date) : new Date();

    const insight = await generateWeeklyInsight(userId, targetDate);

    return res.status(201).json({
      message: "Weekly insight generated successfully",
      insight
    });

  } catch (error) {
    console.error("Error in generateInsight:", error);
    return res.status(500).json({
      message: "Failed to generate weekly insight",
      error: error.message
    });
  }
};

/**
 * Get specific insight by ID
 * GET /api/weekly-insights/:id
 */
export const getInsightById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const insight = await WeeklyInsight.findOne({
      _id: id,
      userId: userId
    });

    if (!insight) {
      return res.status(404).json({
        message: "Insight not found"
      });
    }

    return res.status(200).json({
      insight
    });

  } catch (error) {
    console.error("Error in getInsightById:", error);
    return res.status(500).json({
      message: "Failed to get insight",
      error: error.message
    });
  }
};

/**
 * Get insights by date range
 * GET /api/weekly-insights/range
 */
export const getInsightsByRange = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required"
      });
    }

    const insights = await WeeklyInsight.find({
      userId,
      weekStartDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ weekStartDate: -1 });

    return res.status(200).json({
      insights,
      count: insights.length
    });

  } catch (error) {
    console.error("Error in getInsightsByRange:", error);
    return res.status(500).json({
      message: "Failed to get insights by range",
      error: error.message
    });
  }
};

/**
 * Get insights statistics
 * GET /api/weekly-insights/stats
 */
export const getInsightStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const insights = await WeeklyInsight.find({ userId })
      .sort({ weekStartDate: -1 })
      .limit(12);

    if (insights.length === 0) {
      return res.status(200).json({
        stats: {
          averageAdherence: 0,
          averageHealthScore: 0,
          totalAchievements: 0,
          currentStreak: 0,
          bestWeek: null,
          trend: 'new'
        }
      });
    }

    // Calculate statistics
    const averageAdherence = Math.round(
      insights.reduce((sum, i) => sum + i.medicationAdherence.adherenceRate, 0) / insights.length
    );

    const averageHealthScore = Math.round(
      insights.reduce((sum, i) => sum + i.healthScore.overall, 0) / insights.length
    );

    const totalAchievements = insights.reduce((sum, i) => sum + i.achievements.length, 0);

    const currentStreak = insights[0]?.medicationAdherence.streak || 0;

    // Find best week
    const bestWeek = insights.reduce((best, current) => {
      if (!best || current.healthScore.overall > best.healthScore.overall) {
        return current;
      }
      return best;
    }, null);

    // Calculate trend
    let trend = 'stable';
    if (insights.length >= 4) {
      const recent = insights.slice(0, 4);
      const older = insights.slice(4, 8);
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, i) => sum + i.healthScore.overall, 0) / recent.length;
        const olderAvg = older.reduce((sum, i) => sum + i.healthScore.overall, 0) / older.length;
        
        if (recentAvg > olderAvg + 5) trend = 'improving';
        else if (recentAvg < olderAvg - 5) trend = 'declining';
      }
    }

    return res.status(200).json({
      stats: {
        averageAdherence,
        averageHealthScore,
        totalAchievements,
        currentStreak,
        bestWeek: bestWeek ? {
          weekNumber: bestWeek.weekNumber,
          year: bestWeek.year,
          healthScore: bestWeek.healthScore.overall,
          weekStartDate: bestWeek.weekStartDate
        } : null,
        trend,
        weeksTracked: insights.length
      }
    });

  } catch (error) {
    console.error("Error in getInsightStats:", error);
    return res.status(500).json({
      message: "Failed to get insight statistics",
      error: error.message
    });
  }
};

/**
 * Regenerate insight for a specific week
 * PUT /api/weekly-insights/:id/regenerate
 */
export const regenerateInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingInsight = await WeeklyInsight.findOne({
      _id: id,
      userId: userId
    });

    if (!existingInsight) {
      return res.status(404).json({
        message: "Insight not found"
      });
    }

    // Delete and regenerate
    await WeeklyInsight.deleteOne({ _id: id });

    const newInsight = await generateWeeklyInsight(userId, existingInsight.weekStartDate);

    return res.status(200).json({
      message: "Insight regenerated successfully",
      insight: newInsight
    });

  } catch (error) {
    console.error("Error in regenerateInsight:", error);
    return res.status(500).json({
      message: "Failed to regenerate insight",
      error: error.message
    });
  }
};

/**
 * Archive an insight
 * PATCH /api/weekly-insights/:id/archive
 */
export const archiveInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const insight = await WeeklyInsight.findOneAndUpdate(
      { _id: id, userId: userId },
      { status: 'archived' },
      { new: true }
    );

    if (!insight) {
      return res.status(404).json({
        message: "Insight not found"
      });
    }

    return res.status(200).json({
      message: "Insight archived successfully",
      insight
    });

  } catch (error) {
    console.error("Error in archiveInsight:", error);
    return res.status(500).json({
      message: "Failed to archive insight",
      error: error.message
    });
  }
};

export default {
  getCurrentInsight,
  getInsightHistory,
  generateInsight,
  getInsightById,
  getInsightsByRange,
  getInsightStats,
  regenerateInsight,
  archiveInsight
};
