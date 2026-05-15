import Symptom from "../models/Symptom.js";

export const createSymptom = async (req, res) => {
  try {
    const symptomData = {
      ...req.body,
      userId: req.user.id,
    };

    const symptom = await Symptom.create(symptomData);
    res.status(201).json(symptom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET — All symptoms
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET — Single symptom
export const getSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    res.json(symptom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT — Update status or fields
export const updateSymptom = async (req, res) => {
  try {
    const updated = await Symptom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE — Remove symptom
export const deleteSymptom = async (req, res) => {
  try {
    await Symptom.findByIdAndDelete(req.params.id);
    res.json({ message: "Symptom deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET — Progress
export const getProgress = async (req, res) => {
  try {
    const symptoms = await Symptom.find();

    const grouped = {};
    symptoms.forEach(sym => {
      if (!grouped[sym.symptomName]) {
        grouped[sym.symptomName] = [];
      }
      grouped[sym.symptomName].push({
        date: sym.date,
        severity: sym.severity
      });
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};