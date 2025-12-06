// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import capsulesReducer from './capsulesSlice';

export const store = configureStore({
  reducer: {
    capsules: capsulesReducer,
  },
});
