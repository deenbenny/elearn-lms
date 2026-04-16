import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      {/* Hero */}
      <div style={{ background: '#1a1a2e', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          Trade Skills, <span style={{ color: '#e94560' }}>Not Money</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#aaa', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Teach what you know. Learn what you want. Exchange skills with your community using credits — no cash needed.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/skills" style={heroBtnPrimary}>Browse Skills</Link>
          {!user && <Link to="/register" style={heroBtnSecondary}>Join Free</Link>}
          {user && <Link to="/dashboard" style={heroBtnSecondary}>My Dashboard</Link>}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#1a1a2e', marginBottom: '2.5rem', fontSize: '1.6rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {[
            ['1', 'Create your profile', 'List skills you can teach and skills you want to learn.'],
            ['2', 'Browse & request', 'Find sessions from instructors across all categories.'],
            ['3', 'Exchange credits', 'Each session uses credits. Earn them by teaching others.'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ padding: '1.5rem', background: '#fff', border: '1px solid #eee', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '42px', height: '42px', background: '#fde8ec', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700, color: '#e94560', fontSize: '1.1rem' }}>{num}</div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem', fontSize: '1rem' }}>{title}</h3>
              <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div style={{ background: '#f9f0f2', padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>Ready to start exchanging?</h2>
          <Link to="/register" style={heroBtnPrimary}>Get Started — It's Free</Link>
        </div>
      )}
    </div>
  );
}

const heroBtnPrimary = { background: '#e94560', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' };
const heroBtnSecondary = { background: 'transparent', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', border: '1px solid #555' };
