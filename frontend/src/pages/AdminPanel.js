import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    const load = async () => {
      try {
        const [u, sk, se] = await Promise.all([
          api.get('/users'),
          api.get('/skills'),
          api.get('/sessions')
        ]);
        setUsers(u.data);
        setSkills(sk.data);
        setSessions(se.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [user, navigate]);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await api.delete(`/skills/${id}`);
    setSkills(prev => prev.filter(s => s._id !== id));
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading admin panel...</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Admin Panel</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['Total Users', users.length], ['Active Skills', skills.length], ['Total Sessions', sessions.length]].map(([label, val]) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e94560', margin: 0 }}>{val}</p>
            <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['users', 'skills', 'sessions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', background: tab === t ? '#e94560' : '#eee', color: tab === t ? '#fff' : '#333', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead><tr style={{ background: '#f9f9f9' }}>
              <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Role</th><th style={th}>Credits</th><th style={th}>Action</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={td}>{u.name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}><span style={{ ...roleBadge, background: u.role === 'admin' ? '#fde8ec' : '#eef2ff', color: u.role === 'admin' ? '#e94560' : '#4f46e5' }}>{u.role}</span></td>
                  <td style={td}>{u.credits}</td>
                  <td style={td}>{u.role !== 'admin' && <button onClick={() => deleteUser(u._id)} style={delBtn}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'skills' && (
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead><tr style={{ background: '#f9f9f9' }}>
              <th style={th}>Title</th><th style={th}>Category</th><th style={th}>Credits</th><th style={th}>Action</th>
            </tr></thead>
            <tbody>
              {skills.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={td}>{s.title}</td>
                  <td style={td}>{s.category}</td>
                  <td style={td}>{s.creditsRequired}</td>
                  <td style={td}><button onClick={() => deleteSkill(s._id)} style={delBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sessions' && (
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead><tr style={{ background: '#f9f9f9' }}>
              <th style={th}>Skill</th><th style={th}>Learner</th><th style={th}>Instructor</th><th style={th}>Scheduled</th><th style={th}>Status</th>
            </tr></thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={td}>{s.skill?.title}</td>
                  <td style={td}>{s.learner?.name}</td>
                  <td style={td}>{s.instructor?.name}</td>
                  <td style={td}>{new Date(s.scheduledAt).toLocaleDateString()}</td>
                  <td style={td}><span style={{ color: { pending: '#f5a623', approved: '#2ecc71', completed: '#3498db', rejected: '#e94560', cancelled: '#aaa' }[s.status] }}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableWrap = { overflowX: 'auto', background: '#fff', border: '1px solid #eee', borderRadius: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const th = { padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#555' };
const td = { padding: '10px 14px', fontSize: '0.88rem', color: '#333' };
const roleBadge = { fontSize: '0.75rem', padding: '3px 10px', borderRadius: '10px', fontWeight: 500 };
const delBtn = { background: '#fde8ec', color: '#e94560', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' };
