import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GroupForm from '../components/GroupForm';
import { useApp } from '../context/AppContext';

export default function CreateGroup() {

  const { createGroup, api, refreshGroups, setActiveGroupId } = useApp();

  const nav = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinMode, setJoinMode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  async function handleSubmit(form) {
    setError('');
    setLoading(true);
    
    try {
      const g = await createGroup(form);
      nav(`/groups/${g._id || g.id}/edit`);
    } catch (err) {
      setError(err.message || 'Failed to create group');
      setLoading(false);
    }
  }

  async function handleJoinGroup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const joinedGroup = await api.joinGroupByCode(inviteCode.trim());
      await refreshGroups();
      
      // Set the newly joined group as active
      setActiveGroupId(joinedGroup._id || joinedGroup.id);
      
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to join group. Check the invite code.');
      setLoading(false);
    }
  }

  return (
    <div className="content-narrow">
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
        {joinMode ? 'Join a Group' : 'Create Group'}
      </h1>
      <p className="item-sub">

        {joinMode 
          ? 'Enter the invite code shared by your group.'
          : 'Name your household, add roommates, pick components, and set quiet hours.'
        }
      </p>

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

      {/* Toggle buttons */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 16,
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: 8
      }}>
        <button
          type="button"
          onClick={() => setJoinMode(false)}
          style={{
            padding: '8px 16px',
            background: !joinMode ? '#000000' : 'transparent',
            color: !joinMode ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          Create New Group
        </button>
        <button
          type="button"
          onClick={() => setJoinMode(true)}
          style={{
            padding: '8px 16px',
            background: joinMode ? '#000000' : 'transparent',
            color: joinMode ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          Join Existing Group
        </button>
      </div>

      {joinMode ? (
        // Join group form
        <form onSubmit={handleJoinGroup} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label className="item-sub">Invite Code</label>
            <input
              className="input"
              type="text"
              placeholder="Enter 6-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
              disabled={loading}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => nav('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || inviteCode.length !== 6}
            >
              {loading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        </form>
      ) : (
        // Create group form
        <GroupForm 
          onSubmit={handleSubmit} 
          submitLabel={loading ? "Creating..." : "Save"} 
          disabled={loading}
        />
      )}
    </div>
  );
}