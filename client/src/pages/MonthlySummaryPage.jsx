import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CalendarDays, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
  Wallet, Target, ArrowRight,
  UtensilsCrossed, BookOpen, Car, ShoppingBag, Receipt,
  Tv, Heart, RefreshCw, MoreHorizontal, Briefcase, Code2, Gift, DollarSign,
} from 'lucide-react';
import { analyticsAPI, budgetAPI, transactionsAPI } from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, getBudgetStatus, getCategoryColor } from '../utils/formatters';
import { MONTH_NAMES } from '../styles/theme';

const ICON_MAP = {
  'Food': UtensilsCrossed, 'Books / Education': BookOpen, 'Travel': Car,
  'Shopping': ShoppingBag, 'Bills': Receipt, 'Entertainment': Tv,
  'Health': Heart, 'Subscriptions': RefreshCw, 'Others': MoreHorizontal,
  'Salary': Briefcase, 'Freelance': Code2, 'Allowance': Gift, 'Other': DollarSign,
};

export default function MonthlySummaryPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

      const [sumRes, budRes, catRes, txRes] = await Promise.allSettled([
        analyticsAPI.summary({ month, year }),
        budgetAPI.get({ month, year }),
        analyticsAPI.categories({ month, year, type: 'expense' }),
        transactionsAPI.getAll({ startDate, endDate, sort: 'date', order: 'desc' }),
      ]);

      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.summary);
      if (budRes.status === 'fulfilled') setBudget(budRes.value.data.budget);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
      if (txRes.status === 'fulfilled') setTransactions((txRes.value.data.transactions || []).slice(0, 8));
    } catch (err) {
      console.error('Monthly summary fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;
  const budgetAmount = budget?.amount || 0;
  const budgetUsed = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;
  const budgetStatus = getBudgetStatus(budgetUsed);
  const totalCatExpenses = categories.reduce((s, c) => s + c.total, 0);
  const hasData = totalIncome > 0 || totalExpenses > 0;

  const statCards = [
    { label: 'Total Income', value: formatCurrency(totalIncome), color: '#10B981', icon: TrendingUp, bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)' },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: '#EF4444', icon: TrendingDown, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.18)' },
    { label: 'Balance', value: formatCurrency(balance), color: balance >= 0 ? '#3B82F6' : '#EF4444', icon: Wallet, bg: balance >= 0 ? 'rgba(59,130,246,0.08)' : 'rgba(239,68,68,0.08)', border: balance >= 0 ? 'rgba(59,130,246,0.18)' : 'rgba(239,68,68,0.18)' },
    { label: 'Budget Used', value: budgetAmount > 0 ? `${Math.round(budgetUsed)}%` : 'Not set', color: budgetAmount > 0 ? budgetStatus.color : 'var(--color-text-muted)', icon: Target, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  ];

  return (
    <div className="page-padding">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
          Monthly Summary
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Your complete financial picture for the month.
        </p>
      </motion.div>

      {/* ─── Month Selector ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
      >
        <button className="btn btn-ghost" onClick={prevMonth} style={{ padding: '0.5rem' }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{
          padding: '0.5rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-primary)',
          minWidth: 180, textAlign: 'center',
        }}>
          {MONTH_NAMES[month - 1]} {year}
        </div>
        <button className="btn btn-ghost" onClick={nextMonth} style={{ padding: '0.5rem' }}>
          <ChevronRight size={18} />
        </button>
      </motion.div>

      {loading ? (
        /* ─── Loading Skeleton ─── */
        <>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card" style={{ padding: '1.25rem' }}>
                <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 28, width: '70%' }} />
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        </>
      ) : !hasData ? (
        /* ─── Empty State ─── */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <EmptyState
            icon={CalendarDays}
            title={`No data for ${MONTH_NAMES[month - 1]} ${year}`}
            description="Add income and expenses to generate your monthly financial summary."
            actionLabel="+ Add Transaction"
            onAction={() => window.location.href = '/transactions'}
          />
        </motion.div>
      ) : (
        <>
          {/* ─── Stat Cards ─── */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="card"
                  style={{ padding: '1.25rem' }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: card.bg, border: `1px solid ${card.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <Icon size={18} color={card.color} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 4 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                    {card.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Budget Progress ─── */}
          {budgetAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
              style={{ padding: '1.25rem', marginBottom: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                    Budget Progress
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    {formatCurrency(totalExpenses)} spent of {formatCurrency(budgetAmount)}
                  </p>
                </div>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 700, color: budgetStatus.color,
                  background: `${budgetStatus.color}15`, padding: '4px 10px', borderRadius: 999,
                }}>
                  {budgetUsed.toFixed(1)}%
                </div>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetUsed}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  style={{ background: budgetStatus.color }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: 6 }}>
                {budgetStatus.label} — {formatCurrency(Math.max(budgetAmount - totalExpenses, 0))} remaining
              </p>
            </motion.div>
          )}

          {/* ─── Top Spending Categories + Recent Transactions ─── */}
          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="card"
              style={{ padding: '1.25rem' }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                Top Spending Categories
              </h3>
              {categories.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {categories.slice(0, 6).map((cat) => {
                    const pct = totalCatExpenses > 0 ? (cat.total / totalCatExpenses) * 100 : 0;
                    const color = getCategoryColor(cat._id);
                    const Icon = ICON_MAP[cat._id] || MoreHorizontal;
                    return (
                      <div key={cat._id}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 7,
                              background: `${color}12`, display: 'flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <Icon size={13} color={color} />
                            </div>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{cat._id}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatCurrency(cat.total)}</span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', width: 36, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div style={{ height: 4, background: 'var(--color-bg-elevated)', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-faint)', textAlign: 'center', padding: '2rem 0' }}>
                  No expenses this month
                </p>
              )}
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <div style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Transactions This Month
                </h3>
                <Link to="/transactions" style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={13} />
                </Link>
              </div>
              {transactions.length > 0 ? (
                <div>
                  {transactions.map((tx, i) => {
                    const IconComp = ICON_MAP[tx.category] || MoreHorizontal;
                    const isIncome = tx.type === 'income';
                    return (
                      <div
                        key={tx._id || i}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.625rem 1.25rem',
                          borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: `${getCategoryColor(tx.category)}12`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <IconComp size={14} color={getCategoryColor(tx.category)} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tx.description || tx.category}
                          </p>
                          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>
                            {tx.category}
                          </p>
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isIncome ? '#10b981' : '#ef4444' }}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-faint)' }}>No transactions this month</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ─── Month Summary Insights ─── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06))',
              border: '1px solid rgba(59,130,246,0.12)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
            }}
          >
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#60a5fa', marginBottom: 8 }}>📊 Monthly Insight</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {totalIncome > totalExpenses
                ? `Great job! You saved ${formatCurrency(balance)} this month. That's ${((balance / totalIncome) * 100).toFixed(0)}% of your income.`
                : totalExpenses > 0
                  ? `You spent ${formatCurrency(Math.abs(balance))} more than you earned this month. Review your expenses and try to cut back on non-essentials.`
                  : 'Start adding income and expenses to track your monthly progress.'
              }
              {categories.length > 0 && ` Your top expense category was ${categories[0]._id} at ${formatCurrency(categories[0].total)}.`}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}
