// Vercel Serverless Function entry point
// Connects Vercel's /api routing directly to the Express backend app
const app = require('../server/index');

module.exports = app;
