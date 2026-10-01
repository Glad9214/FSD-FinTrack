const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .if(body('firebaseToken').not().exists())
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],
  login
);

// POST /api/auth/google
router.post('/google', googleLogin);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

module.exports = router;
