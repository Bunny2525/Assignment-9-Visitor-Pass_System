const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

dotenv.config();
connectDB();

const app = express();

// Increase payload limit for Base64 image processing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Visitor Pass API is running successfully' });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});