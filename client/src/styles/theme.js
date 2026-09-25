// ─── Design Tokens ────────────────────────────────────────────────────────────
// Single source of truth for design constants used in JS/JSX

export const COLORS = {
  bg: '#060D1A',
  surface: '#111827',
  surfaceHover: '#151f2e',
  border: '#1F2937',
  borderSubtle: '#162040',

  blue: '#3B82F6',
  blueDark: '#2563EB',
  blueLight: '#60A5FA',

  emerald: '#10B981',
  emeraldDark: '#059669',
  emeraldLight: '#34D399',

  red: '#EF4444',
  amber: '#F59E0B',
  purple: '#8B5CF6',

  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  income: '#10B981',
  expense: '#EF4444',
  budget: '#3B82F6',
  savings: '#34D399',
};

// Chart color palette for categories
export const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EF4444', // red
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899', // pink
  '#84CC16', // lime
  '#6366F1', // indigo
];

// Category → color mapping
export const CATEGORY_COLORS = {
  'Food': '#F59E0B',
  'Books / Education': '#8B5CF6',
  'Travel': '#06B6D4',
  'Shopping': '#EC4899',
  'Bills': '#EF4444',
  'Entertainment': '#F97316',
  'Health': '#10B981',
  'Subscriptions': '#6366F1',
  'Others': '#9CA3AF',
  // Income
  'Salary': '#10B981',
  'Freelance': '#3B82F6',
  'Allowance': '#8B5CF6',
  'Other': '#9CA3AF',
};

// Category → icon name (lucide-react)
export const CATEGORY_ICONS = {
  'Food': 'UtensilsCrossed',
  'Books / Education': 'BookOpen',
  'Travel': 'Car',
  'Shopping': 'ShoppingBag',
  'Bills': 'Receipt',
  'Entertainment': 'Tv',
  'Health': 'Heart',
  'Subscriptions': 'RefreshCw',
  'Others': 'MoreHorizontal',
  'Salary': 'Briefcase',
  'Freelance': 'Code2',
  'Allowance': 'Gift',
  'Other': 'DollarSign',
};

// Expense categories
export const EXPENSE_CATEGORIES = [
  'Food',
  'Books / Education',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Subscriptions',
  'Others',
];

// Income categories
export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Allowance',
  'Other',
];

// Payment methods
export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Debit Card',
  'Credit Card',
  'Bank Transfer',
  'Other',
];

// Month names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
