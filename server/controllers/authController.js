const User = require('../models/User');
const { validationResult } = require('express-validator');
const adminAuth = require('../config/firebase-admin');

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, firebaseToken } = req.body;

  if (!firebaseToken) {
    return res.status(400).json({ success: false, message: 'Firebase token is required' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    const existing = await User.findOne({ firebaseUid });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this Firebase UID already exists.',
      });
    }

    const user = await User.create({ firebaseUid, name, email });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: user.toJSON(),
      token: firebaseToken, // return the same token for the client to store
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { firebaseToken } = req.body;
  if (!firebaseToken) {
    return res.status(400).json({ success: false, message: 'Firebase token is required' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist in the database.',
      });
    }

    res.json({
      success: true,
      message: 'Login successful.',
      user: user.toJSON(),
      token: firebaseToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// ─── POST /api/auth/google ───────────────────────────────────────────────────
const googleLogin = async (req, res) => {
  const { name, email, firebaseToken } = req.body;
  if (!firebaseToken) {
    return res.status(400).json({ success: false, message: 'Firebase token is required' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      // Fallback: check if email exists to avoid E11000 duplicate key error
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUid = firebaseUid;
        if (name && name !== 'Google User' && !user.name) user.name = name;
        await user.save();
      } else {
        user = await User.create({ firebaseUid, name, email });
      }
    }

    res.json({
      success: true,
      message: 'Google Login successful.',
      user: user.toJSON(),
      token: firebaseToken,
    });
  } catch (error) {
    console.error('Google Login error:', error);
    res.status(500).json({ success: false, message: 'Google Login failed. Please try again.' });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, googleLogin, getMe };
