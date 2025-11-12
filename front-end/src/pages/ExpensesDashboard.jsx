import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Wallet2, Pencil, PlusSquare, Trash2 } from "lucide-react";

export default function ExpensesDashboard() {
  const nav = useNavigate();
  const { loading, activeGroupId, getActiveGroup, getDashboard } = useApp();
  const group = getActiveGroup();
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
    return () => { mounted = false; };
  }, [activeGroupId, getDashboard]);

  if (loading || !group || !data) return <p className="item-sub">Loading…</p>;

  const expenses = data.expenses || [];
  const youOwe = expenses.filter(e => e.youOwe).reduce((s, e) => s + Number(e.amount || 0), 0);
  const youreOwed = expenses.filter(e => !e.youOwe).reduce((s, e) => s + Number(e.amount || 0), 0);

  const handleDelete = (id) => {
    setData(prev => ({ ...prev, expenses: (prev.expenses || []).filter(x => x.id !== id) }));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="tile-icon" style={{ background: "var(--rose-50)", color: "var(--rose-600)" }}>
            <Wallet2 size={18} />
          </div>
          <div>
            <div className="item-sub">{group.name}</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Expenses</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => nav("/expenses/new")}>
            <PlusSquare size={16} /> Add Expense
          </button>
          <button className="btn btn-primary" onClick={() => setEditMode(x => !x)}>
            <Pencil size={16} /> {editMode ? "Done Editing" : "Edit Expenses"}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: "10px 12px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: editMode ? "1fr 120px 140px 90px" : "1fr 120px 140px",
          gap: 8, fontWeight: 700
        }}>
          <span>Description</span>
          <span>Amount</span>
          <span>Paid By</span>
          {editMode && <span style={{ textAlign: "right" }}>Actions</span>}
        </div>

        {expenses.length === 0 && <p className="item-sub">No expenses yet.</p>}

        {expenses.map(e => (
          <div
            key={e.id}
            style={{
              display: "grid",
              gridTemplateColumns: editMode ? "1fr 120px 140px 90px" : "1fr 120px 140px",
              gap: 8,
              padding: "8px 0",
              borderTop: "1px solid #eee",
              alignItems: "center"
            }}
          >
            <span>{e.description || e.label}</span>
            <span>${Number(e.amount || 0).toFixed(2)}</span>
            <span>{e.paidBy?.name || e.paidBy?.email || "—"}</span>

            {editMode && (
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => nav(`/expenses/${e.id}/edit`)}>
                  <Pencil size={14} />
                </button>
                <button className="btn btn-ghost" onClick={() => handleDelete(e.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="section-title" style={{ marginTop: 0 }}>Your Status</h3>
        <p>You’re owed: <strong>${youreOwed.toFixed(2)}</strong></p>
        <p>You owe: <strong>${youOwe.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
