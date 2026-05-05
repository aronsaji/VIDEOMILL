import React from 'react';
import { motion } from 'framer-motion';
import { Video, Zap, Cpu, Radio } from 'lucide-react';

export default function AnimatedLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-sm', sub: 'text-[9px]', gap: 'gap-2', padding: 'p-2' },
    md: { icon: 24, text: 'text-2xl', sub: 'text-[11px]', gap: 'gap-3', padding: 'p-4' },
    lg: { icon: 32, text: 'text-4xl', sub: 'text-sm', gap: 'gap-4', padding: 'p-6' },
    xl: { icon: 48, text: 'text-7xl', sub: 'text-base', gap: 'gap-6', padding: 'p-10' },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.gap} select-none`}>
      <div className="relative">
        {/* Outer Glow Ring - Royal Blue Theme */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -inset-4 border border-[#4169E1]/30 rounded-2xl blur-sm"
        />
        
        {/* Kinetic Frame - Royal Blue Background for visibility */}
        <motion.div 
          className="relative bg-[#4169E1] border-2 border-[#1E3A8A] p-4 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden group"
          whileHover={{ scale: 1.05, borderColor: '#ffffff' }}
        >
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ translateY: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent w-full h-1/2 pointer-events-none"
          />

          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                filter: ["drop-shadow(0 0 0px #ffffff)", "drop-shadow(0 0 8px #ffffff)", "drop-shadow(0 0 0px #ffffff)"]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Video size={s.icon} className="text-white" />
            </motion.div>
            
            <motion.div 
              className="absolute"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.4, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap size={s.icon * 1.5} className="text-white opacity-40" />
            </motion.div>
          </div>
        </motion.div>

        {/* Tactical Corner Marks */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#4169E1]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#4169E1]" />
      </div>

      <div className="text-center">
        <motion.h1 
          className={`${s.text} font-black text-[#1E3A8A] font-headline-md tracking-tighter italic uppercase leading-none mb-1 flex items-center justify-center gap-1`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Video<span className="text-[#4169E1]">Mill</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-[0.8em] bg-[#4169E1] inline-block align-middle ml-1"
          />
        </motion.h1>
        
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          <motion.div 
            className="h-[1px] bg-[#4169E1]/20 w-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
          <motion.p 
            className={`${s.sub} font-mono font-black uppercase tracking-[0.3em] text-[#4169E1] whitespace-nowrap italic opacity-80`}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Autonomous_Cinema
          </motion.p>
          <motion.div 
            className="h-[1px] bg-[#4169E1]/20 w-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
        </div>
      </div>
      
      {/* Neural Link Status Indicator */}
      <motion.div 
        className="flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline rounded-full mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[9px] font-mono font-black text-[#4169E1] uppercase tracking-[0.2em] italic">Core_Stable</span>
      </motion.div>
    </div>
  );
}
