// src/api/symptoms.js
import axios from "./axiosInstance";

// Fetch all symptoms
export const fetchSymptoms = () => axios.get("/symptoms");

// Add new symptom
export const addSymptom = (data) => axios.post("/symptoms/add", data);

// Update symptom
export const updateSymptom = (id, updates) => axios.put(`/symptoms/${id}`, updates);

// Delete symptom
export const deleteSymptom = (id) => axios.delete(`/symptoms/${id}`);

// Progress chart data
export const fetchProgress = () => axios.get(`/symptoms/progress`);

// Symptoms full history
export const fetchHistory = () => axios.get(`/symptoms/history`);
