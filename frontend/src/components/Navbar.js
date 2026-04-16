import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 0.88rem; font-weight: 500; font-family: 'Outfit', sans-serif; transition: color 0.2s; padding: 4px 0; border-bottom: 2px solid transparent; }
        .nav-link:hover { color: #f8fafc; border-bottom-color: #38bdf8; }
        .nav-btn { background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
        .nav-btn:hover { border-color: #38bdf8; color: #38bdf8; }
        .nav-register { background: #38bdf8; color: #0f172a; padding: 7px 16px; border-radius: 8px; text-decoration: none; font-size: 0.88rem; font-weight: 700; font-family: 'Outfit', sans-serif; transition: background 0.2s; }
        .nav-register:hover { background: #7dd3fc; }
        .credit-chip { background: #1e293b; border: 1px solid #334155; color: #38bdf8; font-size: 0.78rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; font-family: 'Outfit', sans-serif; }
      `}</style>
      <nav style={{
        background: '#0f172a', borderBottom: '1px solid #1e293b',
        padding: '0 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={34} showText={true} />
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/skills" className="nav-link">Browse Skills</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {(user.role === 'instructor' || user.role === 'admin') && (
                <Link to="/skills/new" className="nav-link" style={{ color: '#38bdf8' }}>+ Add Skill</Link>
              )}
              {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
              <span className="credit-chip">&#x2B21; {user.credits} credits</span>
              <span style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}>{user.name}</span>
              <button onClick={handleLogout} className="nav-btn">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/register" className="nav-register">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
