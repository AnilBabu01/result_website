import { configureStore } from '@reduxjs/toolkit';
import { apiClient } from './api/apiClient';

export const store = configureStore({
  reducer: {
    [apiClient.reducerPath]: apiClient.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiClient.middleware),
});