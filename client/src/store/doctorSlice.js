import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/doctor.js";

const initialState = {
  doctors: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDoctorsThunk = createAsyncThunk("doctors/fetch", async () => {
  const res = await api.fetchDoctors();
  return res.data;
});

export const addDoctorThunk = createAsyncThunk("doctors/add", async (data) => {
  const res = await api.addDoctor(data);
  return res.data;
});

export const updateDoctorThunk = createAsyncThunk("doctors/update", async ({id, data}) => {
  const res = await api.updateDoctor(id, data);
  return res.data;
});

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctorsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctorsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add doctor
      .addCase(addDoctorThunk.pending, (state) => { state.loading = true; })
      .addCase(addDoctorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload.doctor);
      })
      .addCase(addDoctorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update doctor
      .addCase(updateDoctorThunk.pending, (state) => { state.loading = true; })
      .addCase(updateDoctorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.map(doc => doc._id === action.payload._id ? action.payload : doc);
      })
      .addCase(updateDoctorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default doctorsSlice.reducer;
