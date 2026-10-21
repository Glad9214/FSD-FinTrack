import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, Wallet, ArrowRight, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { budgetAPI, analyticsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import { formatCurrency, getBudgetStatus } from '../utils/formatters';
import { MONTH_NAMES } from '../styles/theme';

export default function BudgetPage() {
  const toast = useToast();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState('');
  const [budget, setBudget] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [budRes, sumRes] = await Promise.allSettled([
        budgetAPI.get({ month, year }),
        analyticsAPI.summary({ month, year }),
      ]);
      if (budRes.status === 'fulfilled' && budRes.value.data.budget) {
        setBudget(budRes.value.data.budget);
        setAmount(String(budRes.value.data.budget.amount));
      } else {
        setBudget(null);
        setAmount('');
      }
      if (sumRes.status === 'fulfilled') {
        setTotalExpenses(sumRes.value.data.summary?.totalExpenses || 0);
      }
    } catch (err) {
      console.error(err);
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

  const handleSave = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { toast.warning('Enter a valid amount'); return; }
    setSaving(true);
    try {
      await budgetAPI.set({ month, year, amount: parsed });
      toast.success('Budget saved', `${MONTH_NAMES[month - 1]} ${year} budget set to ${formatCurrency(parsed)}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const budgetAmount = budget?.amount || 0;
  const used = budgetAmount > 0 ? Math.min((totalExpenses / budgetAmount) * 100, 100) : 0;
  const remaining = budgetAmount - totalExpenses;
  const status = getBudgetStatus(used);

  return (
    <div className="page-padding">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>Budget</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Set and track your monthly spending limits.</p>
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

      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ─── Set Budget Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
          style={{ padding: '1.5rem' }}
        >
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Target size={17} color="#3b82f6" />
            Set Monthly Budget
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="field-label">Budget Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 600, pointerEvents: 'none' }}>₹</span>
              <input
                className="input-field"
                type="number"
                placeholder="e.g. 30000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ paddingLeft: '2rem', fontSize: '1.125rem', fontWeight: 700 }}
              />
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={handleSave} loading={saving}>
            <Save size={16} /> {budget ? 'Update Budget' : 'Save Budget'}
          </Button>
        </motion.div>

        {/* ─── Budget Overview ─── */}
        {budgetAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card"
            style={{ padding: '1.5rem' }}
          >
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Wallet size={17} color="#3b82f6" />
              Budget Overview
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Budget</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatCurrency(budgetAmount)}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Spent</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>{formatCurrency(totalExpenses)}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Remaining</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-emerald)' }}>{formatCurrency(remaining)}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                  {status.label}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: status.color }}>
                  {used.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${used}%` }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  style={{ background: status.color }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Tips Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06))',
            border: '1px solid rgba(59,130,246,0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
          }}
        >
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#60a5fa', marginBottom: 6 }}>💡 Budget Tip</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. A well-planned budget is the foundation of financial freedom.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
