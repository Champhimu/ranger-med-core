import { chat } from "../ai/services/ai.service.js";
import Capsule from "../models/Capsule.js";
import Symptom from "../models/Symptom.js";
import Appointment from "../models/Appointment.js";

/**
 * POST /api/ai/chat
 *
 * Body: { message: string, history: [{role, text}] }
 * Returns: { reply, metadata }
 *
 * Fetches the authenticated user's capsules, symptoms and appointments
 * from MongoDB, injects them as context into the Gemini system prompt,
 * then streams back the AI reply.
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const userId = req.user.id;

    // Pull live user data for context injection
    const [capsules, symptoms, appointments] = await Promise.all([
      Capsule.find({ userId }).lean(),
      Symptom.find({ userId }).sort({ date: -1 }).limit(15).lean(),
      Appointment.find({ userId, date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(5)
        .lean(),
    ]);

    const userContext = {
      name: req.user.name || "Ranger",
      capsules,
      symptoms,
      appointments,
    };

    const result = await chat(message.trim(), history, userContext);

    res.json({
      reply: result.reply,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    // Surface a user-friendly message while logging the real error
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      error: "Failed to get AI response. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
