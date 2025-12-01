import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function EditChore() {
    const nav = useNavigate();
    const { choreId } = useParams();
    const { activeGroupId, getActiveGroup, getDashboard } = useApp();
    const group = getActiveGroup();
    
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [due, setDue] = useState('');
    const [repeat, setRepeat] = useState('None');
    const [description, setDescription] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load chore data
    useEffect(() => {
        const loadChore = async () => {
            try {
                const dashboard = await getDashboard(activeGroupId);
                const chore = dashboard.chores.find(c => (c._id || c.id) === choreId);
                
                if (chore) {
                    setTitle(chore.title || '');
                    setAssignee(chore.assignee || '');
                    setDue(chore.due ? new Date(chore.due).toISOString().split('T')[0] : '');
                    setRepeat(chore.repeat || 'None');
                    setDescription(chore.description || '');
                    setDone(chore.done || false);
                } else {
                    setError('Chore not found');
                }
            } catch (err) {
                setError(err.message || 'Failed to load chore');
            } finally {
                setLoading(false);
            }
        };

        if (activeGroupId && choreId) {
            loadChore();
        }
    }, [activeGroupId, choreId, getDashboard]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!title.trim()) {
            setError('Title is required');
            setSaving(false);
            return;
        }

        try {
            await api.updateChore(activeGroupId, choreId, {
                title: title.trim(),
                assignee: assignee || null,
                due: due || null,
                repeat,
                description: description.trim(),
                done
            });
            nav("/chores");
        } catch (err) {
            setError(err.message || 'Failed to update chore');
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this chore?')) {
            return;
        }

        setSaving(true);
        try {
            await api.deleteChore(activeGroupId, choreId);
            nav("/chores");
        } catch (err) {
            setError(err.message || 'Failed to delete chore');
            setSaving(false);
        }
    };

    const roommates = group?.roommates || [];

    if (loading) {
        return (
            <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
                <p className="item-sub">Loading chore...</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Pencil size={20} /> Edit Chore
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

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    <div className="item-sub">Title *</div>
                    <input 
                        className="input" 
                        placeholder="e.g., Take out trash"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={saving}
                    />
                </label>

                <label>
                    <div className="item-sub">Assignee</div>
                    <select 
                        className="input"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        disabled={saving}
                    >
                        <option value="">Select assignee</option>
                        {roommates.map((rm, i) => (
                            <option key={i} value={rm}>{rm}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <div className="item-sub">Due Date</div>
                    <input 
                        className="input" 
                        type="date"
                        value={due}
                        onChange={(e) => setDue(e.target.value)}
                        disabled={saving}
                    />
                </label>

                <label>
                    <div className="item-sub">Repeat Schedule</div>
                    <select 
                        className="input"
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        disabled={saving}
                    >
                        <option value="None">None</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </label>

                <label>
                    <div className="item-sub">Description</div>
                    <textarea 
                        className="input" 
                        placeholder="Add details about this chore..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        disabled={saving}
                    />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                        type="checkbox"
                        checked={done}
                        onChange={(e) => setDone(e.target.checked)}
                        disabled={saving}
                    />
                    <span>Mark as completed</span>
                </label>
                
                <div style={{ display: "flex", gap: 8 }}>
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
                        onClick={() => nav("/chores")}
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
                    Delete Chore
                </button>
            </form>
        </div>
    );
}
