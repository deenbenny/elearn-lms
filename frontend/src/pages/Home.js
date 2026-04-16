import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ArchDiagram = () => (
  <svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: '680px', display: 'block', margin: '0 auto' }}>
    <defs>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" opacity="0.7" />
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Background grid dots */}
    {[...Array(14)].map((_, i) =>
      [...Array(8)].map((_, j) => (
        <circle key={`${i}-${j}`} cx={20 + i * 48} cy={20 + j * 48} r="1"
          fill="#1e293b" />
      ))
    )}

    {/* ── React Frontend box ── */}
    <rect x="220" y="16" width="240" height="80" rx="12" fill="url(#cardGrad)"
      stroke="#38bdf8" strokeWidth="1.5" />
    <rect x="220" y="16" width="240" height="24" rx="12" fill="#38bdf8" opacity="0.12" />
    <text x="340" y="33" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700"
      fontFamily="'Outfit', monospace" letterSpacing="1">REACT FRONTEND</text>
    <text x="340" y="55" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="'Outfit', sans-serif">React 18 · React Router v6</text>
    <text x="340" y="70" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="'Outfit', sans-serif">Axios · Context API</text>
    <text x="340" y="87" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">localhost:3000</text>

    {/* Pages row */}
    {[['Home', 60], ['Skills', 160], ['Dashboard', 265], ['Admin', 390], ['Auth', 498]].map(([label, x]) => (
      <g key={label}>
        <rect x={x} y={112} width={label === 'Dashboard' ? 72 : label === 'Auth' ? 56 : 52} height="24" rx="6"
          fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x={x + (label === 'Dashboard' ? 36 : label === 'Auth' ? 28 : 26)} y="128"
          textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="'Outfit', sans-serif" fontWeight="600">
          {label}
        </text>
      </g>
    ))}

    {/* Arrow down to backend */}
    <line x1="340" y1="96" x2="340" y2="148" stroke="#38bdf8" strokeWidth="1.5"
      strokeDasharray="4 3" markerEnd="url(#arr)" opacity="0.7" />
    <rect x="278" y="138" width="125" height="18" rx="4" fill="#0f172a" />
    <text x="340" y="150" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace"
      letterSpacing="0.5">HTTP REST / JSON</text>

    {/* ── Express Backend box ── */}
    <rect x="180" y="158" width="320" height="88" rx="12" fill="url(#cardGrad)"
      stroke="#7dd3fc" strokeWidth="1.5" />
    <rect x="180" y="158" width="320" height="24" rx="12" fill="#38bdf8" opacity="0.08" />
    <text x="340" y="175" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="700"
      fontFamily="'Outfit', monospace" letterSpacing="1">EXPRESS.JS BACKEND</text>
    <text x="340" y="196" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="'Outfit', sans-serif">Node.js · JWT Auth · Mongoose ODM</text>
    <text x="340" y="212" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="'Outfit', sans-serif">Swagger UI · bcrypt · CORS</text>
    <text x="340" y="228" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">localhost:5000  ·  /api/docs</text>

    {/* Route chips */}
    {[['/auth', 105], ['/skills', 192], ['/sessions', 282], ['/users', 394]].map(([route, x]) => (
      <g key={route}>
        <rect x={x} y={260} width={route === '/sessions' ? 68 : route === '/skills' ? 55 : 50} height="22" rx="5"
          fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
        <text x={x + (route === '/sessions' ? 34 : route === '/skills' ? 27.5 : 25)} y="275"
          textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">{route}</text>
      </g>
    ))}

    {/* Arrow down to DB */}
    <line x1="340" y1="246" x2="340" y2="296" stroke="#7dd3fc" strokeWidth="1.5"
      strokeDasharray="4 3" markerEnd="url(#arr)" opacity="0.7" />
    <rect x="278" y="286" width="125" height="18" rx="4" fill="#0f172a" />
    <text x="340" y="298" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace"
      letterSpacing="0.5">Mongoose ODM</text>

    {/* ── MongoDB box ── */}
    <rect x="210" y="306" width="260" height="62" rx="12" fill="url(#cardGrad)"
      stroke="#a78bfa" strokeWidth="1.5" />
    <rect x="210" y="306" width="260" height="22" rx="12" fill="#a78bfa" opacity="0.1" />
    <text x="340" y="321" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="700"
      fontFamily="'Outfit', monospace" letterSpacing="1">MONGODB ATLAS</text>
    <text x="340" y="342" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="'Outfit', sans-serif">users  ·  skills  ·  sessions</text>
    <text x="340" y="358" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Cloud  ·  Free M0 Tier</text>

    {/* Side labels */}
    <text x="26" y="60" fill="#334155" fontSize="9" fontFamily="monospace" transform="rotate(-90,26,60)">UI Layer</text>
    <text x="26" y="210" fill="#334155" fontSize="9" fontFamily="monospace" transform="rotate(-90,26,210)">API Layer</text>
    <text x="26" y="345" fill="#334155" fontSize="9" fontFamily="monospace" transform="rotate(-90,26,345)">Data Layer</text>

    {/* Swagger badge */}
    <rect x="492" y="170" width="92" height="32" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
    <text x="538" y="182" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="700">SWAGGER UI</text>
    <text x="538" y="196" textAnchor="middle" fill="#92400e" fontSize="8" fontFamily="monospace">/api/docs</text>
    <line x1="500" y1="186" x2="498" y2="186" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
  </svg>
);

