import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = { pending: '#f5a623', approved: '#2ecc71', rejected: '#e94560', completed: '#3498db', cancelled: '#aaa' };

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [sessRes] = await Promise.all([api.get('/sessions')]);
        setSessions(sessRes.data);
        if (user.role === 'instructor' || user.role === 'admin') {
          const skillRes = await api.get('/skills');
          setMySkills(skillRes.data.filter(s => s.instructor?._id === user._id || user.role === 'admin'));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/sessions/${id}/status`, { status });
      setSessions(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const submitFeedback = async (sessionId) => {
    const { rating, comment } = feedbackForm[sessionId] || {};
    if (!rating) return alert('Please select a star rating');
    try {
      await api.post(`/sessions/${sessionId}/feedback`, { rating: Number(rating), comment: comment || '' });
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, feedback: { rating, comment } } : s));
      setFeedbackOpen(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#1a1a2e', marginBottom: '0.25rem' }}>Welcome, {user.name}</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Role: {user.role} · Credits: {user.credits}</p>
        </div>
        {(user.role === 'instructor' || user.role === 'admin') && (
          <Link to="/skills/new" style={addBtn}>+ New Skill</Link>
        )}
      </div>

      {/* Sessions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '1rem', fontSize: '1.15rem' }}>My Sessions</h2>
        {sessions.length === 0 ? (
          <p style={{ color: '#888' }}>No sessions yet. <Link to="/skills" style={{ color: '#e94560' }}>Browse skills</Link> to get started.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map(s => (
              <div key={s._id} style={sessionCard}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{s.skill?.title || 'Skill'}</p>
                  <p style={{ fontSize: '0.82rem', color: '#888' }}>
                    {user.role === 'learner' ? `Instructor: ${s.instructor?.name}` : `Learner: ${s.learner?.name}`}
                    {' · '}{new Date(s.scheduledAt).toLocaleString()}
                    {' · '}{s.creditsUsed} credits
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ ...statusBadge, background: STATUS_COLORS[s.status] + '22', color: STATUS_COLORS[s.status] }}>
                    {s.status}
                  </span>
                  {/* Instructor actions */}
                  {user.role === 'instructor' && s.status === 'pending' && (
                    <>
                      <button style={actionBtn('#2ecc71')} onClick={() => updateStatus(s._id, 'approved')}>Approve</button>
                      <button style={actionBtn('#e94560')} onClick={() => updateStatus(s._id, 'rejected')}>Reject</button>
                    </>
                  )}
                  {user.role === 'instructor' && s.status === 'approved' && (
                    <button style={actionBtn('#3498db')} onClick={() => updateStatus(s._id, 'completed')}>Mark Complete</button>
                  )}
                  {/* Learner actions */}
                  {user.role === 'learner' && s.status === 'pending' && (
                    <button style={actionBtn('#aaa')} onClick={() => updateStatus(s._id, 'cancelled')}>Cancel</button>
                  )}
                  {user.role === 'learner' && s.status === 'completed' && !s.feedback?.rating && (
                    <button style={actionBtn('#f5a623')} onClick={() => setFeedbackOpen(feedbackOpen === s._id ? null : s._id)}>Leave Feedback</button>
                  )}
                  {user.role === 'learner' && s.status === 'completed' && s.feedback?.rating && (
                    <span style={{ fontSize: '0.82rem', color: '#f5a623' }}>★ {s.feedback.rating} rated</span>
                  )}
                </div>
                {feedbackOpen === s._id && (
                  <div style={{ width: '100%', marginTop: '0.75rem', padding: '0.9rem', background: '#f9f9f9', borderRadius: '8px', borderTop: '1px solid #eee' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>Rate this session:</p>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '0.6rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} data-star={star}
                          onClick={() => setFeedbackForm(f => ({ ...f, [s._id]: { ...(f[s._id] || {}), rating: star } }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0 2px', color: (feedbackForm[s._id]?.rating || 0) >= star ? '#f5a623' : '#ddd' }}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Comment (optional)"
                      value={feedbackForm[s._id]?.comment || ''}
                      onChange={e => setFeedbackForm(f => ({ ...f, [s._id]: { ...(f[s._id] || {}), comment: e.target.value } }))}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', resize: 'none', height: '60px', boxSizing: 'border-box', marginBottom: '0.5rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={actionBtn('#f5a623')} onClick={() => submitFeedback(s._id)}>Submit</button>
                      <button style={actionBtn('#aaa')} onClick={() => setFeedbackOpen(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Instructor's skills */}
      {(user.role === 'instructor' || user.role === 'admin') && mySkills.length > 0 && (
        <section>
          <h2 style={{ color: '#1a1a2e', marginBottom: '1rem', fontSize: '1.15rem' }}>My Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {mySkills.map(sk => (
              <div key={sk._id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1rem' }}>
                <p style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>{sk.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{sk.category} · {sk.creditsRequired} credits</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const sessionCard = { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' };
const statusBadge = { fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: '10px', textTransform: 'capitalize' };
const actionBtn = (color) => ({ background: color + '15', color, border: `1px solid ${color}40`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 });
const addBtn = { background: '#e94560', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 };
