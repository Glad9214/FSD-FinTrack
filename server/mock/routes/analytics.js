const express = require('express');
const { protect } = require('../middleware/auth');
const { getSummary, getCategoryBreakdown, getMonthlyTrend } = require('../store');

const router = express.Router();
router.use(protect);

// GET /api/analytics/summary
router.get('/summary', (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const summary = getSummary(req.user._id, month, year);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch summary.' });
  }
});

// GET /api/analytics/categories
router.get('/categories', (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();
    const type = req.query.type || 'expense';

    const categories = getCategoryBreakdown(req.user._id, month, year, type);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// GET /api/analytics/monthly
router.get('/monthly', (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthly = getMonthlyTrend(req.user._id, year);
    res.json({ success: true, monthly });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch monthly data.' });
  }
});

module.exports = router;
