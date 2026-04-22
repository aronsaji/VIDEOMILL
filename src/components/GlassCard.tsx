import { useState, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export default function GlassCard({ children, className = '', hoverGlow = true }: GlassCardProps) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: '50%', y: '50%' });
  };

  return (
    <div
      ref={ref}
      className={`glass-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-x': mousePos.x,
        '--mouse-y': mousePos.y,
      } as React.CSSProperties}
    >
      {/* Glow follower layer */}
      {hoverGlow && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x} ${mousePos.y}, rgba(139, 92, 246, 0.12), transparent 40%)`,
            opacity: mousePos.x === '50%' && mousePos.y === '50%' ? 0 : 1,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}