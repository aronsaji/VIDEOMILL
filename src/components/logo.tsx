import { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'icon' | 'minimal';
}

export default function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const raw = useId();
  const uid = raw.replace(/[^a-z0-9]/gi, '');

  const dim       = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
  const textClass = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const subClass  = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs';

  const gMain   = `vml-gm-${uid}`;
  const gAccent = `vml-ga-${uid}`;
  const gBg     = `vml-gb-${uid}`;
  const gOrbit  = `vml-go-${uid}`;
  const fGlow  = `vml-fg-${uid}`;
  const fOuter = `vml-fo-${uid}`;

  const css = `
    @keyframes vml-spin { to { transform: rotate(360deg); } }
    @keyframes vml-spinR { to { transform: rotate(-360deg); } }
    @keyframes vml-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
    @keyframes vml-glow { 0%,100%{opacity:0.2} 50%{opacity:0.5} }
    @keyframes vml-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes vml-scan { 0%{transform:translateY(-50%);opacity:0} 50%{opacity:0.5} 100%{transform:translateY(50%);opacity:0} }
    @keyframes vml-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
    
    .vml-spin-${uid}   { transform-origin:${dim/2}px ${dim/2}px; animation:vml-spin 12s linear infinite; }
    .vml-spinR-${uid} { transform-origin:${dim/2}px ${dim/2}px; animation:vml-spinR 8s linear infinite; }
    .vml-plus-${uid}   { animation:vml-pulse 2s ease-in-out infinite; }
    .vml-glow-${uid}   { animation:vml-glow 3s ease-in-out infinite; }
    .vml-blink-${uid}  { animation:vml-blink 1s ease-in-out infinite; }
    .vml-scan-${uid}  { animation:vml-scan 2s ease-in-out infinite; }
    .vml-float-${uid} { animation:vml-float 3s ease-in-out infinite; }
  `;

  const bladeCount = 6;
  const angles = Array.from({ length: bladeCount }, (_, i) => (360 / bladeCount) * i);

  return (
    <div className="flex items-center gap-3">
      {/* LOGO ICON */}
      <div className={`relative vml-float-${uid}`} style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <style>{css}</style>

            {/* 🎨 Main gradient: Violet → Teal (Obsidian & Violet theme!) */}
            <linearGradient id={gMain} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" />     {/* Violet */}
              <stop offset="50%" stopColor="#a78bfa" />     {/* Light violet */}
              <stop offset="100%" stopColor="#14b8a6" />   {/* Teal accent */}
            </linearGradient>

            {/* Accent gradient for play button */}
            <linearGradient id={gAccent} x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
            </linearGradient>

            {/* Deep background */}
            <linearGradient id={gBg} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="100%" stopColor="#0f0f14" />
            </linearGradient>

            {/* Orbit ring */}
            <linearGradient id={gOrbit} x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.5" />
            </linearGradient>

            {/* ✨ Glow filter */}
            <filter id={fGlow} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Outer glow */}
            <filter id={fOuter} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* Background with gradient */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#${gBg})`} />

          {/* Outer glow ring */}
          <rect x="2" y="2" width="60" height="60" rx="16" 
            fill="none" stroke="url(#{gMain})" strokeWidth="1" opacity="0.15" 
            filter={`url(#${fOuter})`} className={`vml-glow-${uid}`} />

          {/* Main border */}
          <rect x="2" y="2" width="60" height="60" rx="16" 
            fill="none" stroke={`url(#${gMain})`} strokeWidth="1.5" opacity="0.8" />

          {/* Inner subtle ring */}
          <rect x="5" y="5" width="54" height="54" rx="13" 
            fill="none" stroke="#8b5cf6" strokeWidth="0.3" opacity="0.25" />

          {/* 🎬 Rotating blades (mill effect) */}
          <g className={`vml-spin-${uid}`} style={{ transformOrigin: `${dim/2}px ${dim/2}px` }}>
            {angles.map((angle, i) => (
              <ellipse
                key={i}
                cx="32"
                cy="14"
                rx="2"
                ry="7"
                fill={`url(#${gMain})`}
                opacity="0.8"
                transform={`rotate(${angle} 32 32)`}
              />
            ))}
            {/* Center hub */}
            <circle cx="32" cy="32" r="4" fill="none" stroke={`url(#${gMain})`} strokeWidth="1" opacity="0.6" />
          </g>

          {/* Counter-rotating orbit */}
          <circle cx="32" cy="32" r="22" fill="none" stroke={`url(#{gOrbit})`} strokeWidth="0.8" strokeDasharray="4 6" opacity="0.4" 
            className={`vml-spinR-${uid}`} />

          {/* Central glow */}
          <circle cx="32" cy="32" r="14" fill="#8b5cf6" opacity="0.08" className={`vml-glow-${uid}`} />

          {/* ▶ Play button */}
          <path
            d="M27 24 L27 40 L41 32 Z"
            fill={`url(#${gAccent})`}
            filter={`url(#${fGlow})`}
            className={`vml-plus-${uid}`}
          />

          {/* Status LED */}
          <circle cx="50" cy="14" r="3" fill="#14b8a6" filter={`url(#${fGlow})`} className={`vml-blink-${uid}`} />
        </svg>
      </div>

      {/* TEXT */}
      {showText && (
        <div className="relative">
          <div className={`font-bold tracking-tight leading-none text-white ${textClass}`}>
            Video<span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">Mill</span>
          </div>
          <div className={`font-semibold leading-none mt-0.5 bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent ${subClass}`}>
            NON-STOP VIRAL ENGINE
          </div>
        </div>
      )}
    </div>
  );
}