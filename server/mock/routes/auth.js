const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, userToJSON, comparePassword, seedDemoData } = require('../store');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'fintrack_jwt_secret_key_8f4e2a91b3c7d5e6_college_project_2026', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password } = req.body;
      const existing = findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await createUser({ name, email, password });
      
      // Seed data so the dashboard looks good immediately for the new user
      await seedDemoData(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token: generateToken(user._id),
        user: userToJSON(user),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Registration failed.' });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      res.json({
        success: true,
        message: 'Login successful.',
        token: generateToken(user._id),
        user: userToJSON(user),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Login failed.' });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
