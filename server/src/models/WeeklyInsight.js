import mongoose from "mongoose";

const weeklyInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Week identification
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },

  // Medication adherence metrics
  medicationAdherence: {
    totalDoses: {
      type: Number,
      default: 0
    },
    takenDoses: {
      type: Number,
      default: 0
    },
    missedDoses: {
      type: Number,
      default: 0
    },
    adherenceRate: {
      type: Number,
      default: 0 // Percentage
    },
    streak: {
      type: Number,
      default: 0 // Consecutive days of perfect adherence
    },
    improvement: {
      type: String,
      enum: ['better', 'same', 'worse', 'new'],
      default: 'new'
    }
  },

  // Symptom tracking metrics
  symptomTracking: {
    totalSymptoms: {
      type: Number,
      default: 0
    },
    activeSymptoms: {
      type: Number,
      default: 0
    },
    resolvedSymptoms: {
      type: Number,
      default: 0
    },
    averageSeverity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'none'],
      default: 'none'
    },
    mostCommonSymptom: {
      name: String,
      count: Number
    },
    trend: {
      type: String,
      enum: ['improving', 'stable', 'worsening', 'new'],
      default: 'new'
    }
  },

  // Health score (0-100)
  healthScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    medication: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    symptoms: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    activity: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    }
  },

  // Key achievements
  achievements: [{
    achievementType: {
      type: String,
      enum: ['perfect_week', 'symptom_free', 'streak_milestone', 'improvement', 'consistency']
    },
    title: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Insights and recommendations
  insights: [{
    category: {
      type: String,
      enum: ['medication', 'symptoms', 'wellness', 'alert', 'success']
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    title: String,
    message: String,
    actionable: Boolean,
    action: String // Suggested action
  }],

  // Weekly patterns
  patterns: {
    bestDayOfWeek: String, // Day with best adherence
    worstDayOfWeek: String, // Day with most missed doses
    peakSymptomTime: String, // Time of day with most symptoms
    medicationTimes: [String], // Common medication times
    missedDoseReasons: [{
      reason: String,
      count: Number
    }]
  },

  // Comparisons with previous weeks
  comparison: {
    adherenceChange: Number, // Percentage change
    symptomChange: Number, // Percentage change
    healthScoreChange: Number, // Points change
    trend: {
      type: String,
      enum: ['improving', 'stable', 'declining'],
      default: 'stable'
    }
  },

  // Goals and progress
  goals: [{
    goalType: String, // Changed from 'type' which is reserved
    target: Number,
    achieved: Number,
    percentage: Number,
    completed: Boolean
  }],

  // Generated summary
  summary: {
    type: String
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'generated', 'viewed', 'archived'],
    default: 'pending'
  },

  viewedAt: Date,
  generatedAt: Date

}, { 
  timestamps: true 
});

// Indexes for efficient queries
weeklyInsightSchema.index({ userId: 1, weekStartDate: -1 });
weeklyInsightSchema.index({ userId: 1, year: 1, weekNumber: 1 }, { unique: true });
weeklyInsightSchema.index({ status: 1 });

// Method to calculate health score
weeklyInsightSchema.methods.calculateHealthScore = function() {
  // Medication score (40% weight)
  this.healthScore.medication = this.medicationAdherence.adherenceRate || 0;

  // Symptom score (30% weight)
  let symptomScore = 100;
  if (this.symptomTracking.activeSymptoms > 0) {
    const severityImpact = {
      'none': 0,
      'mild': 10,
      'moderate': 30,
      'severe': 50
    };
    symptomScore -= (this.symptomTracking.activeSymptoms * 5);
    symptomScore -= severityImpact[this.symptomTracking.averageSeverity] || 0;
  }
  this.healthScore.symptoms = Math.max(0, Math.min(100, symptomScore));

  // Activity score (30% weight) - based on engagement
  let activityScore = 50;
  if (this.symptomTracking.totalSymptoms > 0) activityScore += 20;
  if (this.medicationAdherence.totalDoses > 0) activityScore += 30;
  this.healthScore.activity = Math.min(100, activityScore);

  // Overall score (weighted average)
  this.healthScore.overall = Math.round(
    (this.healthScore.medication * 0.4) +
    (this.healthScore.symptoms * 0.3) +
    (this.healthScore.activity * 0.3)
  );
};

