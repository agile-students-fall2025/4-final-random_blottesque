import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function AddExpense() {
  const nav = useNavigate();
  const { activeGroupId, getActiveGroup } = useApp();
  const group = getActiveGroup();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [youOwe, setYouOwe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      await api.createExpense(activeGroupId, {
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy: paidBy ? { email: paidBy } : {},
        youOwe
      });
      nav("/expenses");
    } catch (err) {
      setError(err.message || 'Failed to create expense');
      setLoading(false);
    }
  };

  const roommates = group?.roommates || [];

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Add an Expense</h1>

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
            disabled={loading}
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
            disabled={loading}
          />
        </label>

        <label>
          <div className="item-sub">Paid By</div>
          <select 
            className="input"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            disabled={loading}
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
            disabled={loading}
          />
          <span>I owe this amount</span>
        </label>

        <div style={{display:"flex", gap:8}}>
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={()=>nav("/expenses")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
