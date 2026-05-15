import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCalendarRecords } from "../api/calendar";

export const fetchCalendarByDate = createAsyncThunk(
  "calendar/fetchByDate",
  async (date) => {
    const res = await fetchCalendarRecords(date);
    return res.data;
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCalendarByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCalendarByDate.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch";
      });
  }
});

export default calendarSlice.reducer;
