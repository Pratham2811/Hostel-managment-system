const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./src/middleware/errorHandler'); // Fixed import

// Load env vars
dotenv.config();


// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Logging
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/hostels', require('./src/routes/hostel'));
app.use('/api/rooms', require('./src/routes/room'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/complaints', require('./src/routes/complaint')); // Verify this exports router
app.use('/api/reviews', require('./src/routes/review'));
app.use('/api/notifications', require('./src/routes/notification'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/settings', require('./src/routes/setting'));

// Base route
app.get('/', (req, res) => res.send('Hostel Management API'));

// Error handler
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));