import { CheckSquare, Square } from 'lucide-react';

export default function ChoreList({ chores = [] }) {
  return (
    <section className="card">
      <h3 className="section-title">Chores</h3>
      <ul className="list">
        {chores.map(c => (
          <li key={c.id} className="list-item" style={{padding:'8px 0'}}>
            <div className="item-main">
              {c.done ? <CheckSquare size={18} color="#059669"/> : <Square size={18} color="#9ca3af"/>}
              <div>
                <div className="item-title">{c.title}</div>
                <div className="item-sub">{c.assignee} • due {new Date(c.due).toLocaleDateString()}</div>
              </div>
            </div>
            <span className={`badge ${c.done ? 'status-done' : 'status-pending'}`}>{c.done ? 'Done' : 'Pending'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
