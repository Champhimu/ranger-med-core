// src/store/capsulesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/capsules";

const initialState = {
  capsules: [],
  recommendations: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCapsulesThunk = createAsyncThunk("capsules/fetch", async () => {
  const res = await api.fetchCapsules();
  return res.data;
});

export const addCapsuleThunk = createAsyncThunk("capsules/add", async (data) => {
  const res = await api.addCapsule(data);
  return res.data;
});

export const fetchRecommendationsThunk = createAsyncThunk("capsules/recommendations", async () => {
  const res = await api.getRecommendations();
  return res.data.recommendations;
});

export const fetchCapsuleHistoryThunk = createAsyncThunk(
  "capsules/history",
  async (capsuleId) => {
    const res = await api.getCapsuleHistory(capsuleId);
    return { capsuleId, history: res.data };
  }
);

const capsulesSlice = createSlice({
  name: "capsules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch capsules
      .addCase(fetchCapsulesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchCapsulesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.capsules = action.payload;
      })
      .addCase(fetchCapsulesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add capsule
      .addCase(addCapsuleThunk.pending, (state) => { state.loading = true; })
      .addCase(addCapsuleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.capsules.push(action.payload.capsule);
      })
      .addCase(addCapsuleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Recommendations
      .addCase(fetchRecommendationsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchRecommendationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Capsule history
      .addCase(fetchCapsuleHistoryThunk.fulfilled, (state, action) => {
        const { capsuleId, history } = action.payload;
        const capsule = state.capsules.find(c => c._id === capsuleId);
        if (capsule) capsule.history = history;
      });
  },
});

export default capsulesSlice.reducer;
