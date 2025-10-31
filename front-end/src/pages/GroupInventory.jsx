import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventorySlot from '../components/InventorySlot';

import { useApp } from '../context/AppContext';
import { Boxes } from 'lucide-react';

export default function GroupInventory() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { loading, activeGroupId, getActiveGroup, getDashboard } = useApp();
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const group = getActiveGroup();

  useEffect(() => {
    let mounted = true;
    if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
    return () => { mounted = false; };
  }, [groupId]);

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!data) return <p className="item-sub">Inventory not found.</p>;

  const handleSelect = (id) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{margin:0, fontSize:20, fontWeight:800}}>
        Inventory
      </h1>

      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="tile-icon" style={{ background: "var(--sky-50)", color: "var(--sky-600)" }}>
            <Boxes size={18} />
          </div>
          <div>
            <div className="item-sub">Group</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, overflow:'hidden', textOverflow:'ellipsis'}}>{group.name}</h1>
          </div>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-primary" onClick={() => nav("/${activeGroupId}/inventory/new")}>
            Add Item
          </button>
          <button className="btn btn-primary" onClick={() => alert('Editing items')}>
            Edit Item
          </button>
        </div>
      </div>

      <ul className="list" style={{display:'grid', gap:12}}>
        {data.inventory.map(it => (
          <InventorySlot
          key={it.id}
          item={it}
          isActive={activeId === it.id}
          onSelect={() => handleSelect(it.id)}
        />
        ))}
      </ul>

      <button className="btn btn-ghost btn-full" onClick={()=>nav('/dashboard')}>HOME</button>
    </div>
  );
}

