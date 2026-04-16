import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['Technology', 'Music', 'Languages', 'Arts', 'Sports', 'Cooking', 'Academic', 'Other'];

export default function SkillForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'Technology', creditsRequired: 1, tags: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/skills', {
        ...form,
        creditsRequired: Number(form.creditsRequired),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create skill');
    }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div style={{ maxWidth: '580px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>Add a Skill</h1>
      <div style={cardStyle}>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Skill Title</label>
          <input style={inputStyle} placeholder="e.g. Python for Beginners" {...f('title')} required />

          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
            placeholder="Describe what you will teach and what learners will gain..." {...f('description')} required />

          <label style={labelStyle}>Category</label>
          <select style={inputStyle} {...f('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={labelStyle}>Credits Required (per session)</label>
          <input style={inputStyle} type="number" min="1" max="20" {...f('creditsRequired')} required />

          <label style={labelStyle}>Tags (comma-separated)</label>
          <input style={inputStyle} placeholder="e.g. beginner, python, coding" {...f('tags')} />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => navigate(-1)}
              style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
              Cancel
            </button>
            <button type="submit" style={submitBtn}>Create Skill</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const cardStyle = { background: '#fff', border: '1px solid #eee', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' };
const inputStyle = { width: '100%', padding: '9px 12px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '0.3rem', fontWeight: 500 };
const submitBtn = { flex: 1, padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' };
const errorStyle = { color: '#e94560', marginBottom: '1rem', fontSize: '0.9rem' };
