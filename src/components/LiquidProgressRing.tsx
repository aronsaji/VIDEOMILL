import { motion } from 'framer-motion';

interface LiquidProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  status?: 'pending' | 'active' | 'complete' | 'error';
}

export default function LiquidProgressRing({ 
  progress, 
  size = 60, 
  strokeWidth = 4,
  status = 'active'
}: LiquidProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const isComplete = status === 'complete';
  const isError = status === 'error';
  
  const strokeColor = isError 
    ? '#ef4444' 
    : isComplete 
      ? '#14b8a6' 
      : '#8b5cf6';

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor={isComplete ? '#14b8a6' : '#a78bfa'} />
          </linearGradient>
        </defs>
        
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        
        <motion.circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            stroke: strokeColor
          }}
          transition={{ 
            type: 'spring',
            stiffness: 30,
            damping: 20
          }}
          style={isComplete ? { animation: 'ringGlitch 0.4s ease-out' } : undefined}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium" style={{ color: strokeColor }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}