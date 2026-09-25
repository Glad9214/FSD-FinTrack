const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = initializeApp({
  projectId: "fintracker-8b26a"
});

const adminAuth = getAuth(app);

module.exports = adminAuth;
