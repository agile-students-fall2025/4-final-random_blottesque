import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupForm from '../components/GroupForm';
import { useApp } from '../context/AppContext';
import { Image as ImageIcon, Users, FileText } from 'lucide-react';
import * as api from '../lib/api';

export default function EditGroup() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { updateGroup } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    
    const loadGroup = async () => {
      try {
        const g = await api.getGroup(groupId);
        if (mounted) {
          setGroup(g);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load group');
          setLoading(false);
        }
      }
    };

    loadGroup();
    return () => { mounted = false; };
  }, [groupId]);

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!group) return <p className="item-sub">Group not found.</p>;

  async function handleSubmit(form) {
    setError('');
    setSaving(true);
    
    try {
      await updateGroup(groupId, form);
      // Show success feedback
      alert('Group saved successfully!');
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save group');
      setSaving(false);
    }
  }

  // Transform group data to match form expectations
  const initialData = {
    name: group.name,
    description: group.description,
    inviteCode: group.inviteCode,
    roommates: group.roommates,
    components: Object.entries(group.components || {})
      .filter(([, v]) => v)
      .map(([k]) => k),
    quietHours: {
      start: group.prefs?.quietStart,
      end: group.prefs?.quietEnd
    },
    preferences: {
      temperatureF: group.prefs?.temperatureF,
      guestsAllowed: group.prefs?.guestsAllowed
    }
  };

  return (
    <div className="content-narrow">
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Edit Group</h1>

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

      {/* Invite Code Display */}
      {group.inviteCode && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="item-sub">Invite Code</div>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            letterSpacing: 4,
            fontFamily: 'monospace'
          }}>
            {group.inviteCode}
          </div>
          <div className="item-sub" style={{ marginTop: 4 }}>
            Share this code with roommates to invite them
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
        <QuickTile
          icon={<ImageIcon size={18} />}
          title="Edit Group Pic"
          subtitle="Placeholder – add photos next sprint"
          onClick={() => alert('Photo upload coming in a future sprint!')}
        />
        <QuickTile
          icon={<Users size={18} />}
          title="Edit Members List"
          subtitle="Use the roommates field in the form below"
          onClick={() => document.querySelector('textarea')?.focus()}
        />
        <QuickTile
          icon={<FileText size={18} />}
          title="Edit Description"
          subtitle="Use the form below"
          onClick={() => document.getElementById('desc-input')?.focus()}
        />
      </div>

      {/* Main form */}
      <GroupForm 
        initial={initialData} 
        onSubmit={handleSubmit} 
        submitLabel={saving ? "Saving..." : "Save Changes"} 
        disabled={saving}
      />

      <button className="btn btn-ghost btn-full" onClick={() => nav('/dashboard')}>
        Back to Dashboard
      </button>
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
      <div className="tile-icon" style={{ background: 'var(--sky-50)', color: 'var(--sky-600)' }}>
        {icon}
      </div>
    </button>
  );
}
