import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const nav = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Sprint 1: no persistence; navigate back
    nav("/expenses");
  };

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Add an Expense</h1>
      <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
        <input className="input" placeholder="Description" />
        <input className="input" placeholder="Amount ($)" type="number" step="0.01" />
        <input className="input" placeholder="Paid by (name or email)" />
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-primary" type="submit">Add Expense</button>
          <button type="button" className="btn btn-secondary" onClick={()=>nav("/expenses")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

