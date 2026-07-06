import dotenv from "dotenv";
dotenv.config();

import { chat } from "./src/ai/services/ai.service.js";

async function runDemo() {
  console.log("=== ALPHA BOT DEMONSTRATION ===\n");

  // 1. Setup Mock User Context
  const userContext = {
    name: "Jason Lee Scott",
    capsules: [
      {
        name: "Power Surge Antibiotic",
        doseAmount: "500",
        doseUnit: "mg",
        frequency: "Twice daily",
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        reason: "Bacterial infection from the last battle",
      },
    ],
    symptoms: [
      {
        name: "Sore throat",
        severity: "moderate",
        date: new Date().toISOString(),
        notes: "Started feeling scratchy yesterday evening",
      },
    ],
    appointments: [
      {
        doctorName: "Dr. Cranston",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // in 3 days
        time: "10:00 AM",
        reason: "Follow-up checkup",
      },
    ],
  };

  console.log("-> MOCK USER DATA INJECTED:");
  console.log("Name:", userContext.name);
  console.log("Medication:", userContext.capsules[0].name);
  console.log("Symptom:", userContext.symptoms[0].name);
  console.log("Appointment:", userContext.appointments[0].doctorName, "\n");

  // 2. First question: Asking about symptoms
  const question1 = "Hey AlphaBot, my throat is still really sore. Should I be worried?";
  console.log(`[User]: ${question1}`);
  const response1 = await chat(question1, [], userContext);
  console.log(`\n[AlphaBot]: ${response1.reply}\n`);
  console.log("-".repeat(50) + "\n");

  // 3. Second question: Passing history to ask about medications
  const history = [
    { role: "user", text: question1 },
    { role: "bot", text: response1.reply }
  ];
  
  const question2 = "Oh also, I forgot why I'm taking this antibiotic and when my next doctor visit is. Can you remind me?";
  console.log(`[User]: ${question2}`);
  const response2 = await chat(question2, history, userContext);
  console.log(`\n[AlphaBot]: ${response2.reply}\n`);

  console.log("=== END OF DEMONSTRATION ===");
}

runDemo().catch(console.error);
