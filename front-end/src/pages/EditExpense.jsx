import { useNavigate, useParams } from "react-router-dom";

export default function EditExpense() {
  const nav = useNavigate();
  const { expenseId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/expenses");
  };

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Edit Expense</h1>
      <p className="item-sub">Expense ID: {expenseId}</p>
      <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="Description" />
        <input className="input" placeholder="Amount ($)" type="number" step="0.01" />
        <input className="input" placeholder="Paid by (name or email)" />
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button type="button" className="btn btn-secondary" onClick={()=>nav("/expenses")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

