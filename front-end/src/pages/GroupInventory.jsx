import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Boxes, Pencil, Trash2, Plus } from 'lucide-react';
import * as api from '../lib/api';

export default function GroupInventory() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { loading, activeGroupId, getActiveGroup, getDashboard } = useApp();
  const [data, setData] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState('');
  const group = getActiveGroup();

  const loadData = useCallback(async () => {
    const gid = groupId || activeGroupId;
    if (!gid) return;
    try {
      const dashboard = await getDashboard(gid);
      setData(dashboard);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    }
  }, [groupId, activeGroupId, getDashboard]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    
    const gid = groupId || activeGroupId;
    try {
      await api.deleteInventoryItem(gid, itemId);
      setData(prevData => ({
        ...prevData,
        inventory: prevData.inventory.filter(i => (i._id || i.id) !== itemId),
      }));
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  const handleSelect = (id) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const gid = groupId || activeGroupId;

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!data) return <p className="item-sub">Loading inventory…</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Low': return { bg: '#fee2e2', color: '#dc2626' };
      case 'Good': return { bg: '#fef3c7', color: '#b45309' };
      case 'Full': return { bg: '#d1fae5', color: '#059669' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <div style={{display:'grid', gap:12}}>
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
          <button onClick={() => setError('')} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="tile-icon" style={{ background: "var(--sky-50)", color: "var(--sky-600)" }}>
            <Boxes size={18} />
          </div>
          <div>
            <div className="item-sub">Group</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, overflow:'hidden', textOverflow:'ellipsis'}}>
              {group?.name || 'Inventory'}
            </h1>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => nav(`/${gid}/inventory/new`)}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {data.inventory?.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <p className="item-sub">No items in inventory yet.</p>
          <button className="btn btn-primary" onClick={() => nav(`/${gid}/inventory/new`)}>
            Add Your First Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {data.inventory?.map(item => {
            const statusStyle = getStatusColor(item.status);
            const isActive = activeId === (item._id || item.id);
            
            return (
              <div 
                key={item._id || item.id} 
                className="card" 
                style={{ 
                  padding: 12, 
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--sky-600)' : '1px solid var(--ring)',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleSelect(item._id || item.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 12, 
                    background: 'var(--sky-50)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Boxes size={28} color="var(--sky-600)" />
                  </div>
                  
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%'
                  }}>
                    {item.name}
                  </div>
                  
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: statusStyle.bg,
                    color: statusStyle.color
                  }}>
                    {item.status}
                  </span>

                  {isActive && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '6px 10px', height: 'auto' }}
                        onClick={(e) => { e.stopPropagation(); nav(`/${gid}/inventory/${item._id || item.id}/edit`); }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '6px 10px', height: 'auto' }}
                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id || item.id); }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
