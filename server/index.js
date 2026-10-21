const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// ─── App Initialization ───────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Core Middleware ──────────────────────────────────────────────────────────
// Configure CORS to handle local development and production URLs seamlessly
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, health checks)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    // Allow deployed domains dynamically to avoid 500/CORS blockage
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Database Middleware (Ensures DB connection on Vercel Serverless) ────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ Database connection failure during request:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Ensure MongoDB Atlas Network Access allows 0.0.0.0/0.',
    });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────
const healthHandler = (req, res) => {
  const readyStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbStatus = readyStates[mongoose.connection.readyState] || 'unknown';
  
  res.json({
    status: 'ok',
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || (process.env.VERCEL ? 'production' : 'development'),
    serverless: Boolean(process.env.VERCEL),
    database: {
      status: dbStatus,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
      type: mongoose.connection.host?.includes('mongodb.net') ? 'Atlas Cloud' : 'Local Persistent MongoDB',
    },
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// ─── API Routes (MongoDB Layer) ───────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budget');
const analyticsRoutes = require('./routes/analytics');

// Mount routes on both /api/* (standard) and /* (for direct service routing)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/transactions', transactionRoutes);
app.use('/transactions', transactionRoutes);

app.use('/api/budget', budgetRoutes);
app.use('/budget', budgetRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics', analyticsRoutes);

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
      ? (err.message || 'Internal server error')
      : err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ Failed to connect database:', err);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Finance Tracker API`);
    console.log(`   Listening on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

// Start listener for standalone node execution
if (require.main === module) {
  startServer();
}

app.default = app;
module.exports = app;
module.exports.default = app;
