import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { UserRound, SlidersHorizontal, ListChecks, Wallet2, Boxes } from 'lucide-react';

function fmtTime(t) {
  if (!t || typeof t !== 'string') return null;
  const [H, M = '00'] = t.split(':');
  const h = Number(H);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = (h % 12) || 12;
  return `${hour12}:${M.padStart(2, '0')} ${ampm}`;
}

const c2f = (c) => Math.round((c * 9) / 5 + 32);

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

  // --- Preferences summary values ---
  const quietStart =
    group?.quietHours?.start ?? group?.quietStart ?? data?.prefs?.quietStart;
  const quietEnd =
    group?.quietHours?.end ?? group?.quietEnd ?? data?.prefs?.quietEnd;
  const quietText =
    (fmtTime(quietStart) && fmtTime(quietEnd))
      ? `${fmtTime(quietStart)}–${fmtTime(quietEnd)}`
      : 'Set quiet hours';

  const rawF =
    group?.preferences?.temperatureF ?? data?.prefs?.temperatureF;
  const rawC =
    group?.preferences?.temperatureC ?? data?.prefs?.temperatureC;
  const tempF = typeof rawF === 'number' ? rawF : (typeof rawC === 'number' ? c2f(rawC) : null);

  const guests = group?.preferences?.guestsAllowed ?? data?.prefs?.guestsAllowed;

  // --- Roommates summary ---
  const roommates = Array.isArray(group?.roommates) ? group.roommates : [];
  const rmLabel = (r) => (typeof r === 'string' ? r : (r?.name || r?.email || '—'));

  return (
    <div style={{ display: 'grid', gap: 12 }}>

      {/* User Profile card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="tile-icon" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
            <UserRound size={18} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Welcome<br/>_Username_</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => nav('/user-profile')}>Profile</button>
          <button className="btn btn-secondary" onClick={() => nav('/signout')}>Sign Out</button>
        </div>
      </div>

      {/* Group header */}
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
        </div>
      </div>

      {/* Preferences + Roommates summary cards */}
      <div className="grid-2">
        {/* Preferences summary card (keep) */}
        <section className="card" style={{ display: 'grid', gap: 8 }}>
          <h3 className="section-title" style={{ marginTop: 0 }}>Preferences</h3>
          <div className="item-sub">Quiet Hours</div>
          <div style={{ fontWeight: 800 }}>{quietText}</div>
          <div className="item-sub">Temperature</div>
          <div style={{ fontWeight: 800 }}>{typeof tempF === 'number' ? `${tempF}°F` : '—'}</div>
          <div className="item-sub">Guests</div>
          <div style={{ fontWeight: 800 }}>
            {guests === true ? 'Allowed' : guests === false ? 'Not allowed' : '—'}
          </div>
          <button className="btn btn-ghost" onClick={() => nav(`/groups/${activeGroupId}/edit?tab=prefs`)}>
            EDIT PREFERENCES
          </button>
        </section>

        {/* Roommates summary card */}
        <section className="card" style={{ display: 'grid', gap: 12 }}>
          <h3 className="section-title" style={{ margin: 0 }}>Roommates</h3>

          {roommates.length === 0 && (
            <p className="item-sub" style={{ margin: 0 }}>No roommates added yet.</p>
          )}

          {roommates.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {roommates.map((r, i) => (
                <span key={i} className="rm-chip rm-chip-lg">{rmLabel(r)}</span>
              ))}
            </div>
          )}

          <button
            className="btn btn-ghost"
            onClick={() => nav(`/groups/${activeGroupId}/edit?tab=members`)}
          >
            EDIT ROOMMATES
          </button>
        </section>
      </div>

      <div className="grid-2">
        <StatCard
          title="Preferences"
          value={quietText}
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
          onClick={() => nav(`/${activeGroupId}/inventory`)}
        />
      </div>
    </div>
  );
}
