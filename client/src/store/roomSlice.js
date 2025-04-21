// src/store/roomSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [],
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const { setRooms } = roomSlice.actions;
export default roomSlice.reducer;
