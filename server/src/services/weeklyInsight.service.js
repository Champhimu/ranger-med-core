import WeeklyInsight from "../models/WeeklyInsight.js";
import Dose from "../models/Dose.js";
import Symptom from "../models/Symptom.js";
import SymptomAnalysis from "../models/SymptomAnalysis.js";
import Capsule from "../models/Capsule.js";

/**
 * Get week number and year from a date
 */
function getWeekInfo(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { weekNumber, year: d.getFullYear() };
}

/**
 * Get start and end dates for a week
 */
function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  
  const weekStartDate = new Date(d.setDate(diff));
  weekStartDate.setHours(0, 0, 0, 0);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  weekEndDate.setHours(23, 59, 59, 999);
  
  return { weekStartDate, weekEndDate };
}

/**
 * Calculate medication adherence for a week
 */
async function calculateMedicationAdherence(userId, weekStartDate, weekEndDate) {
  try {
    // Get all dose logs for the week (using Dose model with date/time fields)
    const doseLogs = await Dose.find({
      userId,
      createdAt: { $gte: weekStartDate, $lte: weekEndDate }
    });

    const totalDoses = doseLogs.length;
    const takenDoses = doseLogs.filter(log => log.status === 'taken').length;
    const missedDoses = doseLogs.filter(log => log.status === 'missed').length;
    const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

    // Calculate streak
    let streak = 0;
    const sortedLogs = doseLogs.sort((a, b) => b.scheduledTime - a.scheduledTime);
    for (const log of sortedLogs) {
      if (log.status === 'taken') {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalDoses,
      takenDoses,
      missedDoses,
      adherenceRate,
      streak
    };
  } catch (error) {
    console.error("Error calculating medication adherence:", error);
    return {
      totalDoses: 0,
      takenDoses: 0,
      missedDoses: 0,
      adherenceRate: 0,
      streak: 0
    };
  }
}

/**
 * Calculate symptom tracking metrics
 */
async function calculateSymptomMetrics(userId, weekStartDate, weekEndDate) {
  try {
    // Get symptoms reported during the week
    const symptoms = await Symptom.find({
      userId,
      date: { $gte: weekStartDate, $lte: weekEndDate }
    });

    const totalSymptoms = symptoms.length;
    const activeSymptoms = symptoms.filter(s => s.status === 'active').length;
    const resolvedSymptoms = symptoms.filter(s => s.status === 'resolved').length;

    // Calculate average severity
    const severityMap = { 'mild': 1, 'moderate': 2, 'severe': 3 };
    let avgSeverity = 'none';
    if (symptoms.length > 0) {
      const totalSeverity = symptoms.reduce((sum, s) => sum + (severityMap[s.severity] || 0), 0);
      const avgValue = totalSeverity / symptoms.length;
      if (avgValue <= 1.5) avgSeverity = 'mild';
      else if (avgValue <= 2.5) avgSeverity = 'moderate';
      else avgSeverity = 'severe';
    }

    // Find most common symptom
    const symptomCounts = {};
    symptoms.forEach(s => {
      symptomCounts[s.symptomName] = (symptomCounts[s.symptomName] || 0) + 1;
    });
    
    let mostCommonSymptom = null;
    if (Object.keys(symptomCounts).length > 0) {
      const [name, count] = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];
      mostCommonSymptom = { name, count };
    }

    return {
      totalSymptoms,
      activeSymptoms,
      resolvedSymptoms,
      averageSeverity: avgSeverity,
      mostCommonSymptom
    };
  } catch (error) {
    console.error("Error calculating symptom metrics:", error);
    return {
      totalSymptoms: 0,
      activeSymptoms: 0,
      resolvedSymptoms: 0,
      averageSeverity: 'none',
      mostCommonSymptom: null
    };
  }
}

/**
 * Analyze weekly patterns
 */
