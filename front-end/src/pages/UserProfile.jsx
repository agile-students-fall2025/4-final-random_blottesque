import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRound} from 'lucide-react';

import { useApp } from '../context/AppContext';

export default function UserProfile() {
  const nav = useNavigate();
  const { loading, activeGroupId, getDashboard } = useApp();

  useEffect(() => {
    let mounted = true;
    return () => { mounted = false; };
  });

  if (loading) return <p className="item-sub">Loading…</p>;

  return (
    <div style={{display:'grid', gap:12}}>
      <section className="card">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow:'none', border:'1px solid var(--ring)',
            
          }}
        >

          <img
            src="/favicon.ico"
            alt={"User Image"}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ccc",
              marginBottom: 12,
              marginTop: 30,
              marginBottom: 20
            }}
          />

          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 15,
            }}
          >
            User Name
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#666",
              marginBottom: 5,
            }}>
            Phone Number
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#666",
              marginBottom: 25,
            }}>
            Email
          </div>

          <div
          style={{
              marginBottom: 25,
            }}>
            <button className="btn btn-ghost btn-full" onClick={()=>alert('User settings in future sprint')}>Settings</button>
          </div>
          
        </div>

      </section>

      <button className="btn btn-ghost btn-full" onClick={()=>nav('/dashboard')}>HOME</button>
    </div>
  );
}

