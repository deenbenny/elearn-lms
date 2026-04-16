import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Sign In</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={inputStyle} type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={submitBtn} type="submit">Login</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          No account? <Link to="/register" style={{ color: '#e94560' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f5f5f5' };
const cardStyle = { background: '#fff', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px 12px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' };
const errorStyle = { color: '#e94560', marginBottom: '1rem', fontSize: '0.9rem' };
