// src/store/symptomsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/symptoms";

const initialState = {
  symptoms: [],
  progress: {},
  loading: false,
  error: null,
};

// --- Thunks --- //

// Fetch all symptoms
export const fetchSymptomsThunk = createAsyncThunk(
  "symptoms",
  async () => {
    const res = await api.fetchSymptoms();
    return res.data;
  }
);

// Add new symptom
export const addSymptomThunk = createAsyncThunk(
  "symptoms/add",
  async (data) => {
    const res = await api.addSymptom(data);
    return res.data;
  }
);

// Update symptom
export const updateSymptomThunk = createAsyncThunk(
  "symptoms/update",
  async ({ id, updates }) => {
    const res = await api.updateSymptom(id, updates);
    return res.data;
  }
);

// Delete symptom
export const deleteSymptomThunk = createAsyncThunk(
  "symptoms/delete",
  async (id) => {
    await api.deleteSymptom(id);
    return id;
  }
);

// Progress chart data
export const fetchProgressThunk = createAsyncThunk(
  "symptoms/progress",
  async () => {
    const res = await api.fetchProgress();
    return res.data;
  }
);

// History records
export const fetchSymptomHistoryThunk = createAsyncThunk(
  "symptoms/history",
  async () => {
    const res = await api.fetchHistory();
    return res.data;
  }
);

// --- Slice --- //

const symptomsSlice = createSlice({
  name: "symptoms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchSymptomsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSymptomsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.symptoms = action.payload;
      })
      .addCase(fetchSymptomsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addSymptomThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSymptomThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.symptoms.unshift(action.payload);
      })
      .addCase(addSymptomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update
      .addCase(updateSymptomThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSymptomThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.symptoms.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.symptoms[index] = action.payload;
      })
      .addCase(updateSymptomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete
      .addCase(deleteSymptomThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSymptomThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.symptoms = state.symptoms.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSymptomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Progress
      .addCase(fetchProgressThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgressThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchProgressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // History
      .addCase(fetchSymptomHistoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSymptomHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchSymptomHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default symptomsSlice.reducer;
