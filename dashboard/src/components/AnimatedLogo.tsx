import React from 'react';
import { motion } from 'framer-motion';
import { Video, Zap, Cpu, Radio } from 'lucide-react';

export default function AnimatedLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-xs', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 24, text: 'text-xl', sub: 'text-[10px]', gap: 'gap-3' },
    lg: { icon: 32, text: 'text-3xl', sub: 'text-xs', gap: 'gap-4' },
    xl: { icon: 48, text: 'text-6xl', sub: 'text-sm', gap: 'gap-6' },
  };

  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${s.gap} select-none`}>
      <div className="relative">
        {/* Outer Glow Ring */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -inset-4 border border-primary-container/30 rounded-xl blur-sm"
        />
        
        {/* Kinetic Frame */}
        <motion.div 
          className="relative bg-black border border-primary-container/20 p-4 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.15)] flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ translateY: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/10 to-transparent w-full h-1/2 pointer-events-none"
          />

          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                filter: ["drop-shadow(0 0 0px #22d3ee)", "drop-shadow(0 0 8px #22d3ee)", "drop-shadow(0 0 0px #22d3ee)"]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Video size={s.icon} className="text-primary-container" />
            </motion.div>
            
            <motion.div 
              className="absolute"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap size={s.icon * 1.5} className="text-primary-container opacity-20" />
            </motion.div>
          </div>
        </motion.div>

        {/* Tactical Corner Marks */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary-container" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary-container" />
      </div>

      <div className="text-center">
        <motion.h1 
          className={`${s.text} font-black text-white font-headline-md tracking-tighter italic uppercase leading-none mb-2 flex items-center justify-center gap-2`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Video<span className="text-primary-container">Mill</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1 h-[0.8em] bg-primary-container inline-block align-middle ml-1"
          />
        </motion.h1>
        
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          <motion.div 
            className="h-[1px] bg-primary-container/20 w-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
          <motion.p 
            className={`${s.sub} font-mono font-black uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            The Non-Stop Viral Engine
          </motion.p>
          <motion.div 
            className="h-[1px] bg-primary-container/20 w-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
          />
        </div>
      </div>
      
      {/* Neural Link Status Indicator */}
      <motion.div 
        className="flex items-center gap-2 px-3 py-1 bg-primary-container/5 rounded-full border border-primary-container/10 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Radio size={10} className="text-primary-container animate-pulse" />
        <span className="text-[8px] font-mono font-black text-primary-container/60 uppercase tracking-[0.2em]">Autopilot_Engaged</span>
      </motion.div>
    </div>
  );
}
