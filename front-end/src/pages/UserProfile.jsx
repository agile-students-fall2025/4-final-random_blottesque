import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, Mail, Phone, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as api from '../lib/api';

export default function UserProfile() {
  const nav = useNavigate();
  const { user, setUser, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?._id) return;
    
    setSaving(true);
    setError('');
    
    try {
      const updatedUser = await api.updateUser(user._id, { name, phone });

      setEditing(false);

      if (updatedUser) {
        setUser({ ...user, ...updatedUser });
      }

      localStorage.setItem(
        'roomier_user',
        JSON.stringify({ ...user, ...updatedUser })
      );
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <p>Please log in to view your profile.</p>
        <button className="btn btn-primary" onClick={() => nav('/login')}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div style={{display:'grid', gap:12}}>
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

      <section className="card">
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: 20
        }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: 'var(--indigo-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <UserRound size={48} color="var(--indigo-600)" />
          </div>

          {editing ? (
            <div style={{ width: '100%', maxWidth: 300 }}>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div className="item-sub" style={{ textAlign: 'left' }}>Name</div>
                <input 
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div className="item-sub" style={{ textAlign: 'left' }}>Phone</div>
                <input 
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                {user.name || 'User'}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                color: '#666',
                marginBottom: 4
              }}>
                <Mail size={16} />
                {user.email}
              </div>

              {user.phone && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  color: '#666',
                  marginBottom: 16
                }}>
                  <Phone size={16} />
                  {user.phone}
                </div>
              )}

              <button 
                className="btn btn-ghost"
                onClick={() => setEditing(true)}
                style={{ marginTop: 12 }}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </section>

      <button className="btn btn-primary btn-full" onClick={() => nav('/dashboard')}>
        Back to Dashboard
      </button>

      <button 
        className="btn btn-ghost btn-full" 
        onClick={handleLogout}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <LogOut size={18} />
        Sign Out
      </button>

      
    </div>
  );
}
