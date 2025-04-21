// store/complaintSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as complaintService from '../services/complaintService';

export const getComplaints = createAsyncThunk(
  'complaints/getComplaints',
  complaintService.fetchComplaints
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload.data;
        state.loading = false;
      })
      .addCase(getComplaints.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default complaintSlice.reducer;
