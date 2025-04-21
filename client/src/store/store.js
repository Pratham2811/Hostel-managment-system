// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
//import bookingReducer from './bookingSlice';
// import hostelReducer from './hostelSlice';
// import notificationReducer from './notificationSlice';
// import paymentReducer from './paymentSlice';
// import reviewReducer from './reviewSlice';
import roomReducer from './roomSlice';
//import settingReducer from './settingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // booking: bookingReducer,
    // hostel: hostelReducer,
    // notification: notificationReducer,
    // payment: paymentReducer,
    // review: reviewReducer,
    room: roomReducer,
    hostels: hostelReducer,
    // setting: settingReducer
  }
});
