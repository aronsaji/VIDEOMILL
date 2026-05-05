import { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
  variant?: 'default' | 'icon' | 'minimal';
}

export default function Logo({ size = 'md', hideText = false, variant = 'default' }: LogoProps) {
  const raw = useId();
  const uid = raw.replace(/[^a-z0-9]/gi, '');

  const dim       = size === 'sm' ? 28 : size === 'md' ? 40 : 56;
  const textClass = size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-2xl';
  const subClass  = size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs';

  const css = `
    @keyframes vml-rot   { to { transform: rotate(360deg); } }
    @keyframes vml-rotR { to { transform: rotate(-360deg); } }
    @keyframes vml-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
    @keyframes vml-glow   { 0%,100%{opacity:0.15} 50%{opacity:0.4} }
    @keyframes vml-ring  { 0%,100%{opacity:0.3;stroke-dashoffset:0} 50%{opacity:0.6} }
    @keyframes vml-dot   { 0%,100%{opacity:0.15} 50%{opacity:0.7} }
    @keyframes vml-scan  { 0%{transform:translateY(-100%);opacity:0} 50%{opacity:0.6} 100%{transform:translateY(100%);opacity:0} }
    
    .vml-rot-${uid}   { transform-origin:${dim/2}px ${dim/2}px; animation:vml-rot 20s linear infinite; }
    .vml-rotR-${uid} { transform-origin:${dim/2}px ${dim/2}px; animation:vml-rotR 25s linear infinite; }
    .vml-pls-${uid}   { animation:vml-pulse 2.5s ease-in-out infinite; }
    .vml-glw-${uid}   { animation:vml-glow 3s ease-in-out infinite; }
    .vml-rng-${uid}   { animation:vml-ring 4s linear infinite; }
    .vml-dots-${uid}  { animation:vml-dot 2s ease-in-out infinite; }
    .vml-scan-${uid}  { animation:vml-scan 2.5s ease-in-out infinite; }
  `;

  const bladeAngles = [0, 60, 120, 180, 240, 300];
  const cornerDots = variant === 'minimal' ? [] : [8, 44];

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <svg
        width={dim} height={dim}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{css}</style>
          <linearGradient id={`gMain-${uid}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00F5FF" />
            <stop offset="45%"  stopColor="#00D4E5" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          <linearGradient id={`gAccent-${uid}`} x1="20" y1="20" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%"  stopColor="#00F5FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00D4E5" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`gBg-${uid}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0B0F1A" />
            <stop offset="100%" stopColor="#080C14" />
          </linearGradient>
          <radialGradient id={`gGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00F5FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`gOrbit-${uid}`} x1="0" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00F5FF" stopOpacity="0.4" />
            <stop offset="50%"  stopColor="#00F5FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="52" height="52" rx="14" fill={`url(#gBg-${uid})`} />
        <rect x="2" y="2" width="52" height="52" rx="14" fill="none" stroke="#00F5FF" strokeWidth="0.5" opacity="0.15" />
        <rect x="2" y="2" width="52" height="52" rx="14" fill="none" stroke={`url(#gMain-${uid})`} strokeWidth="1.2" opacity="0.6" />
        <rect x="4" y="4" width="48" height="48" rx="12" fill="none" stroke="#00F5FF" strokeWidth="0.3" opacity="0.2" />

        <g className={`vml-rot-${uid}`}>
          {bladeAngles.map((a) => (
            <ellipse
              key={a}
              cx="28" cy="14"
              rx="2.2" ry="6"
              fill={`url(#gMain-${uid})`}
              opacity="0.7"
              transform={`rotate(${a} 28 28)`}
            />
          ))}
          <circle cx="28" cy="28" r="3.5" fill="none" stroke={`url(#gMain-${uid})`} strokeWidth="0.8" opacity="0.5" />
        </g>

        <circle cx="28" cy="28" r="19" fill="none" stroke={`url(#gOrbit-${uid})`} strokeWidth="0.6" strokeDasharray="3 5" opacity="0.4" className={`vml-rotR-${uid}`} />
        <circle cx="28" cy="28" r="13" fill="none" stroke={`url(#gMain-${uid})`} strokeWidth="0.6" opacity="0.35" className={`vml-rotR-${uid}`} />
        <circle cx="28" cy="28" r="11" fill={`url(#gGlow-${uid})`} className={`vml-glw-${uid}`} />

        <path
          d="M24 22 L24 34 L35 28 Z"
          fill={`url(#gAccent-${uid})`}
          className={`vml-pls-${uid}`}
        />

        {cornerDots.map((pos, i) => (
          <g key={i}>
            <circle cx={pos} cy={pos} r="1.5" fill="#00F5FF" opacity="0.5" className={`vml-dots-${uid}`} style={{animationDelay: `${i * 0.5}s`}} />
            <circle cx={56 - pos} cy={pos} r="1.5" fill="#00F5FF" opacity="0.5" className={`vml-dots-${uid}`} style={{animationDelay: `${(i + 2) * 0.5}s`}} />
            <circle cx={pos} cy={56 - pos} r="1.5" fill="#00F5FF" opacity="0.5" className={`vml-dots-${uid}`} style={{animationDelay: `${(i + 4) * 0.5}s`}} />
            <circle cx={56 - pos} cy={56 - pos} r="1.5" fill="#00F5FF" opacity="0.5" className={`vml-dots-${uid}`} style={{animationDelay: `${(i + 6) * 0.5}s`}} />
          </g>
        ))}

        {variant === 'default' && (
          <rect x="6" y="15" width="44" height="1" fill="#00F5FF" opacity="0.3" className={`vml-scan-${uid}`} />
        )}
      </svg>

      {!hideText && (
        <div className="flex flex-col">
          <div className={`${textClass} font-black text-white italic tracking-tighter uppercase leading-none font-headline`}>
            Video<span className="text-cyan-400">Mill</span>
          </div>
          <div className={`${subClass} text-cyan-400/70 font-semibold leading-none mt-0.5 font-data-mono uppercase tracking-[0.2em]`}>
            NON-STOP VIRAL ENGINE
          </div>
        </div>
      )}
    </div>
  );
}
