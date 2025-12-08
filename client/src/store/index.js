// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import capsulesReducer from './capsulesSlice';
import symptomReducer from './symptomSlice';
import doctorsReducer from './doctorSlice';
import appointmentsReducer from './appointmentsSlice';

export const store = configureStore({
  reducer: {
    capsules: capsulesReducer,
    symptoms: symptomReducer,
    doctor: doctorsReducer,
    appointments: appointmentsReducer,
  },
});