async function analyzePatterns(userId, weekStartDate, weekEndDate) {
  try {
    const doseLogs = await Dose.find({
      userId,
      createdAt: { $gte: weekStartDate, $lte: weekEndDate }
    });

    // Analyze by day of week
    const dayStats = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    doseLogs.forEach(log => {
      // Use createdAt since Dose model doesn't have scheduledTime
      const day = daysOfWeek[new Date(log.createdAt).getDay()];
      if (!dayStats[day]) {
        dayStats[day] = { taken: 0, missed: 0, total: 0 };
      }
      dayStats[day].total++;
      if (log.status === 'taken') dayStats[day].taken++;
      else if (log.status === 'missed') dayStats[day].missed++;
    });

    // Find best and worst days
    let bestDay = null;
    let worstDay = null;
    let bestRate = -1;
    let worstRate = 101;

    Object.entries(dayStats).forEach(([day, stats]) => {
      const rate = stats.total > 0 ? (stats.taken / stats.total) * 100 : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = day;
      }
      if (rate < worstRate && stats.total > 0) {
        worstRate = rate;
        worstDay = day;
      }
    });

    // Analyze medication times
    const medicationTimes = doseLogs
      .filter(log => log.status === 'taken')
      .map(log => {
        // Use actualTime if available, otherwise use time field
        const timeStr = log.actualTime || log.time || '12:00';
        const hour = log.actualTime ? new Date(log.actualTime).getHours() : parseInt(timeStr.split(':')[0]);
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        if (hour < 21) return 'Evening';
        return 'Night';
      });

    const uniqueTimes = [...new Set(medicationTimes)];

    return {
      bestDayOfWeek: bestDay,
      worstDayOfWeek: worstDay,
      medicationTimes: uniqueTimes,
      missedDoseReasons: []
    };
  } catch (error) {
    console.error("Error analyzing patterns:", error);
    return {
      bestDayOfWeek: null,
      worstDayOfWeek: null,
      medicationTimes: [],
      missedDoseReasons: []
    };
  }
}

/**
 * Compare with previous week
 */
async function compareWithPreviousWeek(userId, currentWeek) {
  try {
    // Get previous week's insight
    const previousWeek = await WeeklyInsight.findOne({
      userId,
      weekNumber: currentWeek.weekNumber - 1,
      year: currentWeek.year
    });

    if (!previousWeek) {
      return {
        adherenceChange: 0,
        symptomChange: 0,
        healthScoreChange: 0,
        trend: 'stable'
      };
    }

    const adherenceChange = currentWeek.medicationAdherence.adherenceRate - 
                           previousWeek.medicationAdherence.adherenceRate;
    
    const symptomChange = currentWeek.symptomTracking.activeSymptoms - 
                         previousWeek.symptomTracking.activeSymptoms;
    
    const healthScoreChange = currentWeek.healthScore.overall - 
                             previousWeek.healthScore.overall;

    let trend = 'stable';
    if (healthScoreChange > 5) trend = 'improving';
    else if (healthScoreChange < -5) trend = 'declining';

    return {
      adherenceChange: Math.round(adherenceChange),
      symptomChange,
      healthScoreChange: Math.round(healthScoreChange),
      trend
    };
  } catch (error) {
    console.error("Error comparing with previous week:", error);
    return {
      adherenceChange: 0,
      symptomChange: 0,
      healthScoreChange: 0,
      trend: 'stable'
    };
  }
}

/**
 * Generate weekly goals
 */
function generateGoals(adherence, symptoms) {
  const goals = [];

  // Medication adherence goal
  const currentAdherence = adherence.adherenceRate || 0;
  const adherenceTarget = Math.min(100, currentAdherence + 10);
  goals.push({
    goalType: 'Medication Adherence',
    target: adherenceTarget,
    achieved: currentAdherence,
    percentage: Math.round((currentAdherence / adherenceTarget) * 100),
    completed: currentAdherence >= adherenceTarget
  });

  // Symptom reduction goal
  if (symptoms.activeSymptoms > 0) {
    const symptomTarget = Math.max(0, symptoms.activeSymptoms - 1);
    goals.push({
      goalType: 'Reduce Active Symptoms',
      target: symptomTarget,
      achieved: symptoms.activeSymptoms,
      percentage: symptoms.activeSymptoms <= symptomTarget ? 100 : 0,
      completed: symptoms.activeSymptoms <= symptomTarget
    });
  }

  // Consistency goal
  goals.push({
    goalType: 'Weekly Consistency',
    target: 7,
    achieved: adherence.streak || 0,
    percentage: Math.round(((adherence.streak || 0) / 7) * 100),
    completed: (adherence.streak || 0) >= 7
  });

  return goals;
}

/**
 * Generate weekly summary
 */
