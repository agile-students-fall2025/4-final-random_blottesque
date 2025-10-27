import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupForm from '../components/GroupForm';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Users, FileText } from 'lucide-react';

export default function EditGroup() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { updateGroup } = useApp();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('../lib/mockApi').then(api =>
      api.getGroup(groupId).then(g => { if (mounted) { setGroup(g); setLoading(false); }})
    );
    return () => { mounted = false; };
  }, [groupId]);

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!group) return <p className="item-sub">Group not found.</p>;

  async function handleSubmit(form) {
    await updateGroup(groupId, form);
    alert('Group saved');
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{margin:0, fontSize:20, fontWeight:800}}>Edit Group</h1>

      <div style={{display:'grid', gap:12}}>
        <QuickTile icon={<ImageIcon size={18}/>} title="Edit Group Pic" subtitle="Placeholder – add photos next sprint" onClick={()=>alert('Add photo later')}/>
        <QuickTile icon={<Users size={18}/>} title="Edit Members List" subtitle="Open roommates editor" onClick={()=>alert('Members editor next sprint')}/>
        <QuickTile icon={<FileText size={18}/>} title="Edit Description" subtitle="Use the form below" onClick={()=>document.getElementById('desc-input')?.focus()}/>
      </div>

      <GroupForm initial={group} onSubmit={handleSubmit} submitLabel="Save Changes" />

      <button className="btn btn-ghost btn-full" onClick={()=>nav('/dashboard')}>HOME</button>
    </div>
  );
}

function QuickTile({ icon, title, subtitle, onClick }) {
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
