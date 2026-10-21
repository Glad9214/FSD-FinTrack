// Vercel Serverless Function entrypoint (fallback for standard Vercel deployments)
const app = require('../server/index');

app.default = app;
module.exports = app;
module.exports.default = app;
