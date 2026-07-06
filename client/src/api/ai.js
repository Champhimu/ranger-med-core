// src/api/ai.js
import axios from "./axiosInstance";

/**
 * Send a chat message to the AI backend.
 * @param {string} message  - The user's message
 * @param {Array}  history  - Previous conversation turns [{role, text}]
 * @returns {Promise<{reply: string, metadata: object}>}
 */
export const sendMessage = (message, history = []) =>
  axios.post("/ai/chat", { message, history });
