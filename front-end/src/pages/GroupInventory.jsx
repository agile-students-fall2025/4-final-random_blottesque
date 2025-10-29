import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventorySlot from '../components/InventorySlot';
import { useApp } from '../context/AppContext';

export default function GroupInventory() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { loading, activeGroupId, getDashboard } = useApp();
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const id = groupId || activeGroupId;
    if (id) {
      getDashboard(id).then(d => mounted && setData(d));
    }
    return () => { mounted = false; };
  }, [groupId, activeGroupId, getDashboard]); // <-- include all used values

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!data) return <p className="item-sub">Inventory not found.</p>;

  const handleSelect = (id) => setActiveId(prev => (prev === id ? null : id));

  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{margin:0, fontSize:20, fontWeight:800}}>Inventory</h1>

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

      <button className="btn btn-ghost btn-full" onClick={() => nav('/dashboard')}>HOME</button>
    </div>
  );
}
