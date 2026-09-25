const express = require('express');
const { protect } = require('../middleware/auth');
const { findBudget, upsertBudget } = require('../store');

const router = express.Router();
router.use(protect);

// GET /api/budget
router.get('/', (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const budget = findBudget(req.user._id, month, year);
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch budget.' });
  }
});

// POST /api/budget
router.post('/', (req, res) => {
  try {
    const { month, year, amount } = req.body;
    if (!month || !year || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Month, year, and amount are required.' });
    }

    const budget = upsertBudget(req.user._id, month, year, amount);
    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set budget.' });
  }
});

module.exports = router;
