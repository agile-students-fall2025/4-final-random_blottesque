import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';
import { Boxes, Image as ImageIcon, Users, FileText } from 'lucide-react';

export default function GroupInventory() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { loading, activeGroupId, getDashboard } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
    return () => { mounted = false; };
  }, [groupId]);

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!data) return <p className="item-sub">Inventory not found.</p>;

  async function handleSubmit(form) {
    //await updateGroup(groupId, form); // change //from useApp()
    alert('Group saved');
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{margin:0, fontSize:20, fontWeight:800}}>
        Inventory
      </h1>

      <ul className="list" style={{display:'grid', gap:12}}>
        {data.inventory.map(it => (
          <li key={it.id} className="card" style={{padding:10, boxShadow:'none', border:'1px solid var(--ring)'}}>

            <div className="inventory-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 100,
                padding: 8,
              }}>
              <div className="item-icon" style={{ marginRight: 12, display: 'flex', alignItems: 'center'  }}><Boxes size={80}/></div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  flex: 1,
                  alignItems: 'center', // centers horizontally in remaining space
                  height: '100%',
                  textAlign: 'center', // optional, for multiline text
              }}>
                <div className="item-name" style={{fontSize: 22, fontWeight: 500, paddingTop: 4, paddingBottom: 16, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{it.name}</div>
                <div className="item-sub" style={{fontSize: 15, color: '#555', marginBottom: 2}}>Status:</div>
                <div className="item-sub" style={{fontSize: 13, color: '#666', marginBottom: 2}}>{it.status}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="btn btn-ghost btn-full" onClick={()=>nav('/dashboard')}>HOME</button>
    </div>
  );
}

function QuickTile({ icon, title, subtitle, onClick }) { //make this create the item pages
  return (
    <button type="button" onClick={onClick} className="tile">
      <div>
        <div className="tile-title">{title}</div>
        <div className="tile-hint">{subtitle}</div>
      </div>
      <div className="tile-icon" style={{background:'var(--sky-50)', color:'var(--sky-600)'}}>
        {icon}
      </div>
    </button>
  );
}
