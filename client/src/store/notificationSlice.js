// store/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationService from '../services/notificationService';

export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  notificationService.fetchNotifications
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.data;
        state.loading = false;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default notificationSlice.reducer;
