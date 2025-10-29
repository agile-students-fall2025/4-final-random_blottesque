import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import ChoreList from '../components/ChoreList';
import ExpenseList from '../components/ExpenseList';
import InventoryList from '../components/InventoryList';
import { UserRound, SlidersHorizontal, ListChecks, Wallet2, Boxes } from 'lucide-react';

function fmtTime(t) {
  if (!t || typeof t !== 'string') return null;
  const [H, M = '00'] = t.split(':');
  const h = Number(H);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = (h % 12) || 12;
  return `${hour12}:${M.padStart(2, '0')} ${ampm}`;
}

export default function Dashboard() {
  const nav = useNavigate();
  const { loading, getActiveGroup, activeGroupId, getDashboard } = useApp();
  const group = getActiveGroup();
  const [data, setData] = useState(null);

  const inventoryRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
    return () => { mounted = false; };
  }, [activeGroupId, getDashboard]);

  if (loading || !group || !data) return <p className="item-sub">Loading…</p>;

  const choresDue = data.chores.filter(c => !c.done).length;
  const youOwe = data.expenses.filter(e => e.youOwe).reduce((s, e) => s + e.amount, 0);
  const youreOwed = data.expenses.filter(e => !e.youOwe).reduce((s, e) => s + e.amount, 0);

  // NEW: compute tile text for quiet hours (from the group object saved via GroupForm)
  const quietStart = group?.quietStart ?? data?.prefs?.quietStart;
  const quietEnd   = group?.quietEnd   ?? data?.prefs?.quietEnd;
  const quietText  = (fmtTime(quietStart) && fmtTime(quietEnd))
    ? `${fmtTime(quietStart)}–${fmtTime(quietEnd)}`
    : 'Set quiet hours';

  const focusInventory = () => {
    if (inventoryRef.current) {
      inventoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      inventoryRef.current.classList.add('flash-ring');
      setTimeout(() => inventoryRef.current && inventoryRef.current.classList.remove('flash-ring'), 900);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Header card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="tile-icon" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
            <UserRound size={18} />
          </div>
          <div>
            <div className="item-sub">Group</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{group.name}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => nav(`/groups/${activeGroupId}/edit`)}>EDIT</button>
          <button className="btn btn-secondary" onClick={() => nav('/signout')}>Sign Out</button>
        </div>
      </div>

      {/* Roommate info pill */}
      <button className="pill" onClick={() => nav(`/groups/${activeGroupId}/edit?tab=members`)}>Roommate Information</button>

      {/* Feature tiles */}
      <div className="grid-2">
        <StatCard
          title="Preferences"
          value={quietText}            // <-- FIX: show quiet hours instead of empty string
          icon={SlidersHorizontal}
          variant="emerald"
          onClick={() => nav(`/groups/${activeGroupId}/edit?tab=prefs`)}
        />
        <StatCard
          title="Chores"
          value={`${choresDue} due`}
          icon={ListChecks}
          variant="indigo"
          onClick={() => nav('/chores')}
        />
        <StatCard
          title="Expenses"
          value={`-$${youOwe.toFixed(0)}/+$${youreOwed.toFixed(0)}`}
          hint="You owe / You're owed"
          icon={Wallet2}
          variant="rose"
          onClick={() => nav('/expenses')}
        />
        <StatCard
          title="Inventory"
          value={`${data.inventory.length} items`}
          icon={Boxes}
          variant="sky"
          onClick={() => nav(`/groups/${activeGroupId}/inventory`)} // <-- FIX: backticks/template literal
        />
      </div>

      {/* Lists */}
      <ChoreList chores={data.chores} />
      <ExpenseList expenses={data.expenses} />

      <div ref={inventoryRef}>
        <InventoryList items={data.inventory} />
      </div>
    </div>
  );
}
