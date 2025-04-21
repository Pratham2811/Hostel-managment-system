// store/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '../services/bookingService';

export const getBookings = createAsyncThunk('bookings/getBookings', bookingService.fetchBookings);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.data;
        state.loading = false;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default bookingSlice.reducer;
