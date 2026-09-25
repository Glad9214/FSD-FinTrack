const express = require('express');
const { protect } = require('../middleware/auth');
const Budget = require('../models/Budget');

const router = express.Router();

router.use(protect);

// GET /api/budget?month=9&year=2026
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const budget = await Budget.findOne({ userId: req.user._id, month, year });

    res.json({ success: true, budget: budget || null });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget.' });
  }
});

// POST /api/budget — create or update (upsert)
router.post('/', async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    if (!month || !year || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Month, year, and amount are required.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, month: parseInt(month), year: parseInt(year) },
      { amount: parseFloat(amount) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, budget });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ success: false, message: 'Failed to set budget.' });
  }
});

module.exports = router;
