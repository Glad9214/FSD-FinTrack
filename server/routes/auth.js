const express = require('express');
const { body } = require('express-validator');
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

const loginValidation = [
  body('email')
    .if(body('firebaseToken').not().exists())
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

// Register routes (support /register, /auth/register, /api/auth/register)
router.post('/register', registerValidation, register);
router.post('/auth/register', registerValidation, register);
router.post('/api/auth/register', registerValidation, register);

// Login routes (support /login, /auth/login, /api/auth/login)
router.post('/login', loginValidation, login);
router.post('/auth/login', loginValidation, login);
router.post('/api/auth/login', loginValidation, login);

// Google Auth routes (support /google, /auth/google, /api/auth/google)
router.post('/google', googleLogin);
router.post('/auth/google', googleLogin);
router.post('/api/auth/google', googleLogin);

// Current user profile routes (protected)
router.get('/me', protect, getMe);
router.get('/auth/me', protect, getMe);
router.get('/api/auth/me', protect, getMe);

module.exports = router;
