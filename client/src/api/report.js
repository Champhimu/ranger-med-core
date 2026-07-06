import axios from "./axiosInstance";

// Generate and download medical report PDF
export const generateReport = () =>
  axios.get("/report/generate", { responseType: "blob" });
