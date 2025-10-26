import { Wallet2 } from 'lucide-react';

export default function ExpenseList({ expenses = [] }) {
  return (
    <section className="card">
      <h3 className="section-title" style={{display:'flex',alignItems:'center',gap:8}}>
        <Wallet2 size={16}/> Expenses
      </h3>
      <ul className="list">
        {expenses.map(e => (
          <li key={e.id} className="list-item" style={{padding:'8px 0'}}>
            <div>
              <div className="item-title">{e.label}</div>
              <div className="item-sub">{new Date(e.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:800}}>${e.amount.toFixed(2)}</div>
              <div className="item-sub" style={{color: e.youOwe ? '#e11d48' : '#059669'}}>
                {e.youOwe ? 'You owe' : "You're owed"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