// Method to generate insights
weeklyInsightSchema.methods.generateInsights = function() {
  this.insights = [];

  // Medication insights
  if (this.medicationAdherence.adherenceRate >= 95) {
    this.insights.push({
      category: 'success',
      priority: 'high',
      title: 'Excellent Medication Adherence!',
      message: `You took ${this.medicationAdherence.adherenceRate}% of your medications this week. Keep up the great work!`,
      actionable: false
    });
  } else if (this.medicationAdherence.adherenceRate < 80) {
    this.insights.push({
      category: 'alert',
      priority: 'high',
      title: 'Medication Adherence Needs Attention',
      message: `You missed ${this.medicationAdherence.missedDoses} doses this week. Consistent medication is important for your health.`,
      actionable: true,
      action: 'Set up medication reminders'
    });
  }

  // Symptom insights
  if (this.symptomTracking.trend === 'improving') {
    this.insights.push({
      category: 'success',
      priority: 'medium',
      title: 'Symptoms Improving',
      message: 'Your symptoms are trending better this week. Your treatment plan is working!',
      actionable: false
    });
  } else if (this.symptomTracking.trend === 'worsening') {
    this.insights.push({
      category: 'alert',
      priority: 'high',
      title: 'Symptoms Worsening',
      message: `You reported ${this.symptomTracking.activeSymptoms} active symptoms. Consider consulting your healthcare provider.`,
      actionable: true,
      action: 'Schedule doctor appointment'
    });
  }

  // Streak milestone
  if (this.medicationAdherence.streak >= 7) {
    this.insights.push({
      category: 'success',
      priority: 'medium',
      title: `${this.medicationAdherence.streak}-Day Streak!`,
      message: 'Amazing consistency! You\'re building healthy habits.',
      actionable: false
    });
  }

  // Health score insights
  if (this.healthScore.overall >= 80) {
    this.insights.push({
      category: 'wellness',
      priority: 'low',
      title: 'Great Health Score',
      message: `Your overall health score is ${this.healthScore.overall}/100. You're doing well!`,
      actionable: false
    });
  } else if (this.healthScore.overall < 60) {
    this.insights.push({
      category: 'alert',
      priority: 'medium',
      title: 'Health Score Below Target',
      message: 'Focus on medication adherence and symptom management to improve your score.',
      actionable: true,
      action: 'Review health plan'
    });
  }

  // Pattern insights
  if (this.patterns.worstDayOfWeek) {
    this.insights.push({
      category: 'medication',
      priority: 'low',
      title: `${this.patterns.worstDayOfWeek} Needs Extra Attention`,
      message: `You tend to miss more doses on ${this.patterns.worstDayOfWeek}. Consider setting extra reminders.`,
      actionable: true,
      action: 'Add extra reminders'
    });
  }
};

// Method to check and award achievements
weeklyInsightSchema.methods.checkAchievements = function() {
  this.achievements = [];

  // Perfect week achievement
  if (this.medicationAdherence.adherenceRate === 100) {
    this.achievements.push({
      achievementType: 'perfect_week',
      title: 'Perfect Week',
      description: 'You took all your medications on time this week!',
      icon: 'trophy'
    });
  }

  // Symptom free achievement
  if (this.symptomTracking.activeSymptoms === 0 && this.symptomTracking.totalSymptoms > 0) {
    this.achievements.push({
      achievementType: 'symptom_free',
      title: 'Symptom Free',
      description: 'All your symptoms resolved this week!',
      icon: 'star'
    });
  }

  // Streak milestones
  if (this.medicationAdherence.streak === 7) {
    this.achievements.push({
      achievementType: 'streak_milestone',
      title: 'Week Warrior',
      description: '7 days of perfect adherence!',
      icon: 'fire'
    });
  } else if (this.medicationAdherence.streak === 30) {
    this.achievements.push({
      achievementType: 'streak_milestone',
      title: 'Month Master',
      description: '30 days of perfect adherence!',
      icon: 'crown'
    });
  }

  // Improvement achievement
  if (this.comparison.adherenceChange >= 20) {
    this.achievements.push({
      achievementType: 'improvement',
      title: 'Major Improvement',
      description: `Your adherence improved by ${this.comparison.adherenceChange}%!`,
      icon: 'trending-up'
    });
  }
};

const WeeklyInsight = mongoose.model("WeeklyInsight", weeklyInsightSchema);

export default WeeklyInsight;
