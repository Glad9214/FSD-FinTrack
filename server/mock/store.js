/**
 * In-Memory Data Store
 * Used when MONGO_URI is not configured.
 * All data lives in memory and resets on server restart.
 * 
 * ⚠️  MOCK DATA LAYER — Replace with MongoDB when MONGO_URI is set.
 */

const bcrypt = require('bcryptjs');

// ─── In-Memory Collections ───────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, 'data.json');

let store = {
  users: [],
  transactions: [],
  budgets: [],
  _nextId: 1,
};

if (fs.existsSync(dataFile)) {
  try {
    store = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch(e) {}
}

function saveStore() {
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

// Generate a fake ObjectId-like string
function generateId() {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return Array.from({ length: 24 }, hex).join('');
}

// ─── User Operations ─────────────────────────────────────────────────────────
async function createUser({ name, email, password }) {
  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(password, salt);
  const user = {
    _id: generateId(),
    name,
    email: email.toLowerCase().trim(),
    password: hashed,
    currency: 'INR',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.users.push(user);
  saveStore();
  return user;
}

function findUserByEmail(email) {
  return store.users.find(u => u.email === email.toLowerCase().trim()) || null;
}

function findUserById(id) {
  return store.users.find(u => u._id === id) || null;
}

function userToJSON(user) {
  const { password, __v, ...safe } = user;
  return safe;
}

async function comparePassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

// ─── Transaction Operations ──────────────────────────────────────────────────
function createTransaction(data) {
  const tx = {
    _id: generateId(),
    userId: data.userId,
    type: data.type,
    amount: parseFloat(data.amount),
    category: data.category,
    description: data.description || '',
    date: data.date ? new Date(data.date) : new Date(),
    paymentMethod: data.paymentMethod || 'Cash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.transactions.push(tx);
  saveStore();
  return tx;
}

function findTransactions(userId, filters = {}) {
  let results = store.transactions.filter(t => t.userId === userId);

  if (filters.type && ['income', 'expense'].includes(filters.type)) {
    results = results.filter(t => t.type === filters.type);
  }
  if (filters.category) {
    results = results.filter(t => t.category === filters.category);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(t =>
      (t.description && t.description.toLowerCase().includes(s)) ||
      t.category.toLowerCase().includes(s)
    );
  }
  if (filters.startDate) {
    const start = new Date(filters.startDate);
    results = results.filter(t => new Date(t.date) >= start);
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    results = results.filter(t => new Date(t.date) <= end);
  }

  // Sort
  const sortField = filters.sort === 'amount' ? 'amount' : 'date';
  const sortOrder = filters.order === 'asc' ? 1 : -1;
  results.sort((a, b) => {
    const va = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
    const vb = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
    return (va - vb) * sortOrder;
  });

  return results;
}

function findTransactionById(id, userId) {
  return store.transactions.find(t => t._id === id && t.userId === userId) || null;
}

function updateTransaction(id, userId, updates) {
  const tx = findTransactionById(id, userId);
  if (!tx) return null;
  if (updates.type) tx.type = updates.type;
  if (updates.amount) tx.amount = parseFloat(updates.amount);
  if (updates.category) tx.category = updates.category;
  if (updates.description !== undefined) tx.description = updates.description;
  if (updates.date) tx.date = new Date(updates.date);
  if (updates.paymentMethod) tx.paymentMethod = updates.paymentMethod;
  tx.updatedAt = new Date().toISOString();
  saveStore();
  return tx;
}

function deleteTransaction(id, userId) {
  const idx = store.transactions.findIndex(t => t._id === id && t.userId === userId);
  if (idx === -1) return null;
  const deleted = store.transactions.splice(idx, 1)[0];
  saveStore();
  return deleted;
}

// ─── Budget Operations ───────────────────────────────────────────────────────
function findBudget(userId, month, year) {
  return store.budgets.find(b =>
    b.userId === userId && b.month === month && b.year === year
  ) || null;
}

function upsertBudget(userId, month, year, amount) {
  let budget = findBudget(userId, month, year);
  if (budget) {
    budget.amount = parseFloat(amount);
    budget.updatedAt = new Date().toISOString();
  } else {
    budget = {
      _id: generateId(),
      userId,
      month: parseInt(month),
      year: parseInt(year),
      amount: parseFloat(amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.budgets.push(budget);
  }
  saveStore();
  return budget;
}

// ─── Analytics Operations ────────────────────────────────────────────────────
function getSummary(userId, month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const txs = store.transactions.filter(t =>
    t.userId === userId &&
    new Date(t.date) >= startDate &&
    new Date(t.date) <= endDate
  );

  const totalIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return {
    month,
    year,
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: txs.length,
  };
}

function getCategoryBreakdown(userId, month, year, type = 'expense') {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const txs = store.transactions.filter(t =>
    t.userId === userId &&
    t.type === type &&
    new Date(t.date) >= startDate &&
    new Date(t.date) <= endDate
  );

  const grouped = {};
  txs.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = { total: 0, count: 0 };
    grouped[t.category].total += t.amount;
    grouped[t.category].count += 1;
  });

  return Object.entries(grouped)
    .map(([cat, data]) => ({ _id: cat, total: data.total, count: data.count }))
    .sort((a, b) => b.total - a.total);
}

function getMonthlyTrend(userId, year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const txs = store.transactions.filter(t =>
    t.userId === userId &&
    new Date(t.date) >= startDate &&
    new Date(t.date) <= endDate
  );

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expenses: 0,
  }));

  txs.forEach(t => {
    const m = new Date(t.date).getMonth();
    if (t.type === 'income') months[m].income += t.amount;
    else if (t.type === 'expense') months[m].expenses += t.amount;
  });

  return months;
}

// ─── Seed Demo Data ──────────────────────────────────────────────────────────
async function seedDemoData(userId) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Helper to create a date this month
  const thisMonth = (day) => new Date(year, month, day).toISOString();
  const lastMonth = (day) => new Date(year, month - 1, day).toISOString();

  // This month's income
  createTransaction({ userId, type: 'income', amount: 45000, category: 'Salary', description: 'Monthly salary', date: thisMonth(1), paymentMethod: 'Bank Transfer' });
  createTransaction({ userId, type: 'income', amount: 8000, category: 'Freelance', description: 'Website design project', date: thisMonth(10), paymentMethod: 'UPI' });

  // This month's expenses
  createTransaction({ userId, type: 'expense', amount: 3500, category: 'Food', description: 'Groceries and dining', date: thisMonth(3), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 1200, category: 'Travel', description: 'Metro card recharge', date: thisMonth(5), paymentMethod: 'Debit Card' });
  createTransaction({ userId, type: 'expense', amount: 5500, category: 'Shopping', description: 'New headphones', date: thisMonth(7), paymentMethod: 'Credit Card' });
  createTransaction({ userId, type: 'expense', amount: 2000, category: 'Bills', description: 'Electricity bill', date: thisMonth(8), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 800, category: 'Entertainment', description: 'Movie tickets', date: thisMonth(12), paymentMethod: 'Cash' });
  createTransaction({ userId, type: 'expense', amount: 1500, category: 'Subscriptions', description: 'Spotify + Netflix', date: thisMonth(1), paymentMethod: 'Debit Card' });
  createTransaction({ userId, type: 'expense', amount: 2500, category: 'Books / Education', description: 'Online course', date: thisMonth(15), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 700, category: 'Health', description: 'Pharmacy', date: thisMonth(18), paymentMethod: 'Cash' });

  // Last month's data for trend charts
  createTransaction({ userId, type: 'income', amount: 42000, category: 'Salary', description: 'Monthly salary', date: lastMonth(1), paymentMethod: 'Bank Transfer' });
  createTransaction({ userId, type: 'income', amount: 5000, category: 'Freelance', description: 'Logo design', date: lastMonth(15), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 4000, category: 'Food', description: 'Groceries', date: lastMonth(5), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 3000, category: 'Shopping', description: 'Clothes', date: lastMonth(10), paymentMethod: 'Debit Card' });
  createTransaction({ userId, type: 'expense', amount: 1800, category: 'Bills', description: 'Phone bill', date: lastMonth(8), paymentMethod: 'UPI' });
  createTransaction({ userId, type: 'expense', amount: 2200, category: 'Travel', description: 'Weekend trip', date: lastMonth(20), paymentMethod: 'UPI' });

  // Set budget for current month
  upsertBudget(userId, month + 1, year, 25000);
}

module.exports = {
  store,
  generateId,
  createUser,
  findUserByEmail,
  findUserById,
  userToJSON,
  comparePassword,
  createTransaction,
  findTransactions,
  findTransactionById,
  updateTransaction,
  deleteTransaction,
  findBudget,
  upsertBudget,
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  seedDemoData,
};
