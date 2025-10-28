import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');

  function handleSignup(e) {
    e.preventDefault();
    nav('/dashboard');
  }

  return (
    <div style={{display:'grid', gap:12, maxWidth:300, margin:'80px auto'}}>
      <h1 style={{margin:0}}>Sign Up</h1>

      <form onSubmit={handleSignup} style={{display:'grid', gap:12}}>
        <input
          className="input"
          placeholder="Choose a username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <button className="btn btn-primary" type="submit">Create Account</button>
      </form>

      <p className="item-sub" style={{textAlign:'center'}}>
        Already have an account? <span className="link" onClick={()=>nav('/login')}>Log in</span>
      </p>
    </div>
  );
}
