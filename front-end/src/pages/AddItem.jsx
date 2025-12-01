import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function AddItem() {
  const nav = useNavigate();
  const { activeGroupId } = useApp();
  
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Good');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Item name is required');
      setLoading(false);
      return;
    }

    try {
      await api.createInventoryItem(activeGroupId, {
        name: name.trim(),
        status,
        info: info.trim()
      });
      nav(`/${activeGroupId}/inventory`);
    } catch (err) {
      setError(err.message || 'Failed to add item');
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h1 className="section-title" style={{marginTop:0}}>Add an Item</h1>

      {error && (
        <div style={{
          padding: '10px 14px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '14px',
          marginBottom: 12
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display:"grid", gap:12}}>
        <label>
          <div className="item-sub">Item Name *</div>
          <input 
            className="input" 
            placeholder="e.g., Milk, Paper towels"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label>
          <div className="item-sub">Status</div>
          <select 
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="Full">Full</option>
            <option value="Good">Good</option>
            <option value="Low">Low</option>
          </select>
        </label>

        <label>
          <div className="item-sub">Info (optional)</div>
          <textarea 
            className="input" 
            placeholder="Additional details about this item..."
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </label>

        <div style={{display:"flex", gap:8}}>
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={()=>nav(`/${activeGroupId}/inventory`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

