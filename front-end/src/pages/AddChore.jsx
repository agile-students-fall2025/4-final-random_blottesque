import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PlusSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function AddChore() {
    const nav = useNavigate();
    const { activeGroupId, getActiveGroup } = useApp();
    const group = getActiveGroup();
    
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [due, setDue] = useState('');
    const [repeat, setRepeat] = useState('None');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!title.trim()) {
            setError('Title is required');
            setLoading(false);
            return;
        }

        try {
            await api.createChore(activeGroupId, {
                title: title.trim(),
                assignee: assignee || null,
                due: due || null,
                repeat,
                description: description.trim()
            });
            nav("/chores");
        } catch (err) {
            setError(err.message || 'Failed to create chore');
            setLoading(false);
        }
    };

    // Get roommates for assignee dropdown
    const roommates = group?.roommates || [];

    return (
        <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 className="section-title" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusSquare size={20} /> Add a Chore
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
                        disabled={loading}
                    />
                </label>

                <label>
                    <div className="item-sub">Assignee</div>
                    <select 
                        className="input"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        disabled={loading}
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
                        disabled={loading}
                    />
                </label>

                <label>
                    <div className="item-sub">Repeat Schedule</div>
                    <select 
                        className="input"
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        disabled={loading}
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
                        disabled={loading}
                    />
                </label>
                
                <div style={{ display: "flex", gap: 8 }}>
                    <button 
                        className="btn btn-primary" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Chore'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-ghost" 
                        onClick={() => nav("/chores")}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
