export default function Logo({ size = 36, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* SVG Logo Mark */}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer hexagon */}
        <polygon
          points="24,2 44,13 44,35 24,46 4,35 4,13"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        {/* Inner glow ring */}
        <polygon
          points="24,7 40,16 40,32 24,41 8,32 8,16"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* Book pages — left */}
        <path d="M14 17 C14 17 18 15 24 17 L24 33 C18 31 14 33 14 33 Z"
          fill="#38bdf8" opacity="0.9" />
        {/* Book pages — right */}
        <path d="M34 17 C34 17 30 15 24 17 L24 33 C30 31 34 33 34 33 Z"
          fill="#7dd3fc" opacity="0.7" />
        {/* Spine line */}
        <line x1="24" y1="17" x2="24" y2="33" stroke="#0f172a" strokeWidth="1" />
        {/* Spark / graduation star */}
        <circle cx="34" cy="13" r="4" fill="#f59e0b" />
        <path d="M34 10 L34.7 12.3 L37 13 L34.7 13.7 L34 16 L33.3 13.7 L31 13 L33.3 12.3 Z"
          fill="#fef3c7" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Outfit', 'Segoe UI', sans-serif",
            fontWeight: 800,
            fontSize: size * 0.55 + 'px',
            letterSpacing: '-0.02em',
            color: '#f8fafc',
          }}>
            ELearn
            <span style={{ color: '#38bdf8' }}>LMS</span>
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 400,
            fontSize: size * 0.22 + 'px',
            color: '#94a3b8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Skill Exchange
          </span>
        </div>
      )}
    </div>
  );
}
