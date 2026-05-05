import { useId } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
  variant?: 'default' | 'icon' | 'minimal';
}

export default function Logo({ size = 'md', hideText = false, variant = 'default' }: LogoProps) {
  const raw = useId();
  const uid = raw.replace(/[^a-z0-9]/gi, '');

  const dim       = size === 'sm' ? 32 : size === 'md' ? 44 : 60;
  const textClass = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const subClass  = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[9px]' : 'text-[10px]';

  const css = `
    @keyframes vml-rot   { to { transform: rotate(360deg); } }
    @keyframes vml-rotR { to { transform: rotate(-360deg); } }
    @keyframes vml-pulse { 0%,100%{opacity:0.8; filter: brightness(1.2);} 50%{opacity:1; filter: brightness(1.6);} }
    @keyframes vml-glow   { 0%,100%{opacity:0.2;} 50%{opacity:0.6;} }
    @keyframes vml-scan  { 0%{transform:translateY(-100%);opacity:0} 10%{opacity:0.5} 90%{opacity:0.5} 100%{transform:translateY(100%);opacity:0} }
    @keyframes vml-glitch { 0% { transform: translate(0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(-1px, -1px); } 60% { transform: translate(1px, 1px); } 80% { transform: translate(1px, -1px); } 100% { transform: translate(0); } }
    
    .vml-rot-${uid}   { transform-origin: 28px 28px; animation: vml-rot 15s linear infinite; }
    .vml-pls-${uid}   { animation: vml-pulse 2s ease-in-out infinite; }
    .vml-glw-${uid}   { transform-origin: 28px 28px; animation: vml-glow 3s ease-in-out infinite; }
    .vml-scan-${uid}  { animation: vml-scan 4s linear infinite; }
    .vml-glitch-${uid} { animation: vml-glitch 5s step-end infinite; }
  `;

  return (
    <div className="flex items-center gap-4 group cursor-pointer select-none">
      <svg
        width={dim} height={dim}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(0,245,255,0.2)]"
      >
        <defs>
          <style>{css}</style>
          
          <linearGradient id={`gMain-${uid}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#BD00FF" />
          </linearGradient>

          <pattern id={`hexGrid-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M4 0L8 2V6L4 8L0 6V2L4 0Z" fill="none" stroke="white" strokeWidth="0.2" opacity="0.1" />
          </pattern>

          <clipPath id={`clipShape-${uid}`}>
            <path d="M0 10L10 0H56V46L46 56H0V10Z" />
          </clipPath>
        </defs>

        {/* Tactical Clipped Background */}
        <path d="M0 10L10 0H56V46L46 56H0V10Z" fill="#0A0A0B" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
        <path d="M0 10L10 0H56V46L46 56H0V10Z" fill={`url(#hexGrid-${uid})`} />
        
        {/* Accent Borders */}
        <path d="M0 10L10 0H25" stroke="#00F5FF" strokeWidth="1.5" />
        <path d="M56 46L46 56H31" stroke="#BD00FF" strokeWidth="1.5" />

        {/* Core Mechanical Turbine */}
        <g className={`vml-rot-${uid}`}>
          {[0, 90, 180, 270].map((a) => (
            <path
              key={a}
              d="M28 28 L28 10 L34 14 L28 28"
              fill={`url(#gMain-${uid})`}
              opacity="0.8"
              transform={`rotate(${a} 28 28)`}
              stroke="white"
              strokeWidth="0.2"
              strokeOpacity="0.3"
            />
          ))}
          <circle cx="28" cy="28" r="4" fill="#0A0A0B" stroke="#00F5FF" strokeWidth="1" />
          <circle cx="28" cy="28" r="1.5" fill="#00F5FF" className={`vml-pls-${uid}`} />
        </g>

        {/* Data Scan Line */}
        <rect x="2" y="10" width="52" height="1" fill="#00F5FF" opacity="0.4" className={`vml-scan-${uid}`} />
        
        {/* Optical Glow */}
        <circle cx="28" cy="28" r="20" fill="url(#radialGlow)" opacity="0.1" className={`vml-glw-${uid}`} />
      </svg>

      {!hideText && (
        <div className="flex flex-col">
          <div className={`${textClass} font-black text-white italic tracking-[-0.08em] uppercase leading-[0.85] font-headline vml-glitch-${uid}`}>
            Video<span className="text-cyan-400">Mill</span>
          </div>
          <div className={`${subClass} text-[#BD00FF] font-black leading-none mt-1.5 font-data-mono uppercase tracking-[0.2em] opacity-80`}>
            The Non-Stop Viral Engine
          </div>
        </div>
      )}
    </div>
  );
}
