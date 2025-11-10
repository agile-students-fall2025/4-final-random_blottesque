import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckSquare, Square, ListChecks, Pencil, PlusSquare, Trash2 } from 'lucide-react';

export default function ChoresDashboard() {
    const nav = useNavigate();
    const { loading, getActiveGroup, activeGroupId, getDashboard } = useApp();
    const group = getActiveGroup();
    const [data, setData] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (activeGroupId) getDashboard(activeGroupId).then(d => mounted && setData(d));
        return () => { mounted = false; };
    }, [activeGroupId, getDashboard]);

    if (loading || !group || !data) return <p className="item-sub">Loading...</p>;

    const chores = data.chores || [];
    const currentUser = chores[0];
    const yourChores = chores.filter(c => c.assignee === currentUser.assignee);
    const roommateChores = chores.filter(c => c.assignee !== currentUser.assignee);
    const toggleDone = (id) => {
        setData(prevData => ({
            ...prevData,
            chores: prevData.chores.map(c => c.id === id ? { ...c, done: !c.done } : c
            ),
        }));
    };

    return (
        <div style={{ display: 'grid', gap: 12 }}>
            <div className='card' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="tile-icon" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
                        <ListChecks size={18}></ListChecks>
                    </div>
                    <div>
                        <div className="item-sub">{group.name}</div>
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Chores</h1>
                    </div>
                </div>
            </div>

            <div className='card' style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: 20 }}>
                <button className='btn btn-primary' onClick={() => nav('/chores/add')}>
                    <PlusSquare size={16}></PlusSquare>Add Chore
                </button>
                <button className='btn btn-primary' onClick={() => setEditMode(!editMode)}>
                    <Pencil size={16}></Pencil>{editMode ? 'Done Editing' : 'Edit Chores'}
                </button>
            </div>

            {/*Your chores section */}
            <section className='card'>
                <h2 className='section-title'>Your Upcoming Chores</h2>
                {yourChores.length === 0 ? <div className='item-sub'>Nothing yet!</div> :
                    <ul className='list'>
                        {yourChores.map(c => (
                            <li key={c.id} className='list-item' style={{ padding: '8px 0' }}>
                                <div className="item-main" style={{ dislay: 'flex', alignItems: 'center', gap: 8 }}>
                                    {c.done ? (
                                        <CheckSquare size={18} color='#059669' onClick={() => toggleDone(c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                            <Square
                                                size={18}
                                                color="#9ca3af"
                                                onClick={() => toggleDone(c.id)}
                                                style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                    <div>
                                        <div className='item-title'>{c.title}</div>
                                        <div className='item-sub'>due {new Date(c.due).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {editMode && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className='btn btn-ghost' onClick={() => nav(`/chores/${c.id}/edit`)}>
                                            <Pencil size={14}></Pencil>
                                        </button>
                                        <button className='btn btn-ghost' onClick={() => alert('Deleted chore')}>
                                            <Trash2 size={14}></Trash2>
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                }
            </section>
            
            {/*Roommate chores section */}
            <section className='card'>
                <h2 className='section-title'>Roommate Chores</h2>
                {roommateChores.length === 0 ? <div className='item-sub'>Nothing yet!</div> :
                    <ul className='list'>
                        {roommateChores.map(c => (
                            <li key={c.id} className='list-item' style={{ padding: '8px 0' }}>
                                <div className="item-main" style={{dislay:'flex', alignItems:'center', gap:8}}>
                                    {c.done ? (
                                        <CheckSquare
                                            size={18}
                                            color="#059669"
                                            onClick={() => toggleDone(c.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                            <Square
                                                size={18}
                                                color="#9ca3af"
                                                onClick={() => toggleDone(c.id)}
                                                style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                    <div>
                                        <div className='item-title'>{c.title}</div>
                                        <div className='item-sub'>{c.assignee} • due {new Date(c.due).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {editMode && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className='btn btn-ghost' onClick={() => nav(`/chores/${c.id}/edit)`)}>
                                            <Pencil size={14}></Pencil>
                                        </button>
                                        <button className='btn btn-ghost' onClick={() => alert('Deleted chore')}>
                                            <Trash2 size={14}></Trash2>
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                }
            </section>
        </div>
    )
}