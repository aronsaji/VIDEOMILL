import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function Logo({ size = 'md', hideText = false }: LogoProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-xl', scale: 0.6 },
    md: { container: 'w-24 h-24', text: 'text-3xl', scale: 1 },
    lg: { container: 'w-36 h-36', text: 'text-5xl', scale: 1.5 },
  };

  return (
    <div className="flex items-center gap-6 group cursor-pointer select-none">
      {/* 3D Animated Identity Mark */}
      <motion.div 
        animate={{ 
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [0, 5, 0, -5, 0],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`relative ${sizes[size].container} perspective-1000 flex items-center justify-center`}
      >
        {/* Deep Atmospheric Glows */}
        <div className="absolute top-1/2 left-0 w-full h-full bg-neon-purple/20 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-full h-full bg-neon-cyan/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />

        {/* The 'M' Frame SVG */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          style={{ transform: `scale(${sizes[size].scale})` }}
        >
          <defs>
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2d3e" />
              <stop offset="50%" stopColor="#1a1c2c" />
              <stop offset="100%" stopColor="#0a0b16" />
            </linearGradient>
            <linearGradient id="purple-neon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bc13fe" />
              <stop offset="100%" stopColor="#6a0dad" />
            </linearGradient>
            <linearGradient id="cyan-neon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#008b8b" />
            </linearGradient>
            <linearGradient id="green-neon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff00" />
              <stop offset="100%" stopColor="#008000" />
            </linearGradient>
          </defs>

          {/* Main 'M' Structure */}
          <path 
            d="M40 160 L40 40 L100 80 L160 40 L160 160" 
            fill="none" 
            stroke="url(#metal-grad)" 
            strokeWidth="24" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M40 160 L40 40 L100 80 L160 40 L160 160" 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            opacity="0.1"
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Left Conveyor Track */}
          <mask id="mask-left">
            <path d="M40 160 L40 40" stroke="white" strokeWidth="18" strokeLinecap="round" />
          </mask>
          <g mask="url(#mask-left)">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.rect
                key={`left-${i}`}
                x="32"
                y={i * 25}
                width="16"
                height="8"
                rx="2"
                fill="#bc13fe"
                animate={{ y: [i * 25, (i + 1) * 25] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </g>

          {/* Right Conveyor Track */}
          <mask id="mask-right">
            <path d="M160 40 L160 160" stroke="white" strokeWidth="18" strokeLinecap="round" />
          </mask>
          <g mask="url(#mask-right)">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <motion.rect
                key={`right-${i}`}
                x="152"
                y={i * 25}
                width="16"
                height="8"
                rx="2"
                fill="#00ff00"
                animate={{ y: [i * 25, (i + 1) * 25] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </g>

          {/* Central Camera Iris Housing */}
          <circle cx="100" cy="80" r="38" fill="#1a1c2c" stroke="#bc13fe" strokeWidth="4" />
          <circle cx="100" cy="80" r="34" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.5" />
          
          {/* Rotating Iris Blades */}
          <g transform="translate(100, 80)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <path
                  key={i}
                  d="M0 -30 C15 -30, 25 -15, 25 0 L0 0 Z"
                  fill="#2a2d3e"
                  stroke="#bc13fe"
                  strokeWidth="0.5"
                  transform={`rotate(${angle})`}
                />
              ))}
            </motion.g>
          </g>

          {/* Central Lens Eye */}
          <circle cx="100" cy="80" r="12" fill="#000" />
          <motion.circle 
            cx="100" cy="80" r="6" 
            fill="#00f5ff"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx="98" cy="78" r="2" fill="white" opacity="0.5" />

          {/* Neon Circuit Paths */}
          <motion.path 
            d="M100 120 L100 160 L140 180" 
            stroke="#00ff00" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="100"
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path 
            d="M100 120 L100 160 L60 180" 
            stroke="#bc13fe" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="100"
            animate={{ strokeDashoffset: [100, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </svg>

        {/* Ambient Ring */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
          className="absolute inset-[-10px] border border-white/5 rounded-full z-0"
        />
      </motion.div>

      {/* Typography Area */}
      {!hideText && (
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <span className={`${sizes[size].text} font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
              Video<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Mill</span>
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mt-2"
          >
            <div className="h-[1.5px] w-12 bg-gradient-to-r from-neon-purple to-neon-cyan" />
            <span className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] italic group-hover:text-neon-cyan transition-colors">
              The Non-Stop Viral Engine
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}
