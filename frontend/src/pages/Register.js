import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Music', 'Languages', 'Arts', 'Sports', 'Cooking', 'Academic', 'Other'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner', skillsOffered: '', skillsWanted: '', bio: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        ...form,
        skillsOffered: form.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
        skillsWanted: form.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Create Account</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} placeholder="Full Name" {...f('name')} required />
          <input style={inputStyle} type="email" placeholder="Email" {...f('email')} required />
          <input style={inputStyle} type="password" placeholder="Password (min 6 chars)" {...f('password')} required />
          <select style={inputStyle} {...f('role')}>
            <option value="learner">Learner</option>
            <option value="instructor">Instructor</option>
          </select>
          <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} placeholder="Bio (optional)" {...f('bio')} />
          <input style={inputStyle} placeholder="Skills you can teach (comma-separated)" {...f('skillsOffered')} />
          <input style={inputStyle} placeholder="Skills you want to learn (comma-separated)" {...f('skillsWanted')} />
          <button style={submitBtn} type="submit">Register</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#e94560' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: '#f5f5f5', padding: '2rem 0' };
const cardStyle = { background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px 12px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' };
const errorStyle = { color: '#e94560', marginBottom: '1rem', fontSize: '0.9rem' };
