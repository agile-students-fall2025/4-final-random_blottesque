import { useEffect, useState, useCallback } from 'react';
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

export default function Dashboard() {
  const nav = useNavigate();
  const { loading, getActiveGroup, activeGroupId, getDashboard, user, logout } = useApp();
  const group = getActiveGroup();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!activeGroupId) return;
    try {
      const dashboard = await getDashboard(activeGroupId);
      setData(dashboard);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard');
    }
  }, [activeGroupId, getDashboard]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  if (loading) return <p className="item-sub">Loading…</p>;
  
  if (!group) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <h2>Welcome to Roomier!</h2>
        <p className="item-sub">You don't have any groups yet.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => nav('/groups/new')}>
            Create Your First Group
          </button>
          <button className="btn btn-ghost" onClick={() => nav('/groups/join')}>
            Join a Group
          </button>
        </div>
      </div>
    </div>
  );
}

  if (!data) return <p className="item-sub">Loading dashboard…</p>;

  const choresDue = data.chores?.filter(c => !c.done).length || 0;
  const youOwe = data.expenses?.filter(e => e.youOwe).reduce((s, e) => s + (e.amount || 0), 0) || 0;
  const youreOwed = data.expenses?.filter(e => !e.youOwe).reduce((s, e) => s + (e.amount || 0), 0) || 0;

  // Preferences
  const quietStart = group?.prefs?.quietStart || data?.prefs?.quietStart;
  const quietEnd = group?.prefs?.quietEnd || data?.prefs?.quietEnd;
  const quietText =
    (fmtTime(quietStart) && fmtTime(quietEnd))
      ? `${fmtTime(quietStart)}–${fmtTime(quietEnd)}`
      : 'Set quiet hours';

  const tempF = group?.prefs?.temperatureF ?? data?.prefs?.temperatureF;
  const guests = group?.prefs?.guestsAllowed ?? data?.prefs?.guestsAllowed;
  const smoking = group?.prefs?.smokingAllowed ?? data?.prefs?.smokingAllowed;
  const drinking = group?.prefs?.drinkingAllowed ?? data?.prefs?.drinkingAllowed;
  const parties = group?.prefs?.partiesAllowed ?? data?.prefs?.partiesAllowed;
  const nightTimeGuests = group?.prefs?.nightTimeGuestsAllowed ?? data?.prefs?.nightTimeGuestsAllowed;
  const accomm = group?.prefs?.accommodations ?? data?.prefs?.accommodations;

  // Roommates
  const roommates = Array.isArray(group?.roommates) ? group.roommates : [];
  const rmLabel = (r) => (typeof r === 'string' ? r : (r?.name || r?.email || '—'));

  return (
    <div style={{ display: 'grid', gap: 12 }}>
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
        </div>
      )}

      {/* User Profile card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="tile-icon" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
            <UserRound size={18} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              Welcome<br/>{user?.name || user?.email || 'Guest'}
            </h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => nav('/user-profile')}>Profile</button>
          <button className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
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
          <div className="item-sub">Smoking</div>
          <div style={{ fontWeight: 800 }}>
            {smoking === true ? 'Allowed' : smoking === false ? 'Not allowed' : '—'}
          </div>
          <div className="item-sub">Drinking</div>
          <div style={{ fontWeight: 800 }}>
            {drinking === true ? 'Allowed' : drinking === false ? 'Not allowed' : '—'}
          </div>
          <div className="item-sub">Parties</div>
          <div style={{ fontWeight: 800 }}>
            {parties === true ? 'Allowed' : parties === false ? 'Not allowed' : '—'}
          </div>
          <div className="item-sub">Night Guests</div>
          <div style={{ fontWeight: 800 }}>
            {nightTimeGuests === true ? 'Allowed' : nightTimeGuests === false ? 'Not allowed' : '—'}
          </div>
          <div className="item-sub">Accomodations</div>
          <div style={{ fontWeight: 800 }}>
            {accomm === 'None' || accomm === '' ? 'None' : accomm}
          </div>
          <button className="btn btn-ghost" onClick={() => nav(`/groups/${activeGroupId}/edit?tab=prefs`)}>
            EDIT PREFERENCES
          </button>
        </section>

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
          value={`${data.inventory?.length || 0} items`}
          icon={Boxes}
          variant="sky"
          onClick={() => nav(`/${activeGroupId}/inventory`)}
        />
      </div>
    </div>
  );
}
