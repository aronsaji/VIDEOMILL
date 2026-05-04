import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function Logo({ size = 'md', hideText = false }: LogoProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-xl', stroke: 2 },
    md: { container: 'w-16 h-16', text: 'text-3xl', stroke: 2.5 },
    lg: { container: 'w-24 h-24', text: 'text-5xl', stroke: 3 },
  };

  return (
    <div className="flex items-center gap-6 group cursor-pointer select-none">
      {/* Procedural Holographic Logo */}
      <div className={`relative ${sizes[size].container} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-neon-purple/20 blur-2xl rounded-full group-hover:bg-neon-purple/40 transition-all duration-700" />
        
        {/* Kinetic Orbital Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-4px] border border-neon-purple/20 rounded-xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-8px] border border-neon-cyan/10 rounded-full"
        />

        {/* SVG Geometric Core */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(188,19,254,0.5)]"
        >
          {/* Hexagon Frame */}
          <motion.path
            d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth={sizes[size].stroke}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Stylized 'M' Construction */}
          <motion.path
            d="M25 70 L25 30 L50 55 L75 30 L75 70"
            fill="none"
            stroke="white"
            strokeWidth={sizes[size].stroke * 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Shutter Blades (Animated) */}
          <g className="origin-center">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.path
                key={i}
                d="M50 50 L50 35 L60 40 Z"
                fill="currentColor"
                className="text-neon-cyan"
                animate={{ 
                  rotate: [angle, angle + 360],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                }}
                style={{ originX: '50px', originY: '50px' }}
              />
            ))}
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bc13fe" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Power Core */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_#fff]"
        />
      </div>

      {/* Typography Area */}
      {!hideText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className={`${sizes[size].text} font-black text-white italic tracking-tighter uppercase leading-none`}>
              Video<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Mill</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-[1.5px] w-12 bg-gradient-to-r from-neon-purple to-transparent" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] italic group-hover:text-neon-cyan transition-colors">
              Neural Production Grid
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
