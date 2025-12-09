import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GroupForm from '../components/GroupForm';
import { useApp } from '../context/AppContext';

export default function CreateGroup() {
  const { createGroup, user } = useApp();
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="content-narrow">
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Create Group</h1>
      <p className="item-sub">
        Name your household, pick components, and set quiet hours.
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

      <GroupForm 
        onSubmit={handleSubmit} 
        submitLabel={loading ? "Creating..." : "Save"} 
        disabled={loading}
      />
    </div>
  );
}

