import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight, Search, Plus, Edit3, Trash2,
  TrendingUp, TrendingDown,
  UtensilsCrossed, BookOpen, Car, ShoppingBag, Receipt,
  Tv, Heart, RefreshCw, MoreHorizontal, Briefcase, Code2, Gift, DollarSign,
} from 'lucide-react';
import { transactionsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDateFull, formatDateForInput, getCategoryColor } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../styles/theme';

const ICON_MAP = {
  'Food': UtensilsCrossed, 'Books / Education': BookOpen, 'Travel': Car,
  'Shopping': ShoppingBag, 'Bills': Receipt, 'Entertainment': Tv,
  'Health': Heart, 'Subscriptions': RefreshCw, 'Others': MoreHorizontal,
  'Salary': Briefcase, 'Freelance': Code2, 'Allowance': Gift, 'Other': DollarSign,
};

const FILTERS = ['All', 'Income', 'Expense'];

const emptyForm = { type: 'expense', amount: '', category: '', date: '', description: '', paymentMethod: 'Cash' };

export default function TransactionsPage() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.type = activeFilter.toLowerCase();
      if (search) params.search = search;
      const res = await transactionsAPI.getAll(params);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Open modal for add/edit
  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, date: formatDateForInput(new Date()) });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (tx) => {
    setEditing(tx);
    setForm({
      type: tx.type,
      amount: String(tx.amount),
      category: tx.category,
      date: formatDateForInput(tx.date),
      description: tx.description || '',
      paymentMethod: tx.paymentMethod || 'Cash',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const e = {};
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.category) e.category = 'Select a category';
    if (!form.date) e.date = 'Select a date';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editing) {
        await transactionsAPI.update(editing._id, form);
        toast.success('Transaction updated');
      } else {
        await transactionsAPI.create(form);
        toast.success('Transaction added');
      }
      setModalOpen(false);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await transactionsAPI.delete(deleteTarget._id);
      toast.success('Transaction deleted');
      setDeleteTarget(null);
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="page-padding">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
            Transactions
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            View and manage your financial activity.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Transaction
        </button>
      </motion.div>

      {/* ─── Controls ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}
      >
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-field"
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.1875rem' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 500, transition: 'all 0.15s',
                background: activeFilter === f ? 'var(--color-blue)' : 'transparent',
                color: activeFilter === f ? '#fff' : 'var(--color-text-muted)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Transaction List ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        {loading ? (
          <div style={{ padding: '1rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: '40%' }} />
                </div>
                <div className="skeleton" style={{ height: 16, width: 60 }} />
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px 60px', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--color-border)' }} className="tx-table-header">
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Amount</span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</span>
            </div>

            {transactions.map((tx, i) => {
              const IconComp = ICON_MAP[tx.category] || MoreHorizontal;
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx._id}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 120px 120px 100px 60px', gap: '0.5rem',
                    padding: '0.75rem 1.25rem', alignItems: 'center',
                    borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  className="tx-table-row"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: `${getCategoryColor(tx.category)}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <IconComp size={15} color={getCategoryColor(tx.category)} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.description || tx.category}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>{tx.paymentMethod || 'Cash'}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{tx.category}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{formatDateFull(tx.date)}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isIncome ? '#10b981' : '#ef4444', textAlign: 'right' }}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(tx)} style={{ padding: '0.3rem' }}>
                      <Edit3 size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(tx)} style={{ padding: '0.3rem', color: 'var(--color-red)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description="Start adding income and expenses to see your transaction history here."
            actionLabel="+ Add Transaction"
            onAction={openAdd}
          />
        )}
      </motion.div>

      {/* ─── Add/Edit Modal ─── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Transaction' : 'Add Transaction'}
      >
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Type toggle */}
          <div>
            <label className="field-label">Transaction Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.25rem' }}>
              {[
                { value: 'income', label: 'Income', icon: TrendingUp, color: '#10b981' },
                { value: 'expense', label: 'Expense', icon: TrendingDown, color: '#ef4444' },
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => { setForm((f) => ({ ...f, type: value, category: '' })); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                    padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', fontFamily: 'inherit',
                    background: form.type === value ? `${color}18` : 'transparent',
                    color: form.type === value ? color : 'var(--color-text-muted)',
                    boxShadow: form.type === value ? `0 0 0 1px ${color}40` : 'none',
                  }}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="field-label">Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 600, pointerEvents: 'none' }}>₹</span>
              <input
                className="input-field"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                style={{ paddingLeft: '2rem', fontSize: '1rem', fontWeight: 600, borderColor: formErrors.amount ? 'rgba(239,68,68,0.5)' : undefined }}
              />
            </div>
            {formErrors.amount && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{formErrors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="field-label">Category</label>
            <select
              className="select-field"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{ borderColor: formErrors.category ? 'rgba(239,68,68,0.5)' : undefined }}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {formErrors.category && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{formErrors.category}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="field-label">Date</label>
            <input
              className="input-field"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={{ colorScheme: 'dark', borderColor: formErrors.date ? 'rgba(239,68,68,0.5)' : undefined }}
            />
            {formErrors.date && <p style={{ fontSize: '0.75rem', color: 'var(--color-red-light)', marginTop: 3 }}>{formErrors.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="field-label">Description <span style={{ color: 'var(--color-text-faint)', fontWeight: 400 }}>(optional)</span></label>
            <input
              className="input-field"
              type="text"
              placeholder="Add a note…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="field-label">Payment Method</label>
            <select
              className="select-field"
              value={form.paymentMethod}
              onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))}
            >
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {editing ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </Modal>

      {/* ─── Delete Confirmation ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${deleteTarget?.type || ''} of ${deleteTarget ? formatCurrency(deleteTarget.amount) : ''}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />

      {/* Responsive table */}
      <style>{`
        @media (max-width: 768px) {
          .tx-table-header { display: none !important; }
          .tx-table-row {
            grid-template-columns: 1fr auto auto !important;
          }
          .tx-table-row > *:nth-child(2),
          .tx-table-row > *:nth-child(3) { display: none !important; }
        }
      `}</style>
    </div>
  );
}
