import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config();
// Initialize the GoogleGenAI client. 
// Pass the key directly to the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the core JSON schema string for instruction clarity
const JSON_SCHEMA_INSTRUCTION = `
Return your analysis EXCLUSIVELY as a JSON object that adheres to the following structure:
{
  "severity": number (1-10, based on medical risk),
  "predictedCondition": string (a concise, likely medical condition),
  "urgencyLevel": number (0-10, 0 being no urgency, 10 being immediate emergency),
  "category": string (e.g., "Infectious", "Trauma", "Chronic", "Allergic"),
  "riskLevel": "low" | "medium" | "high",
  "isSerious": boolean (true if immediate medical attention is necessary),
  "explanation": string (a brief explanation for the assessment)
}
`;

/**
 * Analyzes a raw symptom description and returns a structured preview.
 * @param {string} text - The raw symptom description.
 */
export const aiSymptomPreview = async (text) => {
  const prompt = `
  Analyze this symptom description: "${text}"

  ${JSON_SCHEMA_INSTRUCTION}
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        // Set temperature low to encourage structured output
        temperature: 0.2, 
      }
    });

    // The output is a string, so we need to parse it as JSON
    let jsonString = result.text.trim();

    if (jsonString.startsWith('```json')) {
      // Remove '```json' from the start
      jsonString = jsonString.substring(7); 
    }
    if (jsonString.endsWith('```')) {
      // Remove '```' from the end and trim any extra whitespace/newlines
      jsonString = jsonString.substring(0, jsonString.length - 3).trim(); 
    }

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error in aiSymptomPreview:", error);
    throw new Error("Failed to analyze symptom using Gemini API.");
  }
};


/**
 * Analyzes a symptom with optional user-provided severity input.
 * @param {string} text - The raw symptom description.
 * @param {number | null} severity - User's self-reported severity (1-10).
 */
export const analyzeSymptomAI = async (text, severity = null) => {
  const userSeverity = severity !== null ? `User severity input: ${severity}` : "User severity input: none";
  
  const prompt = `
  Analyze this symptom description: "${text}"
  ${userSeverity}

  Incorporate the user's self-reported severity into your analysis if provided, but prioritize medical knowledge.
  
  ${JSON_SCHEMA_INSTRUCTION}
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });
    
    // The output is a string, so we need to parse it as JSON
    let jsonString = result.text.trim();

    if (jsonString.startsWith('```json')) {
      // Remove '```json' from the start
      jsonString = jsonString.substring(7); 
    }
    if (jsonString.endsWith('```')) {
      // Remove '```' from the end and trim any extra whitespace/newlines
      jsonString = jsonString.substring(0, jsonString.length - 3).trim(); 
    }

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error in analyzeSymptomAI:", error);
    throw new Error("Failed to analyze symptom using Gemini API.");
  }
};