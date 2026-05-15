import axios from "./axiosInstance";

// Fetch all data for timelines
export const fetchTimelines = () => axios.get("/calendar/timeline");

