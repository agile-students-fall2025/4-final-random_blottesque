import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    nav('/dashboard');
  }

  return (
    <div style={{display:'grid', gap:12, maxWidth:300, margin:'80px auto'}}>
      <h1 style={{margin:0}}>Log In</h1>

      <form onSubmit={handleLogin} style={{display:'grid', gap:12}}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <button className="btn btn-primary" type="submit">Log In</button>
      </form>

      <p className="item-sub" style={{textAlign:'center'}}>
        Don't have an account? <span className="link" onClick={()=>nav('/signout')}>Sign up</span>
      </p>
    </div>
  );
}
