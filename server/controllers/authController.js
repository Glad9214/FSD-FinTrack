const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const adminAuth = require('../config/firebase-admin');

const generateJWT = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fintrack_jwt_secret_key_8f4e2a91b3c7d5e6_college_project_2026',
    { expiresIn: '30d' }
  );

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, firebaseToken } = req.body;

  try {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    // Check duplicate by email first
    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    if (firebaseToken) {
      const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
      const firebaseUid = decodedToken.uid;

      const existingByUid = await User.findOne({ firebaseUid });
      if (existingByUid) {
        return res.status(409).json({
          success: false,
          message: 'An account with this Firebase UID already exists.',
        });
      }

      const user = await User.create({
        firebaseUid,
        name: name || decodedToken.name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
      });

      const token = generateJWT(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        user: user.toJSON(),
        token,
      });
    }

    // Direct password registration (API tests / direct usage)
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password or Firebase token is required',
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    const token = generateJWT(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: user.toJSON(),
      token,
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

  const { email, password, firebaseToken } = req.body;

  try {
    if (firebaseToken) {
      const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
      const firebaseUid = decodedToken.uid;
      const normalizedEmail = (decodedToken.email || email || '').toLowerCase().trim();

      let user = await User.findOne({ firebaseUid });
      if (!user && normalizedEmail) {
        user = await User.findOne({ email: normalizedEmail });
        if (user) {
          user.firebaseUid = firebaseUid;
          await user.save();
        }
      }

      if (!user) {
        // Auto-create user if verified by Firebase
        user = await User.create({
          firebaseUid,
          name: decodedToken.name || (normalizedEmail ? normalizedEmail.split('@')[0] : 'User'),
          email: normalizedEmail || `${firebaseUid}@firebase.user`,
        });
      }

      const token = generateJWT(user._id);

      return res.json({
        success: true,
        message: 'Login successful.',
        user: user.toJSON(),
        token,
      });
    }

    // Direct email/password login
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password (or Firebase token) are required',
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateJWT(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      user: user.toJSON(),
      token,
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
    const normalizedEmail = (email || decodedToken.email || '').toLowerCase().trim();

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      if (normalizedEmail) {
        user = await User.findOne({ email: normalizedEmail });
      }
      if (user) {
        user.firebaseUid = firebaseUid;
        if (name && name !== 'Google User' && !user.name) user.name = name;
        await user.save();
      } else {
        user = await User.create({
          firebaseUid,
          name: name || decodedToken.name || (normalizedEmail ? normalizedEmail.split('@')[0] : 'Google User'),
          email: normalizedEmail || `${firebaseUid}@google.user`,
        });
      }
    }

    const token = generateJWT(user._id);

    res.json({
      success: true,
      message: 'Google Login successful.',
      user: user.toJSON(),
      token,
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
