import axios from "./axiosInstance";

// Fetch all doctors
export const fetchDoctors = () => axios.get("/doctors");

// Add a new doctor
export const addDoctor = (data) => axios.post("/doctors/add", data);

// Update doctor
export const updateDoctor = (id, data) => axios.put(`/doctors/${id}`, data);
