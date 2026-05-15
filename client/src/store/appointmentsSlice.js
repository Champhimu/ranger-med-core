import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/appointments";

const initialState = {
  upcoming: [],
  past: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAppointmentsThunk = createAsyncThunk("appointments/fetch", async () => {
  const res = await api.fetchAppointments();
  return res.data;
});

export const addAppointmentThunk = createAsyncThunk("appointments/book", async (data) => {
  const res = await api.addAppointment(data);
  return res.data;
});

export const updateAppointmentThunk = createAsyncThunk(
  "appointments/update",
  async ({ id, data }) => {
    const res = await api.updateAppointment(id, data);
    return res.data;
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = action.payload.upcoming;
        state.past = action.payload.past;
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add appointment
      .addCase(addAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const appointment = action.payload;

        const today = new Date();
        if (new Date(appointment.date) >= today) {
          state.upcoming.push(appointment);
        } else {
          state.past.push(appointment);
        }
      })
      .addCase(addAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update appointment
      .addCase(updateAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const today = new Date();

        // Remove from current arrays if present
        state.upcoming = state.upcoming.filter(a => a._id !== updated._id);
        state.past = state.past.filter(a => a._id !== updated._id);

        // Push to the correct array based on date
        if (new Date(updated.date) >= today) {
          state.upcoming.push(updated);
        } else {
          state.past.push(updated);
        }
      })
      .addCase(updateAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default appointmentsSlice.reducer;
