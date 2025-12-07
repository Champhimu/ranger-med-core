// src/api/capsules.js
import axios from "./axiosInstance";

// Fetch all capsules
export const fetchCapsules = () => axios.get("/capsules");

// Add a new capsule
export const addCapsule = (data) => axios.post("/capsules/add", data);

// Mark dose actions
export const markDoseTaken = (doseId) => axios.patch(`/capsules/dose/${doseId}/taken`);
export const markDoseMissed = (doseId) => axios.patch(`/capsules/dose/${doseId}/missed`);
export const snoozeDose = (doseId, snoozeTime) => axios.patch(`/capsules/dose/${doseId}/snooze`, { snoozeTime });

// Get capsule history
export const getCapsuleHistory = () => axios.get(`/capsules/history`);

// Get AI recommendations (from backend)
export const getRecommendations = () => axios.get("/capsules/recommendations");

// Get medication pattern
export const getMedicationPatterns = () => axios.get("/capsules/pattern");