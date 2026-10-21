import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { analyticsAPI, transactionsAPI } from '../services/api';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { MONTH_NAMES, CHART_COLORS } from '../styles/theme';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Sector
} from 'recharts';

const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, monthRes, transRes] = await Promise.allSettled([
        analyticsAPI.categories({ year, type: 'expense' }),
        analyticsAPI.monthly({ year }),
        transactionsAPI.getAll({ limit: 1000 }),
      ]);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.categories || []);
      if (monthRes.status === 'fulfilled') setMonthlyData(monthRes.value.data.monthly || []);
      if (transRes.status === 'fulfilled') setTransactions(transRes.value.data.transactions || []);
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

  // Heatmap Data
  const heatmapStats = useMemo(() => {
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    const targetMonth = now.getMonth();
    const data = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, amount: 0 }));
    let max = 0;
    let sum = 0;
    
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === year && d.getMonth() === targetMonth && t.type === 'expense') {
        data[d.getDate() - 1].amount += t.amount;
      }
    });

    data.forEach(d => {
      if (d.amount > max) max = d.amount;
      sum += d.amount;
    });

    return { data, max, avg: sum / daysInMonth };
  }, [transactions, year, now]);

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="chart-tooltip"
      >
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
              <span className="chart-tooltip-key">{p.dataKey}</span>
            </div>
            <span className="chart-tooltip-val">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </motion.div>
    );
  };

  const PieChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="chart-tooltip"
        style={{ border: `1px solid ${data.payload.color}50` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: data.payload.color, boxShadow: `0 0 10px ${data.payload.color}` }} />
          <span className="chart-tooltip-key" style={{ textTransform: 'uppercase' }}>{data.name}</span>
        </div>
        <p className="chart-tooltip-val" style={{ margin: 0, marginLeft: 16 }}>
          {formatCurrency(data.value)}
        </p>
      </motion.div>
    );
  };

  const renderActivePieShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: `drop-shadow(0px 0px 8px ${fill}90)` }}
        />
      </g>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} offset={20} />
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
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none" activeIndex={activePieIndex} activeShape={renderActivePieShape} onMouseEnter={(_, index) => setActivePieIndex(index)}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} style={{ transition: 'all 0.3s ease' }} />)}
                      </Pie>
                      <Tooltip content={<PieChartTooltip />} cursor={false} offset={35} wrapperStyle={{ zIndex: 100 }} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} offset={20} />
                  <Area type="monotone" dataKey="Spending" stroke="#3b82f6" fill="url(#spendingGradient)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p style={{ color: 'var(--color-text-faint)', textAlign: 'center', padding: '3rem 0' }}>No spending data</p>}
          </motion.div>

          {/* ─── Spending Heatmap ─── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Spending Heatmap</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Daily intensity for {monthShort[now.getMonth()]} {year}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>Average Daily</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6' }}>{formatCurrency(heatmapStats.avg)}</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(28px, 1fr))', gap: 6 }}>
              {heatmapStats.data.map(day => {
                const intensity = heatmapStats.max > 0 ? day.amount / heatmapStats.max : 0;
                let bg = 'rgba(255,255,255,0.03)';
                if (intensity > 0) {
                  // Color scale from light cyan to deep blue
                  const alpha = 0.2 + (intensity * 0.8);
                  bg = `rgba(59, 130, 246, ${alpha})`;
                }
                
                return (
                  <div key={day.day} style={{ position: 'relative', group: 'heatmap-cell' }} title={`Day ${day.day}: ${formatCurrency(day.amount)}`}>
                    <div style={{
                      aspectRatio: '1/1',
                      background: bg,
                      borderRadius: 4,
                      border: intensity > 0 ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease',
                      cursor: 'crosshair'
                    }} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = `0 0 10px ${bg}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    />
                  </div>
                );
              })}
            </div>
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
