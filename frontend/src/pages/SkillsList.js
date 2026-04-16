import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['All', 'Technology', 'Music', 'Languages', 'Arts', 'Sports', 'Cooking', 'Academic', 'Other'];

export default function SkillsList() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/skills', { params });
        setSkills(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchSkills, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>Browse Skills</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          style={inputStyle}
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ ...tagBtn, background: category === cat ? '#e94560' : '#eee', color: category === cat ? '#fff' : '#333' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading skills...</p>
      ) : skills.length === 0 ? (
        <p style={{ color: '#888' }}>No skills found. Try a different search.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {skills.map(skill => (
            <Link to={`/skills/${skill._id}`} key={skill._id} style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={categoryBadge}>{skill.category}</span>
                  <span style={{ color: '#e94560', fontWeight: 600 }}>{skill.creditsRequired} credits</span>
                </div>
                <h3 style={{ color: '#1a1a2e', margin: '0.5rem 0', fontSize: '1.05rem' }}>{skill.title}</h3>
                <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {skill.description.length > 100 ? skill.description.slice(0, 100) + '...' : skill.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '0.6rem', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.82rem', color: '#888' }}>by {skill.instructor?.name}</span>
                  {skill.instructor?.rating > 0 && (
                    <span style={{ fontSize: '0.82rem', color: '#f5a623' }}>★ {skill.instructor.rating}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '9px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', width: '280px' };
const tagBtn = { padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 };
const cardStyle = { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', minHeight: '170px', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer' };
const categoryBadge = { background: '#f0f0f0', color: '#555', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 500 };
