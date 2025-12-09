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
  return res.data;
});

export const fetchCapsuleHistoryThunk = createAsyncThunk(
  "capsules/history",
  async () => {
    const res = await api.getCapsuleHistory();
    console.log("Hist Res", res);
    return res.data;
  }
);

export const markDoseTakenThunk = createAsyncThunk(
  "capsules/markDoseTaken",
  async (doseId, { dispatch }) => {
    await api.markDoseTaken(doseId);

    // refresh capsules after update
    dispatch(fetchCapsulesThunk());

    return true;
  }
);

export const fetchmedicationPatterns = createAsyncThunk(
  "capsules/pattern",
  async () => {
    const res = await api.getMedicationPatterns();
    return res.data
  }
)

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
        state.history = action.payload
      })
      // Pattern
      .addCase(fetchmedicationPatterns.pending, (state) => { state.loading = true; })
    .addCase(fetchmedicationPatterns.fulfilled, (state, action) => {
      state.loading = false;
      state.pattern = action.payload; // <- store patterns here
    })
    .addCase(fetchmedicationPatterns.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default capsulesSlice.reducer;
