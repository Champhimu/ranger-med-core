/**
 * Medical knowledge base for symptom analysis
 */
const MEDICAL_KNOWLEDGE_BASE = {
  // Common conditions with their typical symptoms
  conditions: {
    'Common Cold': {
      symptoms: ['runny nose', 'congestion', 'sneezing', 'sore throat', 'cough', 'mild headache', 'mild fever'],
      severity: 'mild',
      urgency: 'routine',
      recovery: '7-10 days'
    },
    'Influenza (Flu)': {
      symptoms: ['fever', 'chills', 'muscle aches', 'fatigue', 'headache', 'cough', 'sore throat'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '1-2 weeks'
    },
    'Migraine': {
      symptoms: ['severe headache', 'nausea', 'vomiting', 'light sensitivity', 'sound sensitivity'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '4-72 hours'
    },
    'Tension Headache': {
      symptoms: ['headache', 'neck pain', 'shoulder tension', 'mild headache'],
      severity: 'mild',
      urgency: 'routine',
      recovery: 'Few hours to days'
    },
    'Gastroenteritis': {
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'fatigue'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '1-3 days'
    },
    'Allergic Reaction': {
      symptoms: ['rash', 'itching', 'sneezing', 'runny nose', 'watery eyes', 'hives'],
      severity: 'mild',
      urgency: 'routine',
      recovery: 'Hours to days with treatment'
    },
    'Sinusitis': {
      symptoms: ['facial pain', 'headache', 'nasal congestion', 'thick nasal discharge', 'cough'],
      severity: 'moderate',
      urgency: 'routine',
      recovery: '7-10 days'
    },
    'Bronchitis': {
      symptoms: ['cough', 'chest congestion', 'fatigue', 'shortness of breath', 'mild fever'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '2-3 weeks'
    },
    'Urinary Tract Infection': {
      symptoms: ['frequent urination', 'burning urination', 'lower abdominal pain', 'cloudy urine', 'blood in urine'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '3-5 days with antibiotics'
    },
    'Food Poisoning': {
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal cramps', 'fever'],
      severity: 'moderate',
      urgency: 'soon',
      recovery: '1-3 days'
    }
  },

  // Emergency symptoms that require immediate attention
  emergencySymptoms: [
    'chest pain', 'difficulty breathing', 'severe bleeding', 'unconsciousness',
    'seizure', 'stroke symptoms', 'heart attack', 'severe allergic reaction',
    'suicidal thoughts', 'overdose', 'severe head injury', 'broken bone',
    'severe burn', 'choking', 'severe abdominal pain'
  ],

  // Urgent symptoms requiring prompt medical attention
  urgentSymptoms: [
    'high fever', 'severe pain', 'persistent vomiting', 'blood in stool',
    'blood in urine', 'severe headache', 'confusion', 'severe dizziness',
    'fainting', 'severe dehydration', 'severe rash'
  ]
};

/**
 * Analyze symptoms using rule-based medical logic
 * @param {Object} symptomData - User's symptom information
 * @returns {Object} Analysis results
 */
export const analyzeSymptoms = async (symptomData) => {
  try {
    const {
      symptoms,
      age,
      gender,
      existingConditions = [],
      medications = [],
      allergies = [],
    } = symptomData;

    const startTime = Date.now();

    // Normalize symptom names for matching
    const normalizedSymptoms = symptoms.map(s => ({
      ...s,
      normalizedName: s.name.toLowerCase().trim()
    }));

    // Check for emergency symptoms
    const hasEmergency = normalizedSymptoms.some(s => 
      MEDICAL_KNOWLEDGE_BASE.emergencySymptoms.some(emergency => 
        s.normalizedName.includes(emergency.toLowerCase())
      )
    );

    // Check for urgent symptoms
    const hasUrgent = normalizedSymptoms.some(s => 
      MEDICAL_KNOWLEDGE_BASE.urgentSymptoms.some(urgent => 
        s.normalizedName.includes(urgent.toLowerCase())
      )
    );

    // Check for severe symptoms
    const hasSevereSymptoms = symptoms.some(s => s.severity === 'severe');

    // Determine urgency level
    let urgencyLevel = 'routine';
    if (hasEmergency || hasSevereSymptoms) {
      urgencyLevel = 'emergency';
    } else if (hasUrgent) {
      urgencyLevel = 'urgent';
    } else if (symptoms.length >= 3 || symptoms.some(s => s.severity === 'moderate')) {
      urgencyLevel = 'soon';
    }

    // Match symptoms to possible conditions
    const possibleConditions = matchConditions(normalizedSymptoms);

    // Generate recommendations
    const recommendations = generateRecommendations(symptoms, urgencyLevel, age, existingConditions);

    // Identify red flags
    const redFlags = identifyRedFlags(normalizedSymptoms, hasSevereSymptoms, age);

    // Generate self-care advice
    const selfCareAdvice = generateSelfCare(normalizedSymptoms, urgencyLevel);

    // Determine when to seek care
    const whenToSeekCare = determineWhenToSeekCare(urgencyLevel, symptoms);

    // Get estimated recovery
    const estimatedRecovery = possibleConditions.length > 0 
      ? possibleConditions[0].recovery 
      : 'Varies by condition';

    // Generate preventive measures
    const preventiveMeasures = generatePreventiveMeasures(possibleConditions);

    const processingTime = Date.now() - startTime;

    const analysisData = {
      possibleConditions: possibleConditions.map(c => ({
        name: c.name,
        probability: c.probability,
        description: c.description,
        severity: c.severity
      })),
      urgencyLevel,
      recommendations,
      redFlags,
      selfCareAdvice,
      whenToSeekCare,
      estimatedRecovery,
      preventiveMeasures
    };

    return {
      analysis: analysisData,
      aiModel: {
        provider: 'rule-based',
        modelVersion: 'v1.0',
        confidence: calculateConfidence(analysisData),
        processingTime
      }
    };

  } catch (error) {
    console.error("Symptom Analysis Error:", error);
    
    // Return safe fallback response
    return {
      analysis: {
        possibleConditions: [{
          name: "Unable to Analyze",
          probability: 0,
          description: "Unable to complete analysis. Please consult a healthcare professional.",
          severity: "unknown"
        }],
        urgencyLevel: "soon",
        recommendations: [
          "Consult with a healthcare professional for proper evaluation",
          "Monitor your symptoms closely",
          "Seek immediate care if symptoms worsen"
        ],
        redFlags: [
          "Severe or worsening symptoms",
          "High fever (>103°F/39.4°C)",
          "Difficulty breathing",
          "Severe pain",
          "Signs of dehydration"
        ],
        selfCareAdvice: ["Rest adequately", "Stay hydrated", "Monitor symptoms"],
        whenToSeekCare: "If symptoms persist for more than 48 hours or worsen, seek medical attention",
        estimatedRecovery: "Varies by condition",
        preventiveMeasures: ["Maintain good hygiene", "Get adequate rest", "Eat a balanced diet"]
      },
      aiModel: {
        provider: 'rule-based',
        modelVersion: 'fallback',
        confidence: 0,
        processingTime: 0
      },
      error: error.message
    };
  }
};

/**
 * Match symptoms to possible conditions
 */
function matchConditions(normalizedSymptoms) {
  const matches = [];

  for (const [conditionName, conditionData] of Object.entries(MEDICAL_KNOWLEDGE_BASE.conditions)) {
    let matchCount = 0;
    const conditionSymptoms = conditionData.symptoms;

    // Count how many user symptoms match this condition
    normalizedSymptoms.forEach(userSymptom => {
      const hasMatch = conditionSymptoms.some(condSymptom => 
        userSymptom.normalizedName.includes(condSymptom.toLowerCase()) ||
        condSymptom.toLowerCase().includes(userSymptom.normalizedName)
      );
      if (hasMatch) matchCount++;
    });

    if (matchCount > 0) {
      const probability = Math.min(95, Math.round((matchCount / conditionSymptoms.length) * 100));
      matches.push({
        name: conditionName,
        probability,
        description: `Shows ${matchCount} matching symptom${matchCount > 1 ? 's' : ''}. ${getConditionDescription(conditionName)}`,
        severity: conditionData.severity,
        recovery: conditionData.recovery,
        urgency: conditionData.urgency
      });
    }
  }

  // Sort by probability
  matches.sort((a, b) => b.probability - a.probability);

  // Return top 4 matches
  return matches.slice(0, 4);
}

/**
 * Get condition description
 */
function getConditionDescription(conditionName) {
  const descriptions = {
    'Common Cold': 'A viral infection of the upper respiratory tract.',
    'Influenza (Flu)': 'A contagious respiratory illness caused by influenza viruses.',
    'Migraine': 'A neurological condition causing intense headaches.',
    'Tension Headache': 'The most common type of headache, often stress-related.',
    'Gastroenteritis': 'Inflammation of the stomach and intestines, often called stomach flu.',
    'Allergic Reaction': 'An immune system response to a foreign substance.',
    'Sinusitis': 'Inflammation or swelling of the tissue lining the sinuses.',
    'Bronchitis': 'Inflammation of the bronchial tubes in the lungs.',
    'Urinary Tract Infection': 'An infection in any part of the urinary system.',
    'Food Poisoning': 'Illness caused by eating contaminated food.'
  };
  return descriptions[conditionName] || 'Requires medical evaluation.';
}

/**
 * Generate recommendations based on symptoms and urgency
 */
function generateRecommendations(symptoms, urgencyLevel, age, existingConditions) {
  const recommendations = [];

  if (urgencyLevel === 'emergency') {
    recommendations.push('🚨 Seek emergency medical care immediately - call 911 or go to the nearest ER');
    recommendations.push('Do not drive yourself if symptoms are severe');
  } else if (urgencyLevel === 'urgent') {
    recommendations.push('Contact your healthcare provider today or visit urgent care');
    recommendations.push('Do not delay seeking medical attention');
  } else if (urgencyLevel === 'soon') {
    recommendations.push('Schedule an appointment with your healthcare provider within 1-2 days');
    recommendations.push('Monitor symptoms closely and seek immediate care if they worsen');
  } else {
    recommendations.push('Monitor symptoms for the next 24-48 hours');
    recommendations.push('Schedule a routine appointment if symptoms persist');
  }

  // Age-specific recommendations
  if (age && (age < 2 || age > 65)) {
    recommendations.push('Due to your age, consider seeking medical evaluation sooner');
  }

  // Existing conditions considerations
  if (existingConditions && existingConditions.length > 0) {
    recommendations.push('Consider your existing medical conditions - consult your doctor if uncertain');
  }

  return recommendations;
}

/**
 * Identify red flags that warrant immediate attention
 */
function identifyRedFlags(normalizedSymptoms, hasSevereSymptoms, age) {
  const redFlags = [];

  if (hasSevereSymptoms) {
    redFlags.push('Severe symptoms reported - requires medical evaluation');
  }

  // Check for specific red flag symptoms
  const criticalSymptoms = {
    'chest': 'Chest pain or pressure',
    'breath': 'Difficulty breathing or shortness of breath',
    'unconscious': 'Loss of consciousness or altered mental state',
    'seizure': 'Seizures or convulsions',
    'bleeding': 'Severe or uncontrolled bleeding',
    'fever': 'High fever (>103°F/39.4°C)',
    'confusion': 'Confusion or disorientation',
    'severe pain': 'Severe pain that doesn\'t improve'
  };

  normalizedSymptoms.forEach(symptom => {
    for (const [key, message] of Object.entries(criticalSymptoms)) {
      if (symptom.normalizedName.includes(key)) {
        if (!redFlags.includes(message)) {
          redFlags.push(message);
        }
      }
    }
  });

  if (age && age < 3) {
    redFlags.push('Infant/toddler - closer monitoring recommended');
  }

  return redFlags;
}

/**
 * Generate self-care advice
 */
function generateSelfCare(normalizedSymptoms, urgencyLevel) {
  if (urgencyLevel === 'emergency') {
    return ['Seek immediate medical care - do not attempt self-treatment'];
  }

  const advice = [
    'Get plenty of rest to help your body recover',
    'Stay well hydrated - drink water, clear broths, or electrolyte drinks',
    'Eat nutritious foods when appetite permits'
  ];

  // Symptom-specific advice
  const symptomAdvice = {
    'fever': 'Use over-the-counter fever reducers like acetaminophen or ibuprofen (follow package directions)',
    'cough': 'Use a humidifier and drink warm liquids to soothe throat',
    'congestion': 'Use saline nasal spray and breathe steam from hot shower',
    'headache': 'Rest in a quiet, dark room and apply cool compress',
    'nausea': 'Eat bland foods like crackers, toast, or rice',
    'sore throat': 'Gargle with warm salt water and use throat lozenges',
    'pain': 'Apply ice or heat as appropriate and consider OTC pain relievers'
  };

  normalizedSymptoms.forEach(symptom => {
    for (const [key, adviceText] of Object.entries(symptomAdvice)) {
      if (symptom.normalizedName.includes(key) && !advice.includes(adviceText)) {
        advice.push(adviceText);
      }
    }
  });

  return advice.slice(0, 6); // Limit to 6 pieces of advice
}

/**
 * Determine when to seek medical care
 */
function determineWhenToSeekCare(urgencyLevel, symptoms) {
  const timeframes = {
    'emergency': 'Immediately - call 911 or go to the nearest emergency room',
    'urgent': 'Within 24 hours - contact your doctor or visit urgent care today',
    'soon': 'Within 1-3 days - schedule an appointment with your healthcare provider',
    'routine': 'If symptoms persist beyond 7 days or worsen significantly'
  };

  let guidance = timeframes[urgencyLevel] || timeframes.routine;

  guidance += '. Also seek immediate care if you experience: severe pain, high fever, difficulty breathing, or any symptom that significantly worsens.';

  return guidance;
}

/**
 * Generate preventive measures
 */
function generatePreventiveMeasures(possibleConditions) {
  const measures = new Set([
    'Wash hands frequently with soap and water',
    'Get adequate sleep (7-9 hours per night)',
    'Maintain a balanced, nutritious diet',
    'Stay physically active with regular exercise',
    'Manage stress through relaxation techniques'
  ]);

  // Add condition-specific preventive measures
  possibleConditions.forEach(condition => {
    if (condition.name.includes('Cold') || condition.name.includes('Flu')) {
      measures.add('Consider annual flu vaccination');
      measures.add('Avoid close contact with sick individuals');
    }
    if (condition.name.includes('Allergy')) {
      measures.add('Identify and avoid allergen triggers');
      measures.add('Keep windows closed during high pollen days');
    }
    if (condition.name.includes('Gastro') || condition.name.includes('Food')) {
      measures.add('Practice proper food handling and storage');
      measures.add('Wash fruits and vegetables thoroughly');
    }
  });

  return Array.from(measures).slice(0, 6);
}

/**
 * Calculate confidence score based on analysis quality
 */
function calculateConfidence(analysis) {
  let confidence = 50; // Base confidence

  // Increase confidence if we have multiple conditions
  if (analysis.possibleConditions && analysis.possibleConditions.length >= 2) {
    confidence += 15;
  }

  // Increase if we have detailed recommendations
  if (analysis.recommendations && analysis.recommendations.length >= 3) {
    confidence += 15;
  }

  // Increase if we have red flags identified
  if (analysis.redFlags && analysis.redFlags.length > 0) {
    confidence += 10;
  }

  // Increase if we have self-care advice
  if (analysis.selfCareAdvice && analysis.selfCareAdvice.length > 0) {
    confidence += 10;
  }

  return Math.min(confidence, 95); // Cap at 95% (never 100% certain)
}

/**
 * Get follow-up questions based on symptoms
 */
export const getFollowUpQuestions = async (symptoms) => {
  try {
    const questions = [
      "Have you experienced these symptoms before?",
      "Are you currently taking any medications?",
      "Do you have any known allergies?",
      "Have you traveled recently or been exposed to anyone who is sick?",
      "Have your symptoms been getting better, worse, or staying the same?"
    ];

    // Add symptom-specific questions
    const symptomNames = symptoms.map(s => s.name.toLowerCase()).join(' ');

    if (symptomNames.includes('fever') || symptomNames.includes('temperature')) {
      questions.push("What is your current temperature?");
    }

    if (symptomNames.includes('pain')) {
      questions.push("On a scale of 1-10, how would you rate your pain?");
      questions.push("Does anything make the pain better or worse?");
    }

    if (symptomNames.includes('cough')) {
      questions.push("Is your cough producing mucus/phlegm?");
    }

    if (symptomNames.includes('rash') || symptomNames.includes('skin')) {
      questions.push("Has the rash spread to other areas?");
    }

    return questions.slice(0, 5); // Return up to 5 questions

  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [
      "Have you experienced these symptoms before?",
      "Are you taking any medications?",
      "Have you traveled recently?"
    ];
  }
};

export default { analyzeSymptoms, getFollowUpQuestions };
