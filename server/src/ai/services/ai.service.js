import OpenAI from "openai";

function getClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set in environment");
  console.log(`[AI] Using Groq key: ${key.slice(0, 10)}...`);
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

function buildSystemInstruction(userContext = {}) {
  const { name, capsules, symptoms, appointments } = userContext;

  let ctx = "";

  if (name) {
    ctx += `\nThe user's name is ${name}.`;
  }

  if (capsules && capsules.length > 0) {
    ctx += `\n\n--- CURRENT MEDICATIONS ---`;
    capsules.forEach((c) => {
      ctx += `\n- ${c.name}: ${c.doseAmount} ${c.doseUnit || ""}, ${
        c.frequency || ""
      } (${c.startDate ? new Date(c.startDate).toLocaleDateString() : "?"} to ${
        c.endDate ? new Date(c.endDate).toLocaleDateString() : "ongoing"
      })${c.reason ? ", reason: " + c.reason : ""}`;
    });
  }

  if (symptoms && symptoms.length > 0) {
    ctx += `\n\n--- RECENT SYMPTOMS ---`;
    symptoms.forEach((s) => {
      ctx += `\n- ${s.name} (severity: ${s.severity || "?"}, date: ${
        s.date ? new Date(s.date).toLocaleDateString() : "?"
      })${s.notes ? " — " + s.notes : ""}`;
    });
  }

  if (appointments && appointments.length > 0) {
    ctx += `\n\n--- UPCOMING APPOINTMENTS ---`;
    appointments.forEach((a) => {
      ctx += `\n- ${a.doctorName || "Doctor"} on ${
        a.date ? new Date(a.date).toLocaleDateString() : "?"
      } at ${a.time || "?"}${a.reason ? ", reason: " + a.reason : ""}`;
    });
  }

  return `You are AlphaBot, an advanced AI health assistant within the Ranger Med-Core system.
Your role is to help Rangers manage their health — answering questions about medications,
interpreting symptoms, offering wellness guidance, and helping schedule appointments.

RULES:
1. Be concise. Use short paragraphs and bullet points.
2. Always include a brief medical disclaimer when giving health advice:
   remind the user you are an AI and they should consult a healthcare professional for
   serious concerns.
3. If the user describes emergency symptoms (chest pain, difficulty breathing,
   severe bleeding, loss of consciousness, seizures), respond URGENTLY — tell them
   to call emergency services immediately. Do NOT attempt to diagnose.
4. You may reference the user's data (medications, symptoms, appointments) listed below
   to give personalised answers. If data is missing, ask the user.
5. Be warm, professional, and supportive. You can use the Ranger theme lightly
   (e.g. "Stay strong, Ranger") but keep it subtle.
6. Format your responses using markdown — use **bold**, bullet points, numbered lists
   when helpful. Keep responses under 300 words unless the user asks for detail.
7. Never fabricate medical data. If you don't know something, say so.
${ctx}
`;
}

/**
 * Send a message to Groq (via OpenAI SDK) and get a response.
 *
 * @param {string}   message      - The latest user message
 * @param {Array}    history      - Previous conversation turns [{role, text}]
 * @param {Object}   userContext  - Live user data for personalisation
 * @returns {Object}              - { reply, metadata }
 */
export const chat = async (message, history = [], userContext = {}) => {
  const startTime = Date.now();

  const systemInstruction = buildSystemInstruction(userContext);

  const messages = [
    { role: "system", content: systemInstruction },
    ...history.map((h) => ({
      role: h.role === "bot" ? "assistant" : "user",
      content: h.text,
    })),
    { role: "user", content: message }
  ];

  const response = await getClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
  });

  const reply = response.choices[0].message.content;
  const processingTime = Date.now() - startTime;

  return {
    reply,
    metadata: {
      model: response.model,
      processingTime,
      tokensUsed: response.usage?.total_tokens || null,
    },
  };
};
