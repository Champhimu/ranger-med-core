import mongoose from "mongoose";

const symptomAnalysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  
  // Input symptoms
  symptoms: [{
    name: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    duration: String,
    bodyPart: String
  }],
  
  // Additional context
  age: Number,
  gender: String,
  existingConditions: [String],
  medications: [String],
  allergies: [String],
  
  // AI Analysis Results
  analysis: {
    possibleConditions: [{
      name: String,
      probability: Number,
      description: String,
      severity: String
    }],
    
    urgencyLevel: { 
      type: String, 
      enum: ['routine', 'soon', 'urgent', 'emergency'],
      default: 'routine'
    },
    
    recommendations: [String],
    
    redFlags: [String],
    
    selfCareAdvice: [String],
    
    whenToSeekCare: String,
    
    estimatedRecovery: String,
    
    preventiveMeasures: [String]
  },
  
  // AI Model Info
  aiModel: {
    provider: { type: String, default: 'gemini' },
    modelVersion: String,
    confidence: Number,
    processingTime: Number
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'reviewed', 'archived'],
    default: 'pending'
  },
  
  // Follow-up
  followUpRequired: { type: Boolean, default: false },
  followUpDate: Date,
  doctorReview: {
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewDate: Date,
    notes: String
  }
  
}, { timestamps: true });

// Index for faster queries
symptomAnalysisSchema.index({ userId: 1, createdAt: -1 });
symptomAnalysisSchema.index({ status: 1 });
symptomAnalysisSchema.index({ 'analysis.urgencyLevel': 1 });

export default mongoose.model("SymptomAnalysis", symptomAnalysisSchema);
