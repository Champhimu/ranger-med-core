import axios from "./axiosInstance";

// Fetch all appointments
export const fetchAppointments = () => axios.get("/appointments");

// Add a new appointment
export const addAppointment = (data) => axios.post("/appointments/book", data);

// Update appointment
export const updateAppointment = (id, data) => axios.patch(`/appointments/${id}/status`, data);
