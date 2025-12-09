import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GroupForm from '../components/GroupForm';
import ImageUpload from '../components/ImageUpload';
import { useApp } from '../context/AppContext';
import { Users, FileText, Home } from 'lucide-react';
import * as api from '../lib/api';

export default function EditGroup() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const { updateGroup, activeGroupId, refreshGroups } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');

  // Use groupId from params or fallback to activeGroupId
  const currentGroupId = groupId || activeGroupId;

  useEffect(() => {
    let mounted = true;
    
    const loadGroup = async () => {
      if (!currentGroupId) {
        setLoading(false);
        return;
      }
      
      try {
        const g = await api.getGroup(currentGroupId);
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
  }, [currentGroupId]);

  const handleImageUploadSuccess = async (data) => {
    if (data.group) {
      setGroup(data.group);
      // Refresh groups list to update sidebar
      await refreshGroups?.();
    }
  };

  if (loading) return <p className="item-sub">Loading…</p>;
  if (!group) return (
    <div className="card" style={{ textAlign: 'center', padding: 24 }}>
      <p>No group selected.</p>
      <button className="btn btn-primary" onClick={() => nav('/groups/new')}>
        Create a Group
      </button>
    </div>
  );

  async function handleSubmit(form) {
    setError('');
    setSaving(true);
    
    try {
      
      await updateGroup(currentGroupId, form);
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
      guestsAllowed: group.prefs?.guestsAllowed,
      smokingAllowed: group.prefs?.smokingAllowed,
      drinkingAllowed: group.prefs?.drinkingAllowed,
      partiesAllowed: group.prefs?.partiesAllowed,
      nightTimeGuestsAllowed: group.prefs?.nightTimeGuestsAllowed,
      accommodations: group.prefs?.accommodations
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

      {/* Group Picture Section */}
      <section className="card" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: 20,
        marginBottom: 12 
      }}>
        <h3 className="section-title" style={{ marginTop: 0 }}>Group Picture</h3>
        
        <ImageUpload
          type="group"
          id={currentGroupId}
          currentImage={group.photoUrl}
          onUploadSuccess={handleImageUploadSuccess}
          size="lg"
          placeholder={<Home size={48} color="var(--indigo-600)" />}
        />
      </section>

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
          icon={<Users size={18} />}
          title="Edit Members List"
          subtitle="Use the roommates field in the form below"
          onClick={() => {
            const el = document.getElementById('roomates-input');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.focus();
            }
          }}
        />
        <QuickTile
          icon={<FileText size={18} />}
          title="Edit Description"
          subtitle="Use the form below"
          onClick={() => {
            const el = document.getElementById('desc-input');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.focus();
            }
          }}
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
