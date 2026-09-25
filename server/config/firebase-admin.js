const admin = require('firebase-admin');

admin.initializeApp({
  projectId: "fintracker-8b26a"
});

module.exports = admin;
