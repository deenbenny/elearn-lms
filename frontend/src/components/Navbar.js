import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{ background: '#1a1a2e', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
      <Link to="/" style={{ color: '#e94560', fontSize: '1.2rem', fontWeight: 700, textDecoration: 'none' }}>
        SkillExchange
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/skills" style={navLink}>Browse Skills</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={navLink}>Dashboard</Link>
            {(user.role === 'instructor' || user.role === 'admin') && (
              <Link to="/skills/new" style={navLink}>+ Add Skill</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={navLink}>Admin</Link>
            )}
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
              {user.name} ({user.credits} credits)
            </span>
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLink}>Login</Link>
            <Link to="/register" style={{ ...navLink, background: '#e94560', padding: '6px 14px', borderRadius: '6px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navLink = { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' };
const btnStyle = { background: 'transparent', border: '1px solid #e94560', color: '#e94560', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' };
