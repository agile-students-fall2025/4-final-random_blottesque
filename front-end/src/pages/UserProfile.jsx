import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRound, Mail, Phone, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImageUpload from '../components/ImageUpload';
import * as api from '../lib/api';
import { getImageUrl } from '../lib/image';

export default function UserProfile() {
  const nav = useNavigate();
  const { userId: viewedUserId } = useParams();
  const [viewedUser, setViewedUser] = useState(null);
  const { user, setUser, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isCurrentUser = !viewedUserId || viewedUserId === user?._id?.toString() || viewedUserId === user?.id?.toString();

  const handleLoadUser = async () => {
    setLoading(true);
    if (isCurrentUser) {
      setViewedUser(user);

      if (user) {
        setName(user.name || '');
        setPhone(user.phone || '');
      }
    }
    else {
      try {
        const fetchedUser = await api.getUser(viewedUserId);
        setViewedUser(fetchedUser);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Load user error:', err);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    handleLoadUser();
  }, [viewedUserId, user, isCurrentUser]);

  const handleSave = async () => {
    if (!user?._id && !user?.id) return;
    
    setSaving(true);
    setError('');
    
    try {
      const userId = user._id || user.id;
      const updatedUser = await api.updateUser(userId, { name, phone });

      setEditing(false);

      if (updatedUser) {
        setUser({ ...user, ...updatedUser });
        setViewedUser({ ...user, ...updatedUser });
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

  const handleImageUploadSuccess = (data) => {
    if (data.user) {
      setUser({ ...user, ...data.user });
      setViewedUser({ ...user, ...data.user });
      localStorage.setItem(
        'roomier_user',
        JSON.stringify({ ...user, ...data.user })
      );
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

  if (!viewedUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <p>User not found.</p>
        <button className="btn btn-primary" onClick={() => nav('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <p>Loading profile</p>
      </div>
    )
  }

  const userId = viewedUser._id || viewedUser.id;

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
          {/* Profile Picture Upload */}

          {isCurrentUser ? (
            <ImageUpload
              type="profile"
              id={userId}
              currentImage={user.photoUrl}
              onUploadSuccess={handleImageUploadSuccess}
              size="lg"
              placeholder={<UserRound size={48} color="var(--indigo-600)" />}
            />
          ) : (
            <div>
              {viewedUser.photoUrl ? (
                <img
                  src={getImageUrl(viewedUser.photoUrl)}
                  alt={'Profile'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <UserRound size={48} color="var(--indigo-600)" />
              )}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            {editing && isCurrentUser ? (
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
                  {viewedUser.name || 'User'}
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  color: '#666',
                  marginBottom: 4,
                  justifyContent: 'center'
                }}>
                  <Mail size={16} />
                  {viewedUser.email}
                </div>

                {viewedUser.phone && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    color: '#666',
                    marginBottom: 16,
                    justifyContent: 'center'
                  }}>
                    <Phone size={16} />
                    {viewedUser.phone}
                  </div>
                )}
                
                {isCurrentUser && (
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setEditing(true)}
                    style={{ marginTop: 12 }}
                  >
                    Edit Profile
                  </button>
                )}

              </>
            )}
          </div>
        </div>
      </section>

      <button className="btn btn-primary btn-full" onClick={() => nav('/dashboard')}>
        Back to Dashboard
      </button>

      {isCurrentUser && (
        <button 
          className="btn btn-ghost btn-full" 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      )}
    </div>
  );
}
