// src/store/hostelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as hostelService from '../services/hostelService';

export const getHostels = createAsyncThunk('hostels/getAll', hostelService.fetchHostels);
export const getHostelById = createAsyncThunk('hostels/getById', hostelService.fetchHostelById);

const hostelSlice = createSlice({
  name: 'hostels',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load list
      .addCase(getHostels.pending, (state) => { state.loading = true; })
      .addCase(getHostels.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.loading = false;
      })
      .addCase(getHostels.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // load single
      .addCase(getHostelById.pending, (state) => { state.loading = true; })
      .addCase(getHostelById.fulfilled, (state, action) => {
        state.current = action.payload.data;
        state.loading = false;
      })
      .addCase(getHostelById.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default hostelSlice.reducer;
