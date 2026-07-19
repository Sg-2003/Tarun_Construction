// api/index.js — Vercel serverless entry point
// This file is the bridge between Vercel's serverless runtime and the Express app.

// Validate required environment variables early to give clear error messages
// instead of cryptic crash logs.
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  // Export a simple handler that reports missing config instead of crashing
  module.exports = (req, res) => {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    res.status(500).json({
      success: false,
      message: 'Server misconfigured. Missing environment variables: ' + missingVars.join(', '),
      hint: 'Set these in Vercel Dashboard → Project Settings → Environment Variables',
    });
  };
} else {
  // All required env vars are present — load the full Express app
  const app = require('../server/server.js');
  module.exports = app;
}
