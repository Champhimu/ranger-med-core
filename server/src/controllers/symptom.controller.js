import Symptom from "../models/Symptom.js";
import { aiSymptomPreview } from "../utils/aiSymptomPreview.js";
import { analyzeSymptomAI } from "../utils/aiSymptomPreview.js";

// POST /api/symptoms/ai-preview
export const previewSymptomAI = async (req, res) => {
  try {
    const { symptom } = req.body;

    if (!symptom) {
      return res.status(400).json({ error: "Symptom text is required" });
    }

    const analysis = await aiSymptomPreview(symptom);

    res.json({
      message: "AI Symptom Preview Generated",
      analysis
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/symptoms/add
export const addSymptom = async (req, res) => {
  try {
    const { symptom, severity, notes } = req.body;
    const userId = req.user.id;

    const aiData = await analyzeSymptomAI(symptom, severity);

    const now = new Date();

    const entry = await Symptom.create({
      userId,
      symptom,
      severity: aiData.severity,
      predictedCondition: aiData.predictedCondition,
      urgencyLevel: aiData.urgencyLevel,
      riskLevel: aiData.riskLevel,
      category: aiData.category,
      isSerious: aiData.isSerious,
      explanation: aiData.explanation,
      notes,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5)
    });

    res.json({
      message: "Symptom logged successfully",
      entry,
      analysis: aiData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/symptoms/history
export const getSymptoms = async (req, res) => {
  const userId = req.user.id;

  const list = await Symptom.find({ userId }).sort({ date: -1 });

  res.json(list);
};
