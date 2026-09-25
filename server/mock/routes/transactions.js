const express = require('express');
const { protect } = require('../middleware/auth');
const { findTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../store');

const router = express.Router();
router.use(protect);

// GET /api/transactions
router.get('/', (req, res) => {
  try {
    const transactions = findTransactions(req.user._id, req.query);
    res.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions.' });
  }
});

// POST /api/transactions
router.post('/', (req, res) => {
  try {
    const { type, amount, category, description, date, paymentMethod } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Type, amount, and category are required.' });
    }

    const transaction = createTransaction({
      userId: req.user._id, type, amount, category, description, date, paymentMethod
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create transaction.' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', (req, res) => {
  try {
    const transaction = updateTransaction(req.params.id, req.user._id, req.body);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update transaction.' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', (req, res) => {
  try {
    const transaction = deleteTransaction(req.params.id, req.user._id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }
    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete transaction.' });
  }
});

module.exports = router;
