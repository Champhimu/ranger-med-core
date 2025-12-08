import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTimelines } from '../api/timeline';

// Fetch timeline data from backend
export const fetchTimeline = createAsyncThunk(
  'timeline/fetchTimeline',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTimelines(); // backend endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    events: [],       // unified timeline array
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        state.loading = false;

        const { appointments, doses, symptoms } = action.payload;

        // Map each type to unified event format
        const unifiedEvents = [];

        // Appointments
        appointments.forEach(app => {
          unifiedEvents.push({
            id: app._id,
            type: 'appointment',
            date: app.date,
            time: app.time || '00:00',
            title: app.doctor.name ? `Appointment with ${app.doctor.name}` : 'Appointment',
            description: app.reason || '',
            status: app.status || 'upcoming',
            icon: '👨‍⚕️'
          });
        });

        // Doses
        doses.forEach(dose => {
          unifiedEvents.push({
            id: dose._id,
            type: 'medication',
            date: dose.date,
            time: dose.time,
            title: dose.capsule?.name || 'Medication',
            description: `${dose.capsule?.doseAmount || ''} ${dose.capsule?.doseUnit || ''} - ${dose.capsule?.frequency || ''}`,
            status: dose.status, // taken or missed
            icon: `${dose.status === "taken" ? '💊' : '⚠️'}`
          });
        });

        // Symptoms
        symptoms.forEach(sym => {
          unifiedEvents.push({
            id: sym._id,
            type: 'symptom',
            date: sym.date,
            time: sym.time || '00:00',
            title: sym.symptomName || 'Symptom',
            description: sym.description || '',
            status: 'logged',
            icon: '🤕'
          });
        });

        // Sort all events by date + time (newest first)
        unifiedEvents.sort((a, b) => {
          const dtA = new Date(`${a.date} ${a.time}`);
          const dtB = new Date(`${b.date} ${b.time}`);
          return dtB - dtA;
        });

        state.events = unifiedEvents;
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch timeline';
      });
  }
});

export default timelineSlice.reducer;
