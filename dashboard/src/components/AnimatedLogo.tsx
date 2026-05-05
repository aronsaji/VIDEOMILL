import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: { container: 'h-10', box: 'w-8 h-8', text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { container: 'h-14', box: 'w-12 h-12', text: 'text-2xl', dot: 'w-2 h-2' },
    lg: { container: 'h-24', box: 'w-20 h-20', text: 'text-5xl', dot: 'w-4 h-4' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-4 ${currentSize.container}`}>
      <div className={`relative ${currentSize.box} flex items-center justify-center`}>
        {/* Organic Base Layer */}
        <motion.div
          animate={{ 
            borderRadius: ["25% 75% 70% 30% / 30% 30% 70% 70%", "75% 25% 30% 70% / 70% 70% 30% 30%", "25% 75% 70% 30% / 30% 30% 70% 70%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[#b1cdb7] opacity-20 blur-sm"
        />
        
        {/* Core Technical Box */}
        <motion.div 
          className="w-full h-full border border-[#b1cdb7]/40 rounded-soft-sm relative flex items-center justify-center bg-[#131412]"
          whileHover={{ borderColor: '#b1cdb7', scale: 1.05 }}
        >
          <div className={`relative flex flex-col items-center gap-1`}>
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className={`${currentSize.dot} bg-[#b1cdb7] rounded-full shadow-[0_0_10px_#b1cdb7]`} 
             />
             <div className="w-[1px] h-3 bg-gradient-to-b from-[#b1cdb7] to-transparent opacity-40" />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${currentSize.text} font-headline-md text-[#e4e2e0] uppercase italic tracking-tighter leading-none flex items-baseline gap-1`}
        >
          Video<span className="text-[#b1cdb7]">mill</span>
        </motion.span>
        {size !== 'sm' && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="font-label-sm text-[#b1cdb7] text-[9px] uppercase tracking-[0.4em] mt-1"
          >
            Naturalist_Studio_v2
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default AnimatedLogo;
