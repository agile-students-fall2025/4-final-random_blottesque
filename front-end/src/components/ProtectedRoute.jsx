import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const nav = useNavigate();

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

  return children;
}