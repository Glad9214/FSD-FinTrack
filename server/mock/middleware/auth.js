const jwt = require('jsonwebtoken');
const { findUserById } = require('../store');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fintrack_jwt_secret_key_8f4e2a91b3c7d5e6_college_project_2026');
    const user = findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    // Attach user to request (without password)
    const { password, ...safeUser } = user;
    req.user = safeUser;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = { protect };
