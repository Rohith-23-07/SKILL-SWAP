const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getStatus } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (MongoDB Cloud Atlas or In-Memory Sample Data)
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allows local dev frontend from any port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().substring(11, 19)}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.status(200).json({
    status: 'online',
    appName: 'Skill Swap REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.cloudConnected ? 'Connected to MongoDB Cloud' : 'Running In-Memory Demo Mode',
      mode: dbStatus.mode,
      cloudConnected: dbStatus.cloudConnected
    }
  });
});

// Root API Welcome
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Skill Swap API',
    endpoints: [
      { path: '/api/health', description: 'System and database health check' },
      { path: '/api/skills', description: 'List or create student skills' },
      { path: '/api/skills/categories', description: 'List available skill categories' },
      { path: '/api/skills/:id', description: 'Get, update, or delete a skill' },
      { path: '/api/auth/register', description: 'Student account registration' },
      { path: '/api/auth/login', description: 'Student account login' },
      { path: '/api/auth/me', description: 'Get current student session info' }
    ]
  });
});

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
// Start Server (local development only)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
=====================================================
  Skill Swap Backend Server Running!
  URL: http://localhost:${PORT}
  Health Check: http://localhost:${PORT}/api/health
  Skills API:   http://localhost:${PORT}/api/skills
=====================================================
    `);
  });
}

// Export app for Vercel
module.exports = app;
