import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'violet' | 'teal' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function MagneticButton({ 
  children, 
  variant = 'violet', 
  size = 'md',
  className = '',
  ...props 
}: MagneticButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl border-none cursor-pointer';
  
  const variants = {
    violet: 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]',
    teal: 'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_30px_rgba(20,184,166,0.4)]',
    ghost: 'bg-transparent border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/50',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}