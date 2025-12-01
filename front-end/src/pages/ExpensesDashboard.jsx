import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Wallet2, Pencil, Trash2 } from "lucide-react";
import * as api from '../lib/api';

export default function ExpensesDashboard() {
  const nav = useNavigate();
  const { loading, activeGroupId, getActiveGroup, getDashboard } = useApp();
  const group = getActiveGroup();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!activeGroupId) return;
    try {
      const dashboard = await getDashboard(activeGroupId);
      setData(dashboard);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    }
  }, [activeGroupId, getDashboard]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    
    try {
      await api.deleteExpense(activeGroupId, expenseId);
      setData(prevData => ({
        ...prevData,
        expenses: prevData.expenses.filter(e => (e._id || e.id) !== expenseId),
      }));
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  if (loading || !group) return <p className="item-sub">Loading…</p>;

  const expenses = data?.expenses || [];
  const youOwe = expenses.filter(e => e.youOwe).reduce((s, e) => s + (e.amount || 0), 0);
  const youreOwed = expenses.filter(e => !e.youOwe).reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="tile-icon" style={{ background: "var(--rose-50)", color: "var(--rose-600)" }}>
            <Wallet2 size={18} />
          </div>
          <div>
            <div className="item-sub">Group</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{group.name}</h1>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => nav("/expenses/new")}>
          ADD EXPENSE
        </button>
      </div>

      <div className="card" style={{ padding: "10px 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 80px", gap: 8, fontWeight: 700, marginBottom: 8 }}>
          <span>Description</span>
          <span>Amount</span>
          <span>Paid By</span>
          <span></span>
        </div>

        {expenses.length === 0 && <p className="item-sub">No expenses yet. Click "Add Expense" to create one.</p>}

        {expenses.map(e => (
          <div
            key={e._id || e.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 100px 80px",
              gap: 8,
              padding: "8px 0",
              borderTop: "1px solid #eee",
              alignItems: "center"
            }}
          >
            <span>{e.description || e.label}</span>
            <span style={{ color: e.youOwe ? '#dc2626' : '#059669' }}>
              {e.youOwe ? '-' : '+'}${Number(e.amount).toFixed(2)}
            </span>
            <span>{e.paidBy?.name || e.paidBy?.email || "—"}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', height: 'auto' }} onClick={() => nav(`/expenses/${e._id || e.id}/edit`)}>
                <Pencil size={14} />
              </button>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', height: 'auto' }} onClick={() => handleDelete(e._id || e.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title" style={{ marginTop: 0 }}>Your Status</h3>
        <p>You're owed: <strong style={{ color: '#059669' }}>${youreOwed.toFixed(2)}</strong></p>
        <p>You owe: <strong style={{ color: '#dc2626' }}>${youOwe.toFixed(2)}</strong></p>
        <p style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
          Net: <strong style={{ color: (youreOwed - youOwe) >= 0 ? '#059669' : '#dc2626' }}>
            {(youreOwed - youOwe) >= 0 ? '+' : '-'}${Math.abs(youreOwed - youOwe).toFixed(2)}
          </strong>
        </p>
      </div>
    </div>
  );
}
