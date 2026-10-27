const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check Route
app.get('/', (req, res) => {
  res.send('Deadline Clash Detector API is running...');
});

// Port and DB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in your .env file!');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed:', err.message);
    });
}