import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function EditExpense() {
  const nav = useNavigate();
  const { expenseId } = useParams();
  const { activeGroupId, getActiveGroup, getDashboard } = useApp();
  const group = getActiveGroup();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [youOwe, setYouOwe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load expense data
  useEffect(() => {
    const loadExpense = async () => {
      try {
        const dashboard = await getDashboard(activeGroupId);
        const expense = dashboard.expenses.find(e => (e._id || e.id) === expenseId);
        
        if (expense) {
          setDescription(expense.description || expense.label || '');
          setAmount(expense.amount?.toString() || '');
          setPaidBy(expense.paidBy?.email || expense.paidBy?.name || '');
          setYouOwe(expense.youOwe || false);
        } else {
          setError('Expense not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load expense');
      } finally {
        setLoading(false);
      }
    };

    if (activeGroupId && expenseId) {
      loadExpense();
    }
  }, [activeGroupId, expenseId, getDashboard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!description.trim()) {
      setError('Description is required');
      setSaving(false);
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setSaving(false);
      return;
    }

    try {
      await api.updateExpense(activeGroupId, expenseId, {
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy: paidBy ? { email: paidBy } : {},
        youOwe
      });
      nav("/expenses");
    } catch (err) {
      setError(err.message || 'Failed to update expense');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setSaving(true);
    try {
      await api.deleteExpense(activeGroupId, expenseId);
      nav("/expenses");
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
      setSaving(false);
    }
  };

  const roommates = group?.roommates || [];

  if (loading) {
    return (
      <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
        <p className="item-sub">Loading expense...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Edit Expense</h1>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px',
          marginBottom: 12
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
        <label>
          <div className="item-sub">Description *</div>
          <input 
            className="input" 
            placeholder="e.g., Groceries, Utilities"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={saving}
          />
        </label>

        <label>
          <div className="item-sub">Amount ($) *</div>
          <input 
            className="input" 
            placeholder="0.00"
            type="number" 
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={saving}
          />
        </label>

        <label>
          <div className="item-sub">Paid By</div>
          <select 
            className="input"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            disabled={saving}
          >
            <option value="">Select who paid</option>
            {roommates.map((rm, i) => (
              <option key={i} value={rm}>{rm}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input 
            type="checkbox"
            checked={youOwe}
            onChange={(e) => setYouOwe(e.target.checked)}
            disabled={saving}
          />
          <span>I owe this amount</span>
        </label>

        <div style={{display:"flex", gap:8}}>
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={()=>nav("/expenses")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>

        <button 
          type="button" 
          className="btn" 
          style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
          onClick={handleDelete}
          disabled={saving}
        >
          Delete Expense
        </button>
      </form>
    </div>
  );
}