function generateSummary(insight) {
  const parts = [];

  // Adherence summary
  if (insight.medicationAdherence.adherenceRate >= 90) {
    parts.push(`Excellent week! You maintained ${insight.medicationAdherence.adherenceRate}% medication adherence.`);
  } else if (insight.medicationAdherence.adherenceRate >= 75) {
    parts.push(`Good effort this week with ${insight.medicationAdherence.adherenceRate}% adherence.`);
  } else {
    parts.push(`Your adherence was ${insight.medicationAdherence.adherenceRate}% this week. Let's aim higher next week!`);
  }

  // Symptom summary
  if (insight.symptomTracking.activeSymptoms === 0) {
    parts.push('No active symptoms reported - great health!');
  } else if (insight.symptomTracking.trend === 'improving') {
    parts.push('Your symptoms are improving!');
  } else if (insight.symptomTracking.activeSymptoms > 0) {
    parts.push(`You have ${insight.symptomTracking.activeSymptoms} active symptom${insight.symptomTracking.activeSymptoms > 1 ? 's' : ''}.`);
  }

  // Achievements summary
  if (insight.achievements.length > 0) {
    parts.push(`You earned ${insight.achievements.length} achievement${insight.achievements.length > 1 ? 's' : ''}!`);
  }

  // Health score
  parts.push(`Your overall health score is ${insight.healthScore.overall}/100.`);

  return parts.join(' ');
}

/**
 * Generate weekly insight for a user
 */
export async function generateWeeklyInsight(userId, date = new Date()) {
  try {
    const { weekStartDate, weekEndDate } = getWeekDates(date);
    const { weekNumber, year } = getWeekInfo(date);

    // Check if insight already exists
    let insight = await WeeklyInsight.findOne({
      userId,
      weekNumber,
      year
    });

    if (insight && insight.status === 'generated') {
      return insight; // Return existing insight
    }

    // Calculate all metrics
    const medicationAdherence = await calculateMedicationAdherence(userId, weekStartDate, weekEndDate);
    const symptomTracking = await calculateSymptomMetrics(userId, weekStartDate, weekEndDate);
    const patterns = await analyzePatterns(userId, weekStartDate, weekEndDate);

    // Create or update insight
    if (!insight) {
      insight = new WeeklyInsight({
        userId,
        weekStartDate,
        weekEndDate,
        weekNumber,
        year
      });
    }

    // Set metrics
    insight.medicationAdherence = medicationAdherence;
    insight.symptomTracking = symptomTracking;
    insight.patterns = patterns;

    // Determine improvement
    const prevWeekInsight = await WeeklyInsight.findOne({
      userId,
      weekNumber: weekNumber - 1,
      year
    });

    if (prevWeekInsight) {
      const change = medicationAdherence.adherenceRate - prevWeekInsight.medicationAdherence.adherenceRate;
      if (change > 5) insight.medicationAdherence.improvement = 'better';
      else if (change < -5) insight.medicationAdherence.improvement = 'worse';
      else insight.medicationAdherence.improvement = 'same';

      const symptomChange = symptomTracking.activeSymptoms - prevWeekInsight.symptomTracking.activeSymptoms;
      if (symptomChange < 0) insight.symptomTracking.trend = 'improving';
      else if (symptomChange > 0) insight.symptomTracking.trend = 'worsening';
      else insight.symptomTracking.trend = 'stable';
    }

    // Calculate health scores
    insight.calculateHealthScore();

    // Compare with previous week
    insight.comparison = await compareWithPreviousWeek(userId, insight);

    // Generate goals
    insight.goals = generateGoals(medicationAdherence, symptomTracking);

    // Check achievements
    insight.checkAchievements();

    // Generate insights
    insight.generateInsights();

    // Generate summary
    insight.summary = generateSummary(insight);

    // Update status
    insight.status = 'generated';
    insight.generatedAt = new Date();

    await insight.save();

    return insight;
  } catch (error) {
    console.error("Error generating weekly insight:", error);
    throw error;
  }
}

/**
 * Get weekly insights for a user
 */
export async function getUserWeeklyInsights(userId, limit = 12) {
  try {
    const insights = await WeeklyInsight.find({ userId })
      .sort({ weekStartDate: -1 })
      .limit(limit);

    return insights;
  } catch (error) {
    console.error("Error getting user weekly insights:", error);
    throw error;
  }
}

/**
 * Get current week's insight
 */
export async function getCurrentWeekInsight(userId) {
  try {
    const { weekNumber, year } = getWeekInfo(new Date());
    
    let insight = await WeeklyInsight.findOne({
      userId,
      weekNumber,
      year
    });

    if (!insight) {
      // Generate if doesn't exist
      insight = await generateWeeklyInsight(userId);
    }

    return insight;
  } catch (error) {
    console.error("Error getting current week insight:", error);
    throw error;
  }
}

export default {
  generateWeeklyInsight,
  getUserWeeklyInsights,
  getCurrentWeekInsight
};
