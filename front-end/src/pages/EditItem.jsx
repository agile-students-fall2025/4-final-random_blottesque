import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function EditItem() {
    const nav = useNavigate();
    const { itemId } = useParams();
    const { activeGroupId, getDashboard } = useApp();
    
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Good');
    const [info, setInfo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load item data
    useEffect(() => {
        const loadItem = async () => {
            try {
                const dashboard = await getDashboard(activeGroupId);
                const item = dashboard.inventory.find(i => (i._id || i.id) === itemId);
                
                if (item) {
                    setName(item.name || '');
                    setStatus(item.status || 'Good');
                    setInfo(item.info || '');
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load item');
            } finally {
                setLoading(false);
            }
        };

        if (activeGroupId && itemId) {
            loadItem();
        }
    }, [activeGroupId, itemId, getDashboard]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!name.trim()) {
            setError('Item name is required');
            setSaving(false);
            return;
        }

        try {
            await api.updateInventoryItem(activeGroupId, itemId, {
                name: name.trim(),
                status,
                info: info.trim()
            });
            nav(`/${activeGroupId}/inventory`);
        } catch (err) {
            setError(err.message || 'Failed to update item');
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        setSaving(true);
        try {
            await api.deleteInventoryItem(activeGroupId, itemId);
            nav(`/${activeGroupId}/inventory`);
        } catch (err) {
            setError(err.message || 'Failed to delete item');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
                <p className="item-sub">Loading item...</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Pencil size={20} /> Edit Item
            </h1>

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
                        disabled={saving}
                    />
                </label>

                <label>
                    <div className="item-sub">Status</div>
                    <select 
                        className="input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={saving}
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
                        disabled={saving}
                    />
                </label>

                <div style={{display:"flex", gap:8}}>
                    <button 
                        className="btn btn-primary" 
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-ghost" 
                        onClick={()=>nav(`/${activeGroupId}/inventory`)}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </div>

                <button 
                    type="button" 
                    className="btn" 
                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                    onClick={handleDelete}
                    disabled={saving}
                >
                    Delete Item
                </button>
            </form>
        </div>
    );
}
