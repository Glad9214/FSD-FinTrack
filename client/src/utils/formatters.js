import { MONTH_NAMES, MONTH_SHORT, CATEGORY_COLORS, CATEGORY_ICONS } from '../styles/theme';

// ─── Currency Formatting ──────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency string
 * formatCurrency(25000) → '₹25,000'
 * formatCurrency(25000.50) → '₹25,000.50'
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const n = Number(amount);
  const formatted = n.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return `₹${formatted}`;
};

/**
 * Format currency with sign (+/-) for income/expense display
 */
export const formatCurrencyWithSign = (amount, type) => {
  const prefix = type === 'income' ? '+' : '-';
  return `${prefix}${formatCurrency(Math.abs(amount))}`;
};

// ─── Date Formatting ──────────────────────────────────────────────────────────

/**
 * Format a date relative to today
 * Today → 'Today'
 * Yesterday → 'Yesterday'
 * This week → 'Monday'
 * Older → '15 Sep'
 */
export const formatDateRelative = (dateInput) => {
  const date = new Date(dateInput);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diff = (today - d) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) {
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/**
 * Format full date: '15 Sep 2026'
 */
export const formatDateFull = (dateInput) => {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format for input[type=date]: 'YYYY-MM-DD'
 */
export const formatDateForInput = (dateInput) => {
  const date = new Date(dateInput);
  return date.toISOString().split('T')[0];
};

// ─── Financial Calculations ───────────────────────────────────────────────────

export const calcBalance = (income, expenses) => income - expenses;

export const calcRemainingBudget = (budget, expenses) => budget - expenses;

export const calcBudgetUtilization = (budget, expenses) => {
  if (!budget || budget === 0) return 0;
  return Math.min((expenses / budget) * 100, 100);
};

export const calcCategoryPercentage = (categoryAmount, totalExpenses) => {
  if (!totalExpenses || totalExpenses === 0) return 0;
  return (categoryAmount / totalExpenses) * 100;
};

// ─── Category Helpers ─────────────────────────────────────────────────────────

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || '#9CA3AF';

export const getCategoryIcon = (category) =>
  CATEGORY_ICONS[category] || 'MoreHorizontal';

// ─── Budget Status ────────────────────────────────────────────────────────────

export const getBudgetStatus = (utilized) => {
  if (utilized >= 100) return { status: 'exceeded', color: '#EF4444', label: 'Budget exceeded' };
  if (utilized >= 85) return { status: 'critical', color: '#F59E0B', label: 'Approaching limit' };
  if (utilized >= 70) return { status: 'warning', color: '#F59E0B', label: 'Watch your spending' };
  return { status: 'good', color: '#10B981', label: 'On track' };
};

// ─── Month/Year Helpers ───────────────────────────────────────────────────────

export const getMonthName = (month) => MONTH_NAMES[month - 1] || '';
export const getMonthShort = (month) => MONTH_SHORT[month - 1] || '';

export const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

// ─── String Helpers ───────────────────────────────────────────────────────────

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const truncate = (str, max = 30) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};
