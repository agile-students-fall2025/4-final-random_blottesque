import { useNavigate, useParams } from "react-router-dom";

export default function EditExpense() {
  const nav = useNavigate();
  const { expenseId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    nav("/expenses");
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1 className="section-title" style={{ marginTop: 0 }}>Edit Expense</h1>
      <p className="item-sub">Expense ID: {expenseId}</p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div className="item-sub">Description</div>
          <input className="input" placeholder="e.g., Groceries at Trader Joe’s" />
        </label>

        <label>
          <div className="item-sub">Amount ($)</div>
          <input className="input" placeholder="0.00" type="number" step="0.01" />
        </label>

        <label>
          <div className="item-sub">Paid by (name or email)</div>
          <input className="input" placeholder="you@roomie.com" />
        </label>

        <label>
          <div className="item-sub">Date</div>
          <input className="input" type="date" />
        </label>

        
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" />
          <span className="item-sub">Also add this purchase to Inventory (placeholder)</span>
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={() => nav("/expenses")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
