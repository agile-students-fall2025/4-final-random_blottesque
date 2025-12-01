import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SignupPage() {
  const nav = useNavigate();
  const { signup } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, name || undefined);
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:'grid', gap:12, maxWidth:300, margin:'80px auto'}}>
      <h1 style={{margin:0}}>Sign Up</h1>

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

      <form onSubmit={handleSignup} style={{display:'grid', gap:12}}>
        <input
          className="input"
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          className="input"
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />

        <button 
          className="btn btn-primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="item-sub" style={{textAlign:'center'}}>
        Already have an account?{' '}
        <span 
          className="link" 
          onClick={()=>nav('/login')}
          style={{cursor: 'pointer', color: 'var(--indigo-600)', textDecoration: 'underline'}}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
