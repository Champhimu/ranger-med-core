/**
 * Weekly Insights - AI-Generated Health Summary
 * Provides weekly health trends, risk analysis, and personalized recommendations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeeklyInsights.css';

function WeeklyInsights({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  
  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    pink: '#FF69B4',
    black: '#ffffff',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  const [selectedWeek, setSelectedWeek] = useState('current');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock AI-generated insights - In real app, this would come from backend AI service
  const [insights] = useState({
    current: {
      week: 'December 1-7, 2025',
      overallScore: 85,
      trend: 'improving', // improving, declining, stable
      summary: "Your health metrics show significant improvement this week. Medication adherence has been excellent at 95%, and your symptom severity has decreased by 30% compared to last week.",
      
      highlights: [
        {
          icon: '🎯',
          title: 'Excellent Medication Adherence',
          description: '95% adherence rate - only 1 missed dose this week',
          type: 'positive'
        },
        {
          icon: '📉',
          title: 'Symptom Improvement',
          description: 'Headache frequency decreased from 5 to 2 occurrences',
          type: 'positive'
        },
        {
          icon: '⚠️',
          title: 'Late Evening Doses',
          description: '3 medications taken 2+ hours late during evening',
          type: 'warning'
        },
        {
          icon: '💪',
          title: 'Physical Therapy Impact',
          description: 'Muscle soreness reduced after therapy session',
          type: 'positive'
        }
      ],

      metrics: {
        medicationAdherence: {
          current: 95,
          previous: 88,
          change: +7,
          details: '19/20 doses taken on time'
        },
        symptomSeverity: {
          current: 4.2,
          previous: 6.1,
          change: -31,
          details: 'Average severity decreased'
        },
        appointmentAttendance: {
          current: 100,
          previous: 100,
          change: 0,
          details: '2/2 appointments attended'
        },
        sleepQuality: {
          current: 7.5,
          previous: 6.8,
          change: +10,
          details: 'Based on symptom patterns'
        }
      },

      predictions: [
        {
          type: 'risk',
          title: 'Potential Medication Miss',
          probability: 35,
          description: 'Higher risk of missing evening Morphinium-12 dose on weekends',
          recommendation: 'Set additional reminder for Saturday/Sunday 8 PM'
        },
        {
          type: 'improvement',
          title: 'Continued Symptom Reduction',
          probability: 78,
          description: 'Based on current trends, headaches likely to reduce further',
          recommendation: 'Continue current treatment plan'
        }
      ],

      recommendations: [
        {
          priority: 'high',
          icon: '⏰',
          title: 'Optimize Evening Reminder Time',
          description: 'Consider moving evening medication reminder from 8 PM to 7:30 PM to reduce late doses'
        },
        {
          priority: 'medium',
          icon: '📅',
          title: 'Schedule Follow-up',
          description: 'Book follow-up appointment with Dr. Hartford to discuss symptom improvements'
        },
        {
          priority: 'low',
          icon: '💧',
          title: 'Increase Hydration',
          description: 'Headache patterns suggest possible dehydration - aim for 8 glasses daily'
        }
      ],

      aiConfidence: 92
    },
    
    previous: {
      week: 'November 24-30, 2025',
      overallScore: 78,
      trend: 'stable',
      summary: "Moderate health week with consistent medication adherence but elevated symptom reports. Stress from mission activities may be contributing to fatigue.",
      highlights: [
        {
          icon: '💊',
          title: 'Good Medication Consistency',
          description: '88% adherence rate maintained',
          type: 'positive'
        },
        {
          icon: '😴',
          title: 'Increased Fatigue Reports',
          description: '5 fatigue symptoms logged this week',
          type: 'warning'
        },
        {
          icon: '🏥',
          title: 'All Appointments Attended',
          description: 'Physical therapy and check-up completed',
          type: 'positive'
        }
      ],
      metrics: {
        medicationAdherence: { current: 88, previous: 85, change: +3 },
        symptomSeverity: { current: 6.1, previous: 5.8, change: +5 },
        appointmentAttendance: { current: 100, previous: 100, change: 0 },
        sleepQuality: { current: 6.8, previous: 7.2, change: -6 }
      },
      aiConfidence: 89
    }
  });

  const currentInsight = insights[selectedWeek];

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return '#32cd32';
    if (trend === 'declining') return '#ff4500';
    return '#ffa500';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#32cd32';
    if (score >= 60) return '#ffa500';
    return '#ff4500';
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Weekly report generated and sent to your email! 📧');
    }, 2000);
  };

  return (
    <div className="insights-page" data-ranger={selectedRanger}>
      {/* Background */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="insights-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← DASHBOARD
        </button>
        <div className="header-content">
          <h1>🤖 WEEKLY AI INSIGHTS</h1>
          <p>ZORDON MEDICAL AI - HEALTH ANALYSIS SYSTEM</p>
        </div>
        <button 
          className="generate-btn"
          onClick={handleGenerateReport}
          disabled={isGenerating}
          style={{ borderColor: currentColor, color: currentColor }}
        >
          {isGenerating ? '⏳ Generating...' : '📧 Email Report'}
        </button>
      </div>

      <div className="insights-container">
        {/* Week Selector */}
        <div className="week-selector">
          <button
            className={selectedWeek === 'current' ? 'active' : ''}
            onClick={() => setSelectedWeek('current')}
            style={selectedWeek === 'current' ? { borderColor: currentColor, color: currentColor } : {}}
          >
            Current Week
          </button>
          <button
            className={selectedWeek === 'previous' ? 'active' : ''}
            onClick={() => setSelectedWeek('previous')}
            style={selectedWeek === 'previous' ? { borderColor: currentColor, color: currentColor } : {}}
          >
            Previous Week
          </button>
        </div>

        {/* Summary Card */}
        <div className="summary-card">
          <div className="summary-header">
            <div>
              <h2>{currentInsight.week}</h2>
              <p className="ai-badge">
                🤖 AI Confidence: {currentInsight.aiConfidence}%
              </p>
            </div>
            <div className="score-circle">
              <svg width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getScoreColor(currentInsight.overallScore)}
                  strokeWidth="10"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * currentInsight.overallScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ filter: `drop-shadow(0 0 10px ${getScoreColor(currentInsight.overallScore)})` }}
                />
              </svg>
              <div className="score-text">
                <span className="score-value">{currentInsight.overallScore}</span>
                <span className="score-label">Health Score</span>
              </div>
            </div>
          </div>
          
          <div className="trend-indicator" style={{ borderColor: getTrendColor(currentInsight.trend) }}>
            <span className="trend-icon">{getTrendIcon(currentInsight.trend)}</span>
            <span style={{ color: getTrendColor(currentInsight.trend) }}>
              {currentInsight.trend.charAt(0).toUpperCase() + currentInsight.trend.slice(1)}
            </span>
          </div>

          <p className="summary-text">{currentInsight.summary}</p>
        </div>

        {/* Main Content Grid */}
        <div className="insights-grid">
          {/* Highlights */}
          <div className="insights-section highlights-section">
            <h3>✨ Week Highlights</h3>
            <div className="highlights-list">
              {currentInsight.highlights.map((highlight, index) => (
                <div key={index} className={`highlight-card ${highlight.type}`}>
                  <div className="highlight-icon">{highlight.icon}</div>
                  <div className="highlight-content">
                    <h4>{highlight.title}</h4>
                    <p>{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="insights-section metrics-section">
            <h3>📊 Key Metrics</h3>
            <div className="metrics-grid">
              {Object.entries(currentInsight.metrics).map(([key, metric]) => (
                <div key={key} className="metric-card">
                  <div className="metric-label">
                    {key.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                  </div>
                  <div className="metric-value">
                    {metric.current}
                    {key.includes('adherence') || key.includes('Attendance') ? '%' : ''}
                  </div>
                  <div className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                    {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '→'} 
                    {Math.abs(metric.change)}%
                  </div>
                  <div className="metric-details">{metric.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictions (only for current week) */}
          {selectedWeek === 'current' && currentInsight.predictions && (
            <div className="insights-section predictions-section">
              <h3>🔮 AI Predictions</h3>
              {currentInsight.predictions.map((pred, index) => (
                <div key={index} className="prediction-card">
                  <div className="prediction-header">
                    <h4>{pred.title}</h4>
                    <div className="probability-badge">
                      {pred.probability}% probability
                    </div>
                  </div>
                  <p className="prediction-desc">{pred.description}</p>
                  <div className="prediction-recommendation">
                    💡 {pred.recommendation}
                  </div>
                  <div className="probability-bar">
                    <div 
                      className="probability-fill"
                      style={{ 
                        width: `${pred.probability}%`,
                        backgroundColor: pred.type === 'risk' ? '#ff4500' : '#32cd32'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {selectedWeek === 'current' && currentInsight.recommendations && (
            <div className="insights-section recommendations-section">
              <h3>💡 AI Recommendations</h3>
              {currentInsight.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="rec-priority-badge">{rec.priority.toUpperCase()}</div>
                  <div className="rec-icon">{rec.icon}</div>
                  <div className="rec-content">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeeklyInsights;
