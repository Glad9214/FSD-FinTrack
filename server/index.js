require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Database Connection ──────────────────────────────────────────────────────
// Only connect to MongoDB when MONGO_URI is provided in .env
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log(
    '⚠️  MONGO_URI not set. Running without database connection.\n' +
    '   Copy server/.env.example to server/.env and add your Atlas URI.'
  );
}

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGO_URI ? 'configured' : 'not configured',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const useMock = !process.env.MONGO_URI || process.env.MONGO_URI === 'PASTE_YOUR_MONGODB_URI_HERE';

if (useMock) {
  console.log('🔌 Using IN-MEMORY MOCK DATA LAYER (MongoDB not configured)');
  app.use('/api/auth', require('./mock/routes/auth'));
  app.use('/api/transactions', require('./mock/routes/transactions'));
  app.use('/api/budget', require('./mock/routes/budget'));
  app.use('/api/analytics', require('./mock/routes/analytics'));
} else {
  console.log('🔗 Using MongoDB Database Layer');
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/transactions', require('./routes/transactions'));
  app.use('/api/budget', require('./routes/budget'));
  app.use('/api/analytics', require('./routes/analytics'));
}

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Finance Tracker API`);
  console.log(`   Listening on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
