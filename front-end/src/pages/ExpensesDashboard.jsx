import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Wallet2 } from "lucide-react";

export default function ExpensesDashboard() {
  const nav = useNavigate();
  const { loading, activeGroupId, getActiveGroup, getDashboard } = useApp();
  const group = getActiveGroup();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
    return () => { mounted = false; };
  }, [activeGroupId, getDashboard]);

  if (loading || !group || !data) return <p className="item-sub">Loading…</p>;

  const expenses = data.expenses || [];
  const youOwe = expenses.filter(e => e.youOwe).reduce((s, e) => s + e.amount, 0);
  const youreOwed = expenses.filter(e => !e.youOwe).reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px", gap: 8, fontWeight: 700 }}>
          <span>Description</span>
          <span>Amount</span>
          <span>Paid By</span>
        </div>

        {expenses.length === 0 && <p className="item-sub">No expenses yet.</p>}

        {expenses.map(e => (
          <div
            key={e.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 140px",
              gap: 8,
              padding: "8px 0",
              borderTop: "1px solid #eee",
            }}
          >
            <span>{e.description || e.label}</span>
            <span>${Number(e.amount).toFixed(2)}</span>
            <span>{e.paidBy?.name || e.paidBy?.email || "—"}</span>
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
