import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'md', hideText = false }: { size?: 'sm' | 'md' | 'lg'; hideText?: boolean }) {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-lg', icon: 16 },
    md: { box: 'w-10 h-10', text: 'text-2xl', icon: 20 },
    lg: { box: 'w-16 h-16', text: 'text-4xl', icon: 32 },
  };

  return (
    <div className="flex items-center gap-3 group select-none">
      <div className={`relative ${sizes[size].box}`}>
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-neon-cyan/30 rounded-lg"
        />
        
        {/* Inner pulsing core */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-2 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-md shadow-[0_0_15px_rgba(0,245,255,0.5)] flex items-center justify-center"
        >
          <div className="w-1/2 h-1/2 bg-white/20 rounded-full blur-[2px]" />
        </motion.div>

        {/* Floating particles around logo */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-neon-amber rounded-full shadow-[0_0_8px_#ffaa00] blur-[1px]"
        />
      </div>

      {!hideText && (
        <div className="flex flex-col leading-none">
          <span className={`${sizes[size].text} font-black tracking-tighter text-white`}>
            VIDEO<span className="text-neon-cyan italic">MILL</span>
          </span>
          <span className="text-[10px] font-mono text-neon-cyan/50 tracking-[0.3em] uppercase">
            Factory OS
          </span>
        </div>
      )}
    </div>
  );
}
