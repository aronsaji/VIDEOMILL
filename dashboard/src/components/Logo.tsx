import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function Logo({ size = 'md', hideText = false }: LogoProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-lg', tagline: 'text-[8px]' },
    md: { container: 'w-14 h-14', text: 'text-2xl', tagline: 'text-[10px]' },
    lg: { container: 'w-20 h-20', text: 'text-4xl', tagline: 'text-xs' },
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Animated Logo Mark */}
      <motion.div
        className={`relative ${sizes[size].container} flex items-center justify-center`}
      >
        {/* Glow Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-3px] rounded-lg"
          style={{
            background: 'conic-gradient(from 0deg, #BD00FF, #00fe66, #e90053, #BD00FF)',
            opacity: 0.4,
            filter: 'blur(4px)',
          }}
        />

        {/* Core Container */}
        <div
          className="relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0A0A0B 0%, #1a1a1d 100%)',
            border: '1px solid rgba(189, 0, 255, 0.3)',
            boxShadow: '0 0 20px rgba(189, 0, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* SVG Logo */}
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <defs>
              <linearGradient id="logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BD00FF" />
                <stop offset="100%" stopColor="#ecb2ff" />
              </linearGradient>
              <linearGradient id="logo-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00fe66" />
                <stop offset="100%" stopColor="#6bff83" />
              </linearGradient>
            </defs>

            {/* Play Triangle */}
            <motion.path
              d="M30 20 L30 80 L78 50 Z"
              fill="none"
              stroke="url(#logo-grad-primary)"
              strokeWidth="5"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {/* Inner Pulse */}
            <motion.circle
              cx="46"
              cy="50"
              r="8"
              fill="#BD00FF"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Factory Gear Teeth (small accents) */}
            <motion.path
              d="M68 35 L78 30 M68 65 L78 70 M78 50 L88 50"
              stroke="url(#logo-grad-green)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>

          {/* Scanline */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(189, 0, 255, 0.03) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>
      </motion.div>

      {/* Text */}
      {!hideText && (
        <div className="flex flex-col">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${sizes[size].text} font-black text-[#BD00FF] italic tracking-tighter uppercase leading-none font-headline`}
            style={{ textShadow: '0 0 20px rgba(189, 0, 255, 0.4)' }}
          >
            VIDEOMILL
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className={`${sizes[size].tagline} font-data-mono text-zinc-500 uppercase tracking-[0.2em] mt-1`}
          >
            NON-STOP VIRAL ENGINE
          </motion.span>
        </div>
      )}
    </div>
  );
}