const HeroLogo = () => (
  <svg width="72" height="72" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 16px rgba(56,189,248,0.5))' }}>
    <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="24,7 40,16 40,32 24,41 8,32 8,16" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
    <path d="M14 17 C14 17 18 15 24 17 L24 33 C18 31 14 33 14 33 Z" fill="#38bdf8" opacity="0.9" />
    <path d="M34 17 C34 17 30 15 24 17 L24 33 C30 31 34 33 34 33 Z" fill="#7dd3fc" opacity="0.7" />
    <line x1="24" y1="17" x2="24" y2="33" stroke="#0f172a" strokeWidth="1" />
    <circle cx="34" cy="13" r="4" fill="#f59e0b" filter="url(#glow)" />
    <path d="M34 10 L34.7 12.3 L37 13 L34.7 13.7 L34 16 L33.3 13.7 L31 13 L33.3 12.3 Z" fill="#fef3c7" />
  </svg>
);

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: '#060d1a', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .hero-title { animation: fadeUp 0.8s ease both; }
        .hero-sub   { animation: fadeUp 0.8s 0.15s ease both; }
        .hero-btns  { animation: fadeUp 0.8s 0.3s ease both; }
        .hero-diag  { animation: fadeUp 0.8s 0.45s ease both; }
        .step-card  { transition: transform 0.25s, border-color 0.25s; }
        .step-card:hover { transform: translateY(-4px); border-color: #38bdf8 !important; }
        .cta-btn    { transition: all 0.2s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(56,189,248,0.35); }
        .cta-outline:hover { background: rgba(56,189,248,0.08) !important; }
        .cat-pill   { transition: all 0.2s; cursor: default; }
        .cat-pill:hover { background: #1e3a4a !important; border-color: #38bdf8 !important; color: #38bdf8 !important; }
        .orbit-ring { animation: spin 24s linear infinite; transform-origin: center; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 2rem 60px', textAlign: 'center' }}>
        {/* Background mesh */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.25, pointerEvents: 'none' }} />

        {/* Logo lockup */}
        <div className="hero-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
          <HeroLogo />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', color: '#f8fafc' }}>
              ELearn<span style={{ color: '#38bdf8' }}>LMS</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
              Community Skill Exchange
            </div>
          </div>
        </div>

        <p className="hero-sub" style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7, fontWeight: 400 }}>
          Teach what you know. Learn what you want.<br />
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>No money — just credits.</span>
        </p>

        <div className="hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/skills" className="cta-btn" style={{
            background: '#38bdf8', color: '#0f172a', padding: '12px 28px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem'
          }}>
            Browse Skills →
          </Link>
          {!user ? (
            <Link to="/register" className="cta-btn cta-outline" style={{
              background: 'transparent', color: '#f8fafc', padding: '12px 28px',
              borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
              border: '1px solid #334155'
            }}>
              Join Free
            </Link>
          ) : (
            <Link to="/dashboard" className="cta-btn cta-outline" style={{
              background: 'transparent', color: '#f8fafc', padding: '12px 28px',
              borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
              border: '1px solid #334155'
            }}>
              My Dashboard
            </Link>
          )}
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
          {[['8 Categories', '#38bdf8'], ['Credit Economy', '#f59e0b'], ['3 Role Types', '#a78bfa'], ['Zero Cost', '#34d399']].map(([label, color]) => (
            <span key={label} style={{
              background: '#0f172a', border: `1px solid ${color}33`, color: color,
              fontSize: '0.78rem', fontWeight: 600, padding: '5px 14px', borderRadius: '20px',
              letterSpacing: '0.03em'
            }}>{label}</span>
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE DIAGRAM ── */}
      <section className="hero-diag" style={{ padding: '20px 2rem 60px', maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.72rem', color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
            System Architecture
          </span>
        </div>
        <div style={{
          background: '#0a1628', border: '1px solid #1e293b', borderRadius: '16px',
          padding: '24px', boxShadow: '0 0 60px rgba(56,189,248,0.05)'
        }}>
          <ArchDiagram />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '40px 2rem 80px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.72rem', color: '#38bdf8', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>How It Works</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', margin: 0 }}>Three steps to start exchanging</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[
            { num: '01', icon: '◈', title: 'Create your profile', body: 'List skills you can teach and mark what you want to learn. New members start with 5 free credits.', color: '#38bdf8' },
            { num: '02', icon: '◉', title: 'Browse & request', body: 'Find instructors across 8 categories. Pick a time slot and request your session with credits.', color: '#f59e0b' },
            { num: '03', icon: '◍', title: 'Teach & earn', body: 'Complete sessions as an instructor to earn credits. Build your rating and grow your reputation.', color: '#a78bfa' },
          ].map(step => (
            <div key={step.num} className="step-card" style={{
              background: '#0d1f35', border: '1px solid #1e293b', borderRadius: '14px',
              padding: '28px 24px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '16px', right: '20px', fontSize: '2.5rem', fontWeight: 900, color: step.color, opacity: 0.08, fontFamily: 'monospace' }}>{step.num}</div>
              <div style={{ fontSize: '1.6rem', marginBottom: '14px', color: step.color }}>{step.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', letterSpacing: '-0.01em' }}>{step.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '0 2rem 80px', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.72rem', color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>Skill Categories</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {[
            ['💻 Technology', '#38bdf8'], ['🎵 Music', '#f59e0b'], ['🌐 Languages', '#34d399'],
            ['🎨 Arts', '#f472b6'], ['⚽ Sports', '#fb923c'], ['🍳 Cooking', '#a78bfa'],
            ['📚 Academic', '#60a5fa'], ['✦ Other', '#94a3b8']
          ].map(([cat, color]) => (
            <span key={cat} className="cat-pill" style={{
              background: '#0f172a', border: `1px solid #1e293b`, color: '#94a3b8',
              fontSize: '0.82rem', fontWeight: 500, padding: '8px 18px', borderRadius: '24px'
            }}>{cat}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section style={{ padding: '60px 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0d1f35 100%)', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>◈</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: '8px' }}>Ready to start?</h2>
          <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '0.95rem' }}>Join ELearnLMS — teach, learn, grow. For free.</p>
          <Link to="/register" className="cta-btn" style={{
            background: '#38bdf8', color: '#0f172a', padding: '14px 36px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
            display: 'inline-block'
          }}>
            Get started free →
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: '24px 2rem', borderTop: '1px solid #1e293b', textAlign: 'center' }}>
        <p style={{ color: '#334155', fontSize: '0.8rem', margin: 0 }}>
          ELearnLMS · Community Skill Exchange Portal · SE ZG503 FSAD · BITS Pilani WILP · 2026
        </p>
      </footer>
    </div>
  );
}
