const jwt = require('jsonwebtoken');
const adminAuth = require('../config/firebase-admin');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in.',
    });
  }

  // 1. Try local JWT token verification
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fintrack_jwt_secret_key_8f4e2a91b3c7d5e6_college_project_2026'
    );
    if (decoded && decoded.id) {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    }
  } catch (jwtError) {
    // Token wasn't a local JWT or expired; continue to try Firebase token
  }

  // 2. Try Firebase ID token verification
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid });

    // If user exists by email but not firebaseUid, link them
    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email.toLowerCase().trim() });
      if (user) {
        user.firebaseUid = firebaseUid;
        await user.save();
      } else {
        // Auto-provision user in MongoDB
        user = await User.create({
          firebaseUid,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    req.user = user;
    return next();
  } catch (fbError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

protect.protect = protect;
module.exports = protect;
module.exports.protect = protect;
