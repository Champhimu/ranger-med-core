import SymptomAnalysis from "../models/SymptomAnalysis.js";
import { analyzeSymptoms, getFollowUpQuestions } from "../services/symptomAnalysis.service.js";

/**
 * Analyze symptoms using AI and store results
 * POST /api/symptom-analysis/analyze
 */
export const analyzeUserSymptoms = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const {
      symptoms,
      age,
      gender,
      existingConditions,
      medications,
      allergies
    } = req.body;

    // Validation
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one symptom"
      });
    }

    // Validate symptom structure
    const validSymptoms = symptoms.every(s => 
      s.name && s.severity && s.duration
    );
    
    if (!validSymptoms) {
      return res.status(400).json({
        message: "Each symptom must have name, severity, and duration"
      });
    }

    // Create pending analysis record
    const pendingAnalysis = new SymptomAnalysis({
      userId,
      symptoms: symptoms.map(s => ({
        name: s.name,
        severity: s.severity,
        duration: s.duration,
        bodyPart: s.bodyPart || "General"
      })),
      age: age || null,
      gender: gender || null,
      existingConditions: existingConditions || [],
      medications: medications || [],
      allergies: allergies || [],
      status: "pending"
    });

    await pendingAnalysis.save();

    // Call AI service for analysis
    const aiResult = await analyzeSymptoms({
      symptoms: pendingAnalysis.symptoms,
      age,
      gender,
      existingConditions,
      medications,
      allergies
    });

    // Update analysis with AI results
    pendingAnalysis.analysis = aiResult.analysis;
    pendingAnalysis.aiModel = aiResult.aiModel;
    pendingAnalysis.status = "analyzed";

    // Determine if follow-up is required
    const isUrgent = ['urgent', 'emergency'].includes(aiResult.analysis.urgencyLevel);
    const hasRedFlags = aiResult.analysis.redFlags && aiResult.analysis.redFlags.length > 0;
    
    pendingAnalysis.followUpRequired = isUrgent || hasRedFlags;
    
    if (pendingAnalysis.followUpRequired) {
      // Suggest follow-up date based on urgency
      const followUpDays = aiResult.analysis.urgencyLevel === 'emergency' ? 0 :
                          aiResult.analysis.urgencyLevel === 'urgent' ? 1 :
                          aiResult.analysis.urgencyLevel === 'soon' ? 3 : 7;
      
      pendingAnalysis.followUpDate = new Date(Date.now() + followUpDays * 24 * 60 * 60 * 1000);
    }

    await pendingAnalysis.save();

    return res.status(201).json({
      message: "Symptom analysis completed",
      analysisId: pendingAnalysis._id,
      analysis: pendingAnalysis.analysis,
      urgencyLevel: pendingAnalysis.analysis.urgencyLevel,
      followUpRequired: pendingAnalysis.followUpRequired,
      followUpDate: pendingAnalysis.followUpDate,
      disclaimer: "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation."
    });

  } catch (error) {
    console.error("Error in analyzeUserSymptoms:", error);
    return res.status(500).json({
      message: "Failed to analyze symptoms",
      error: error.message
    });
  }
};

/**
 * Get user's symptom analysis history
 * GET /api/symptom-analysis/history
 */
export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const analyses = await SymptomAnalysis.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-aiModel.processingTime') // Exclude internal metrics
      .lean();

    const total = await SymptomAnalysis.countDocuments(query);

    return res.status(200).json({
      analyses,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAnalyses: total
    });

  } catch (error) {
    console.error("Error in getAnalysisHistory:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis history",
      error: error.message
    });
  }
};

/**
 * Get specific symptom analysis by ID
 * GET /api/symptom-analysis/:id
 */
export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const analysis = await SymptomAnalysis.findOne({
      _id: id,
      userId: userId
    })
    .populate('doctorReview.reviewedBy', 'name email')
    .lean();

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found"
      });
    }

    return res.status(200).json({
      analysis
    });

  } catch (error) {
    console.error("Error in getAnalysisById:", error);
    return res.status(500).json({
      message: "Failed to fetch analysis",
      error: error.message
    });
  }
};

/**
 * Update analysis status
 * PATCH /api/symptom-analysis/:id/status
 */
export const updateAnalysisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { status } = req.body;

    const validStatuses = ['pending', 'analyzed', 'reviewed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", ")
      });
    }

    const analysis = await SymptomAnalysis.findOneAndUpdate(
      { _id: id, userId: userId },
      { status },
      { new: true }
    );

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found"
      });
    }

    return res.status(200).json({
      message: "Analysis status updated",
      analysis
    });

  } catch (error) {
    console.error("Error in updateAnalysisStatus:", error);
    return res.status(500).json({
      message: "Failed to update analysis status",
      error: error.message
    });
  }
};

/**
 * Doctor review of symptom analysis
 * PATCH /api/symptom-analysis/:id/review
 */
export const addDoctorReview = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.userId;
    const { notes } = req.body;

    // Verify user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        message: "Only doctors can review analyses"
      });
    }

    const analysis = await SymptomAnalysis.findByIdAndUpdate(
      id,
      {
        status: 'reviewed',
        'doctorReview.reviewed': true,
        'doctorReview.reviewedBy': doctorId,
        'doctorReview.reviewDate': new Date(),
        'doctorReview.notes': notes
      },
      { new: true }
    ).populate('doctorReview.reviewedBy', 'name email');

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found"
      });
    }

    return res.status(200).json({
      message: "Review added successfully",
      analysis
    });

  } catch (error) {
    console.error("Error in addDoctorReview:", error);
    return res.status(500).json({
      message: "Failed to add doctor review",
      error: error.message
    });
  }
};

/**
 * Get follow-up questions for symptoms
 * POST /api/symptom-analysis/follow-up-questions
 */
export const getSymptomFollowUp = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        message: "Please provide symptoms"
      });
    }

    const questions = await getFollowUpQuestions(symptoms);

    return res.status(200).json({
      questions
    });

  } catch (error) {
    console.error("Error in getSymptomFollowUp:", error);
    return res.status(500).json({
      message: "Failed to generate follow-up questions",
      error: error.message
    });
  }
};

/**
 * Get urgent cases for doctors
 * GET /api/symptom-analysis/urgent
 */
export const getUrgentCases = async (req, res) => {
  try {
    // Only doctors can access this
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        message: "Only doctors can view urgent cases"
      });
    }

    const urgentAnalyses = await SymptomAnalysis.find({
      'analysis.urgencyLevel': { $in: ['urgent', 'emergency'] },
      status: { $in: ['analyzed', 'pending'] }
    })
    .populate('userId', 'name email age gender')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    return res.status(200).json({
      urgentCases: urgentAnalyses,
      count: urgentAnalyses.length
    });

  } catch (error) {
    console.error("Error in getUrgentCases:", error);
    return res.status(500).json({
      message: "Failed to fetch urgent cases",
      error: error.message
    });
  }
};

export default {
  analyzeUserSymptoms,
  getAnalysisHistory,
  getAnalysisById,
  updateAnalysisStatus,
  addDoctorReview,
  getSymptomFollowUp,
  getUrgentCases
};
