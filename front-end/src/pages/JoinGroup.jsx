import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function JoinGroup() {
  const nav = useNavigate();
  const { api, refreshGroups } = useApp();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.joinGroupByCode(inviteCode.trim());
      await refreshGroups();
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to join group. Check the invite code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 400, margin: '40px auto' }}>
      <h1 style={{ margin: 0 }}>Join a Group</h1>
      <p className="item-sub">Enter the invite code shared by your group.</p>

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
        </div>
      )}

      <form onSubmit={handleJoin} style={{ display: 'grid', gap: 12 }}>
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
    </div>
  );
}