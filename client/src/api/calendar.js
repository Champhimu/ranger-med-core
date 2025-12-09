import axios from "./axiosInstance";

// Fetch all records for calendar
export const fetchCalendarRecords = (date) => axios.get(`/calendar?date=${date}`);

