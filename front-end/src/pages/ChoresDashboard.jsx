import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckSquare, Square, ListChecks, Pencil, PlusSquare, Trash2 } from 'lucide-react';
import * as api from '../lib/api';

export default function ChoresDashboard() {
    const nav = useNavigate();
    const { loading, getActiveGroup, activeGroupId, getDashboard } = useApp();
    const group = getActiveGroup();
    const [data, setData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');

    // Load chores data
    const loadData = useCallback(async () => {
        if (!activeGroupId) return;
        try {
            const dashboard = await getDashboard(activeGroupId);
            setData(dashboard);
        } catch (err) {
            setError(err.message || 'Failed to load chores');
        }
    }, [activeGroupId, getDashboard]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Toggle chore done status via API
    const toggleDone = async (choreId) => {
        const chore = data.chores?.find(c => (c._id || c.id) === choreId);
        if (!chore) return;

        try {
            await api.updateChore(activeGroupId, choreId, { done: !chore.done });
            // Update local state
            setData(prevData => ({
                ...prevData,
                chores: prevData.chores.map(c => 
                    (c._id || c.id) === choreId ? { ...c, done: !c.done } : c
                ),
            }));
        } catch (err) {
            setError(err.message || 'Failed to update chore');
        }
    };

    // Delete chore via API
    const handleDelete = async (choreId) => {
        if (!window.confirm('Delete this chore?')) return;
        
        try {
            await api.deleteChore(activeGroupId, choreId);
            setData(prevData => ({
                ...prevData,
                chores: prevData.chores.filter(c => (c._id || c.id) !== choreId),
            }));
        } catch (err) {
            setError(err.message || 'Failed to delete chore');
        }
    };

    if (loading || !group) return <p className="item-sub">Loading...</p>;

    const chores = data.chores || [];
    const currentUserEmail = chores[0]?.assignee; // Simple heuristic for now
    const yourChores = chores.filter(c => c.assignee === currentUserEmail);
    const roommateChores = chores.filter(c => c.assignee !== currentUserEmail);

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
                    <button 
                        onClick={() => setError('')}
                        style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className='card' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="tile-icon" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                        <ListChecks size={18} />
                    </div>
                    <div>
                        <div className="item-sub">{group.name}</div>
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Chores</h1>
                    </div>
                </div>
            </div>

            <div className='card' style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: 20 }}>
                <button className='btn btn-primary' onClick={() => nav('/chores/add')}>
                    <PlusSquare size={16} /> Add Chore
                </button>
                <button className='btn btn-ghost' onClick={() => setEditMode(!editMode)}>
                    <Pencil size={16} /> {editMode ? 'Done Editing' : 'Edit Chores'}
                </button>
            </div>

            {/* Your chores section */}
            <section className='card'>
                <h2 className='section-title'>Your Upcoming Chores</h2>
                {yourChores.length === 0 ? (
                    <div className='item-sub'>Nothing yet! Click "Add Chore" to create one.</div>
                ) : (
                    <ul className='list'>
                        {yourChores.map(c => (
                            <li key={c._id || c.id} className='list-item' style={{ padding: '8px 0' }}>
                                <div className="item-main" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {c.done ? (
                                        <CheckSquare 
                                            size={18} 
                                            color='#059669' 
                                            onClick={() => toggleDone(c._id || c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                        <Square
                                            size={18}
                                            color="#9ca3af"
                                            onClick={() => toggleDone(c._id || c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                    <div>
                                        <div className='item-title' style={{ textDecoration: c.done ? 'line-through' : 'none' }}>
                                            {c.title}
                                        </div>
                                        <div className='item-sub'>
                                            {c.due ? `due ${new Date(c.due).toLocaleDateString()}` : 'No due date'}
                                        </div>
                                    </div>
                                </div>
                                {editMode && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className='btn btn-ghost' onClick={() => nav(`/chores/${c._id || c.id}/edit`)}>
                                            <Pencil size={14} />
                                        </button>
                                        <button className='btn btn-ghost' onClick={() => handleDelete(c._id || c.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            
            {/* Roommate chores section */}
            <section className='card'>
                <h2 className='section-title'>Roommate Chores</h2>
                {roommateChores.length === 0 ? (
                    <div className='item-sub'>No roommate chores yet.</div>
                ) : (
                    <ul className='list'>
                        {roommateChores.map(c => (
                            <li key={c._id || c.id} className='list-item' style={{ padding: '8px 0' }}>
                                <div className="item-main" style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    {c.done ? (
                                        <CheckSquare
                                            size={18}
                                            color="#059669"
                                            onClick={() => toggleDone(c._id || c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                        <Square
                                            size={18}
                                            color="#9ca3af"
                                            onClick={() => toggleDone(c._id || c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                    <div>
                                        <div className='item-title' style={{ textDecoration: c.done ? 'line-through' : 'none' }}>
                                            {c.title}
                                        </div>
                                        <div className='item-sub'>
                                            {c.assignee} • {c.due ? `due ${new Date(c.due).toLocaleDateString()}` : 'No due date'}
                                        </div>
                                    </div>
                                </div>
                                {editMode && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className='btn btn-ghost' onClick={() => nav(`/chores/${c._id || c.id}/edit`)}>
                                            <Pencil size={14} />
                                        </button>
                                        <button className='btn btn-ghost' onClick={() => handleDelete(c._id || c.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
