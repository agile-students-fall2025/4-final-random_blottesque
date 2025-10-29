import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, PlusCircle, Settings, Boxes } from 'lucide-react';

export default function Layout({ children }) {
  const { groups, activeGroupId, setActiveGroupId } = useApp();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/dashboard" className="brand">Roomier</Link>
          <select
            className="group-select"
            aria-label="Select group"
            value={activeGroupId ?? ''}
            onChange={(e) => setActiveGroupId(e.target.value)}
          >
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </header>

      <main className="shell-main">{children}</main>

      <nav className="bottombar">
        <div className="bottombar-inner">
          <Tab to="/dashboard" icon={<Home size={18}/>} label="Dashboard" />
          <Tab to="/groups/new" icon={<PlusCircle size={18}/>} label="New Group" />
          <Tab to={`/groups/${activeGroupId || ''}/edit`} icon={<Settings size={18}/>} label="Edit Group" />
        </div>
      </nav>
    </div>
  );
}

function Tab({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
