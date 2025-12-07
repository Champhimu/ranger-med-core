// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import capsulesReducer from './capsulesSlice';
import symptomReducer from './symptomSlice';

export const store = configureStore({
  reducer: {
    capsules: capsulesReducer,
    symptoms: symptomReducer,
  },
});
