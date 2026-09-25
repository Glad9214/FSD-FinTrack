import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { MONTH_NAMES, CHART_COLORS } from '../styles/theme';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, monthRes] = await Promise.allSettled([
        analyticsAPI.categories({ year, type: 'expense' }),
        analyticsAPI.monthly({ year }),
      ]);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
      if (monthRes.status === 'fulfilled') setMonthlyData(monthRes.value.data.monthly || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const barData = monthlyData
    .filter((m) => m.income > 0 || m.expenses > 0)
    .map((m) => ({
      name: monthShort[m.month - 1],
      Income: m.income,
      Expenses: m.expenses,
    }));

  const trendData = monthlyData.map((m) => ({
    name: monthShort[m.month - 1],
    Spending: m.expenses,
  }));

  const pieData = categories.map((c) => ({
    name: c._id,
    value: c.total,
    color: getCategoryColor(c._id),
  }));

  const totalExpenses = categories.reduce((s, c) => s + c.total, 0);

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

  const hasData = barData.length > 0 || pieData.length > 0;

  return (
    <div className="page-padding">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Analytics</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Visual insights into your financial behaviour.</p>
      </motion.div>

      {/* ─── Year Selector ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
      >
        <button className="btn btn-ghost" onClick={() => setYear(y => y - 1)} style={{ padding: '0.5rem' }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ padding: '0.5rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-primary)', minWidth: 120, textAlign: 'center' }}>
          {year}
        </div>
        <button className="btn btn-ghost" onClick={() => setYear(y => y + 1)} style={{ padding: '0.5rem' }}>
          <ChevronRight size={18} />
        </button>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <div className="skeleton" style={{ height: 16, width: '50%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 200 }} />
            </div>
          ))}
        </div>
      ) : !hasData ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <BarChart3 size={48} color="var(--color-border)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>No data for {year}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Add transactions to see your analytics and visualizations.</p>
        </motion.div>
      ) : (
        <>
          {/* ─── Chart Grid ─── */}
          <div className="charts-grid" style={{ marginBottom: '1.25rem' }}>
            {/* Monthly Overview */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Monthly Overview</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Income vs Expenses by month</p>
              </div>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--color-text-faint)', textAlign: 'center', padding: '3rem 0' }}>No monthly data</p>}
            </motion.div>

            {/* Expense by Category */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Expense by Category</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Where your money goes</p>
              </div>
              {pieData.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ResponsiveContainer width="50%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pieData.map((c) => {
                      const pct = totalExpenses > 0 ? ((c.value / totalExpenses) * 100).toFixed(1) : 0;
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
              ) : <p style={{ color: 'var(--color-text-faint)', textAlign: 'center', padding: '3rem 0' }}>No category data</p>}
            </motion.div>
          </div>

          {/* ─── Spending Trend ─── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Spending Trend</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>How your spending has changed over {year}</p>
            </div>
            {trendData.some(d => d.Spending > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Spending" stroke="#3b82f6" fill="url(#spendingGradient)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p style={{ color: 'var(--color-text-faint)', textAlign: 'center', padding: '3rem 0' }}>No spending data</p>}
          </motion.div>

          {/* ─── Top Spending Categories ─── */}
          {pieData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Top Spending Categories</h3>
              {pieData.sort((a, b) => b.value - a.value).map((c, i) => {
                const pct = totalExpenses > 0 ? (c.value / totalExpenses) * 100 : 0;
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0', borderBottom: i < pieData.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-faint)', width: 20 }}>#{i + 1}</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatCurrency(c.value)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', width: 45, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
