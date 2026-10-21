const { initializeApp, getApps, getApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = getApps().length === 0
  ? initializeApp({ projectId: "fintracker-8b26a" })
  : getApp();

const adminAuth = getAuth(app);

module.exports = adminAuth;
