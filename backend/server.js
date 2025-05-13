const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Contact Model
const Contact = require('./models/Contact');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // The address of your frontend app
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Log the received data
    console.log('Received contact data:', req.body);

    // Validation for required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    // Optional: Check if the subject is empty
    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    // Create new contact document
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Log successful save
    console.log('Contact saved successfully:', newContact);

    res.status(201).json({ success: true, message: 'Contact saved successfully' });
  } catch (error) {
    // Log any error that occurs
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
