import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SkillDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/skills/${id}`).then(r => setSkill(r.data)).catch(() => navigate('/skills'));
  }, [id, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      await api.post('/sessions', { skillId: id, scheduledAt, notes });
      setMsg('Session requested successfully! Check your dashboard.');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  if (!skill) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={categoryBadge}>{skill.category}</span>
          <span style={{ color: '#e94560', fontWeight: 700, fontSize: '1.1rem' }}>{skill.creditsRequired} credits</span>
        </div>
        <h1 style={{ color: '#1a1a2e', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{skill.title}</h1>
        <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.25rem' }}>{skill.description}</p>

        {skill.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {skill.tags.map(tag => <span key={tag} style={tagStyle}>#{tag}</span>)}
          </div>
        )}

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '0.25rem' }}>Instructor: {skill.instructor?.name}</p>
          {skill.instructor?.bio && <p style={{ color: '#666', fontSize: '0.9rem' }}>{skill.instructor.bio}</p>}
          {skill.instructor?.rating > 0 && (
            <p style={{ color: '#f5a623', fontSize: '0.9rem' }}>★ {skill.instructor.rating} · {skill.instructor.totalSessions} sessions completed</p>
          )}
        </div>

        {user && user.role === 'learner' && (
          <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Request a Session</h3>
            {msg && <p style={{ color: 'green', marginBottom: '0.75rem' }}>{msg}</p>}
            {error && <p style={{ color: '#e94560', marginBottom: '0.75rem' }}>{error}</p>}
            <form onSubmit={handleRequest}>
              <label style={labelStyle}>Preferred Date & Time</label>
              <input style={inputStyle} type="datetime-local" value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)} required />
              <label style={labelStyle}>Notes (optional)</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }} value={notes}
                onChange={e => setNotes(e.target.value)} placeholder="Any specific topics or requirements?" />
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem' }}>
                Your balance: {user.credits} credits · Cost: {skill.creditsRequired} credits
              </p>
              <button style={submitBtn} type="submit"
                disabled={user.credits < skill.creditsRequired}>
                {user.credits < skill.creditsRequired ? 'Insufficient Credits' : 'Request Session'}
              </button>
            </form>
          </div>
        )}
        {!user && (
          <p style={{ color: '#888', textAlign: 'center' }}>
            <a href="/login" style={{ color: '#e94560' }}>Login</a> to request this session.
          </p>
        )}
      </div>
    </div>
  );
}

const cardStyle = { background: '#fff', border: '1px solid #eee', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' };
const categoryBadge = { background: '#f0f0f0', color: '#555', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '12px', fontWeight: 500 };
const tagStyle = { background: '#eef2ff', color: '#4f46e5', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '10px' };
const backBtn = { background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem', padding: 0 };
const inputStyle = { width: '100%', padding: '9px 12px', marginBottom: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '0.3rem', fontWeight: 500 };
const submitBtn = { width: '100%', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' };
