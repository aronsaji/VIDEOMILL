import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const containerVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={containerVariants}
      className={cn("relative group", sizes[size], className)}
    >
      {/* 3D Depth Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [0.9, 1.2, 0.9],
          rotate: [0, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-8 bg-[conic-gradient(from_0deg,var(--color-primary)_0%,var(--color-accent)_50%,var(--color-primary)_100%)] opacity-20 rounded-full blur-3xl pointer-events-none" 
      />
      
      <div className={cn(
        "relative w-full h-full bg-black border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl",
        size === 'xl' ? 'rounded-[2.5rem]' : size === 'lg' ? 'rounded-[2rem]' : 'rounded-2xl'
      )}>
        {/* Particle System */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_#22d3ee]"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0
              }}
              animate={{ 
                y: ["-20%", "120%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Animated Tech Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] bg-[size:12px_12px]" />

        {/* The SVG Logo Mark */}
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] relative z-10">
          <defs>
            <linearGradient id="logo-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
            <filter id="ultra-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background Ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="4 8" />
          
          {/* Main "M" Structure */}
          <motion.path 
            d="M25 75 V25 L50 55 L75 25 V75" 
            fill="none" 
            stroke="url(#logo-grad-main)" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "circOut" }}
            style={{ filter: 'url(#ultra-glow)' }}
          />

          {/* Double Spinning Gears */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '50% 50%' }}>
             <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
             <rect x="48" y="28" width="4" height="6" rx="1" fill="rgba(255,255,255,0.15)" />
             <rect x="48" y="66" width="4" height="6" rx="1" fill="rgba(255,255,255,0.15)" />
             <rect x="28" y="48" width="6" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
             <rect x="66" y="48" width="6" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
          </motion.g>

          <motion.g animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '50% 50%' }}>
             <circle cx="50" cy="50" r="12" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
          </motion.g>

          {/* Central Reactor Core */}
          <motion.circle 
            cx="50" cy="50" r="4" 
            fill="white"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: 'drop-shadow(0 0 8px var(--color-primary))' }}
          />
        </svg>

        {/* Scanning Beam (Vertical) */}
        <motion.div 
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 w-16 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 pointer-events-none"
        />
      </div>

      {/* Outer Floating Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-15%] border border-primary/5 rounded-full border-dashed pointer-events-none"
      />
    </motion.div>
  );
};
