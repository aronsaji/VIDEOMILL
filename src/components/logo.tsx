import { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export default function Logo({ size = 'md', showText = true, animated = true }: LogoProps) {
  const raw = useId();
  const uid = raw.replace(/[^a-z0-9]/gi, '');

  const dim = size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96;
  const textClass = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl';
  const subClass = size === 'sm' ? 'text-[7px]' : size === 'md' ? 'text-[9px]' : size === 'lg' ? 'text-[10px]' : 'text-xs';

  const gMain = `vml-gm-${uid}`;
  const gGlow = `vml-gg-${uid}`;
  const fGlow = `vml-fg-${uid}`;
  const fBlur = `vml-fb-${uid}`;

  const css = `
    @keyframes vml-rotate { 
      from { transform: rotate(0deg); } 
      to { transform: rotate(360deg); } 
    }
    @keyframes vml-rotateR { 
      from { transform: rotate(360deg); } 
      to { transform: rotate(0deg); } 
    }
    @keyframes vml-pulse { 
      0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} 
    }
    @keyframes vml-glitch { 
      0%,100%{transform:translate(0);opacity:0} 
      5%{transform:translate(-2px,1px);opacity:0.8} 
      10%{transform:translate(2px,-1px);opacity:0} 
      15%{transform:translate(0);opacity:0.6}
      20%{transform:translate(1px,2px);opacity:0}
      25%{transform:translate(0)}
    }
    @keyframes vml-scan { 
      0%{transform:translateY(-100%);opacity:0} 50%{opacity:0.8} 100%{transform:translateY(100%);opacity:0}
    }
    @keyframes vml-flicker {
      0%,100%{opacity:1} 50%{opacity:0.95} 52%{opacity:0.85} 54%{opacity:1}
    }
    @keyframes vml-glowPulse {
      0%,100%{filter:drop-shadow(0 0 8px rgba(139,92,246,0.6))} 50%{filter:drop-shadow(0 0 20px rgba(139,92,246,0.9))}
    }
    
    .vml-rot-${uid}{animation:vml-rotate 8s linear infinite;transform-origin:${dim/2}px ${dim/2}px}
    .vml-rotR-${uid}{animation:vml-rotateR 12s linear infinite;transform-origin:${dim/2}px ${dim/2}px}
    .vml-pulse-${uid}{animation:vml-pulse 2s ease-in-out infinite}
    .vml-glitch-${uid}{animation:vml-glitch 3s ease-in-out infinite}
    .vml-scan-${uid}{animation:vml-scan 2.5s ease-in-out infinite}
    .vml-flicker-${uid}{animation:vml-flicker 0.15s ease-in-out infinite}
    .vml-glowPulse-${uid}{animation:vml-glowPulse 2s ease-in-out infinite}
  `;

  const bladeCount = 6;
  const angles = Array.from({ length: bladeCount }, (_, i) => (360 / bladeCount) * i);

  return (
    <div className="flex items-center gap-3">
      {/* LOGO ICON */}
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? `vml-flicker-${uid}` : ''}
        >
          <defs>
            <style>{css}</style>

            <linearGradient id={gMain} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="40%" stopColor="#8b5cf6" />
              <stop offset="70%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>

            <linearGradient id={gGlow} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>

            <filter id={fGlow} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={fBlur} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Outer glow aura */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#{gGlow})" filter={`url(#${fBlur})`} opacity="0.4" className={animated ? `vml-pulse-${uid}` : ''} />

          {/* Base ring */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill="#050505" stroke="url(#{gMain})" strokeWidth="1.5" />

          {/* Inner ring */}
          <rect x="5" y="5" width="54" height="54" rx="13" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />

          {/* CORE - Rotating hexagon */}
          <g className={`vml-rot-${uid}`} style={{ transformOrigin: `${dim/2}px ${dim/2}px` }}>
            <polygon
              points="32,20 52,26 52,46 32,52 12,46 12,26"
              fill="none"
              stroke="url(#{gMain})"
              strokeWidth="1"
              opacity="0.9"
            />
            {/* Blade spokes */}
            {angles.map((angle, i) => (
              <line
                key={i}
                x1="32"
                y1="24"
                x2="32"
                y2="40"
                stroke="url(#{gMain})"
                strokeWidth="2"
                opacity="0.7"
                transform={`rotate(${angle} 32 32)`}
              />
            ))}
            {/* Center core */}
            <circle cx="32" cy="32" r="6" fill="url(#{gMain})" filter={`url(#${fGlow})`} />
          </g>

          {/* Counter-rotating orbit rings */}
          <g className={`vml-rotR-${uid}`} style={{ transformOrigin: `${dim/2}px ${dim/2}px` }}>
            <circle cx="32" cy="32" r="18" fill="none" stroke="url(#{gMain})" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.4" />
            <circle cx="32" cy="32" r="23" fill="none" stroke="url(#{gMain})" strokeWidth="0.3" strokeDasharray="2 8" opacity="0.25" />
          </g>

          {/* Play triangle - glowing */}
          <path
            d="M26 24 L26 40 L42 32 Z"
            fill="#fff"
            filter={`url(#${fGlow})`}
            className={animated ? `vml-glowPulse-${uid}` : ''}
          />

          {/* Scan line effect */}
          {animated && (
            <rect x="4" y="20" width="56" height="2" fill="#8b5cf6" opacity="0.6" className={`vml-scan-${uid}`} />
          )}

          {/* Glitch effect layers */}
          {animated && (
            <>
              <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.3" className={`vml-glitch-${uid}`} />
              <rect x="4" y="4" width="56" height="56" rx="14" fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.2" transform="translate(-1,-1)" className={`vml-glitch-${uid}`} style={{animationDelay: '0.1s'}} />
            </>
          )}
        </svg>
      </div>

      {/* TEXT */}
      {showText && (
        <div className="relative">
          <div className={`font-bold tracking-tight leading-none text-white ${textClass}`}>
            Video<span className="bg-gradient-to-r from-violet-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">Mill</span>
          </div>
          <div className={`font-semibold leading-none mt-0.5 bg-gradient-to-r from-violet-400 via-purple-400 to-teal-400 bg-clip-text text-transparent ${subClass}`}>
            NON-STOP VIRAL ENGINE
          </div>
        </div>
      )}
    </div>
  );
}