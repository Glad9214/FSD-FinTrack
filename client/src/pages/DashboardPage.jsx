import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, transactionsAPI, budgetAPI } from '../services/api';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDateRelative, getCategoryColor, getBudgetStatus, getInitials } from '../utils/formatters';
import { MONTH_NAMES, CATEGORY_COLORS, CHART_COLORS } from '../styles/theme';
import {
  Wallet, TrendingUp, TrendingDown, Target, ArrowRight,
  PlusCircle, BarChart3, ArrowUpRight,
  UtensilsCrossed, BookOpen, Car, ShoppingBag, Receipt,
  Tv, Heart, RefreshCw, MoreHorizontal, Briefcase, Code2, Gift, DollarSign,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

const ICON_MAP = {
  'Food': UtensilsCrossed, 'Books / Education': BookOpen, 'Travel': Car,
  'Shopping': ShoppingBag, 'Bills': Receipt, 'Entertainment': Tv,
  'Health': Heart, 'Subscriptions': RefreshCw, 'Others': MoreHorizontal,
  'Salary': Briefcase, 'Freelance': Code2, 'Allowance': Gift, 'Other': DollarSign,
};

function DashboardPage() {
  const { user } = useAuth();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = MONTH_NAMES[now.getMonth()];

  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, budRes, catRes, monthRes, txRes] = await Promise.allSettled([
        analyticsAPI.summary({ month, year }),
        budgetAPI.get({ month, year }),
        analyticsAPI.categories({ month, year, type: 'expense' }),
        analyticsAPI.monthly({ year }),
        transactionsAPI.getAll({ sort: 'date', order: 'desc' }),
      ]);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data.summary);
      if (budRes.status === 'fulfilled') setBudget(budRes.value.data.budget);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
      if (monthRes.status === 'fulfilled') setMonthlyData(monthRes.value.data.monthly || []);
      if (txRes.status === 'fulfilled') setTransactions((txRes.value.data.transactions || []).slice(0, 5));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getGreeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = totalIncome - totalExpenses;
  const budgetAmount = budget?.amount || 0;
  const budgetUsed = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;
  const budgetStatus = getBudgetStatus(budgetUsed);

  // Chart data
  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const barData = monthlyData
    .filter((m) => m.income > 0 || m.expenses > 0)
    .map((m) => ({ name: monthShort[m.month - 1], Income: m.income, Expenses: m.expenses }));

  const pieData = categories.map((c) => ({
    name: c._id,
    value: c.total,
    color: getCategoryColor(c._id),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.75rem 1rem', boxShadow: 'var(--shadow-lg)' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ fontSize: '0.8125rem', color: p.color }}>
            {p.dataKey}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="page-padding">
      {/* ─── Greeting ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
            {getGreeting()}, {firstName} 👋
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Here's your financial overview for {monthName} {year}.
          </p>
        </div>
      </motion.div>

      {/* ─── Summary Cards ─── */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Total Income" value={totalIncome} icon={TrendingUp} color="emerald" delay={0} loading={loading} />
        <StatCard title="Total Expenses" value={totalExpenses} icon={TrendingDown} color="red" delay={0.06} loading={loading} />
        <StatCard title="Remaining Balance" value={balance} icon={Wallet} color="blue" delay={0.12} loading={loading} />
        <StatCard
          title="Budget Used"
          value={budgetAmount > 0 ? Math.round(budgetUsed) : 0}
          icon={Target}
          color="amber"
          delay={0.18}
          loading={loading}
          prefix=""
          suffix="%"
        />
      </div>

      {/* ─── Budget Progress ─── */}
      {budgetAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card"
          style={{ padding: '1.25rem', marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 2 }}>
                Budget Progress — {monthName} {year}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
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
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsed}%` }}
              transition={{ delay: 0.5, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: budgetStatus.color }}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: 6 }}>
            {budgetStatus.label} — {formatCurrency(Math.max(budgetAmount - totalExpenses, 0))} remaining
          </p>
        </motion.div>
      )}

      {/* ─── Charts ─── */}
      <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Income vs Expenses Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: '1.25rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Spending Overview</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Income vs Expenses</p>
            </div>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-faint)' }}>Add transactions to see your chart</p>
            </div>
          )}
        </motion.div>

        {/* Top Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ padding: '1.25rem' }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Top Categories</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Expense breakdown</p>
          </div>
          {pieData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pieData.slice(0, 5).map((c) => {
                  const pct = totalExpenses > 0 ? ((c.value / totalExpenses) * 100).toFixed(0) : 0;
                  return (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-faint)' }}>Add expenses to see breakdown</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Motivational Card + Recent Transactions ─── */}
      <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Motivational */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.08))',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 16,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
            Better planning.
            <br />Bigger dreams.
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Set your budget, track your spending, and take control of your financial future.
          </p>
          <Link
            to="/budget"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-blue)', color: 'white', fontWeight: 600,
              fontSize: '0.8125rem', padding: '0.5rem 1rem', borderRadius: 8,
              width: 'fit-content',
            }}
          >
            Set Budget <ArrowRight size={14} />
          </Link>
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
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recent Transactions</h3>
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
                      padding: '0.75rem 1.25rem',
                      borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: `${getCategoryColor(tx.category)}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <IconComp size={16} color={getCategoryColor(tx.category)} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.description || tx.category}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>
                        {formatDateRelative(tx.date)} · {tx.category}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isIncome ? '#10b981' : '#ef4444' }}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No transactions yet"
              description="Add your first income or expense to start tracking."
              actionLabel="+ Add Transaction"
              onAction={() => window.location.href = '/transactions'}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPage;
