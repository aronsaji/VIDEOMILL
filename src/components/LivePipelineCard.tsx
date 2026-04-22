import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

type PipelineStatus = 'pending' | 'queued' | 'scripting' | 'voiceover' | 'recording' | 'editing' | 'rendering' | 'complete' | 'failed';

interface PipelineStep {
  id: string;
  label: string;
  status: PipelineStatus;
  progress: number;
}

interface LivePipelineCardProps {
  jobId: string;
  title: string;
  steps: PipelineStep[];
  platform?: string;
  thumbnail?: string;
}

const statusColors: Record<PipelineStatus, { bg: string; text: string; border: string; glow: string }> = {
  pending:   { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10', glow: 'shadow-white/5' },
  queued:   { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
  scripting: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40', glow: 'shadow-violet-500/30' },
  voiceover: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'shadow-purple-500/30' },
  recording: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/40', glow: 'shadow-teal-500/30' },
  editing: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/30' },
  rendering: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/30' },
  complete: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/40', glow: 'shadow-teal-500/30' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', glow: 'shadow-red-500/30' },
};

const LiquidStepIndicator = ({ step, isActive, isComplete }: { step: PipelineStep; isActive: boolean; isComplete: boolean }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isActive && !isComplete) {
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 15, step.progress));
      }, 300);
      return () => clearInterval(interval);
    } else if (isComplete) {
      setProgress(100);
    }
  }, [isActive, isComplete, step.progress]);

  const colors = statusColors[step.status];
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="44" height="44" className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={`${colors.text} opacity-20`}
        />
        {/* Progress ring */}
        <motion.circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ type: 'spring', stiffness: 30, damping: 20 }}
          className={colors.text}
          style={{
            filter: isActive ? `drop-shadow(0 0 6px var(--tw-colors-${colors.text.replace('text-', '')}))` : undefined,
          }}
        />
      </svg>
      
      {/* Status indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-2 h-2 rounded-full ${colors.bg} ${colors.text}`}
          />
        ) : isActive ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-2 h-2 rounded-full ${colors.text}`}
          />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${colors.text} opacity-30`} />
        )}
      </div>
    </div>
  );
};

export default function LivePipelineCard({ jobId, title, steps, platform }: LivePipelineCardProps) {
  const activeStepIndex = steps.findIndex(s => s.status !== 'pending' && s.status !== 'complete' && s.status !== 'failed');
  const currentStep = activeStepIndex >= 0 ? steps[activeStepIndex] : null;
  const isFailed = steps.some(s => s.status === 'failed');
  const isComplete = steps.every(s => s.status === 'complete');

  const getOverallProgress = () => {
    const completedWeight = steps.filter(s => s.status === 'complete').length;
    return Math.round((completedWeight / steps.length) * 100);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border ${
        isFailed ? 'border-red-500/30 bg-red-500/5' 
        : isComplete ? 'border-teal-500/30 bg-teal-500/5'
        : 'border-violet-500/20 bg-[#0a0a0f]'
      }`}
    >
      {/* Neural grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none neural-grid" style={{ backgroundSize: '40px 40px' }} />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-500 ${
        currentStep ? 'animate-pulse' : ''
      }`} style={{
        background: currentStep 
          ? `radial-gradient(600px circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 50%)`
          : 'transparent'
      }} />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${
              isFailed ? 'bg-red-500/20' : isComplete ? 'bg-teal-500/20' : 'bg-violet-500/20'
            } flex items-center justify-center`}>
              {isFailed ? (
                <span className="text-red-400">✕</span>
              ) : isComplete ? (
                <span className="text-teal-400 animate-pulse">✓</span>
              ) : (
                <div className="w-3 h-3 rounded-full bg-violet-400 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{title}</h3>
              <p className="text-white/40 text-xs">
                {isComplete ? 'Complete' : isFailed ? 'Failed' : `Running: ${currentStep?.label || 'Initializing...'}`}
              </p>
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              isFailed ? 'text-red-400' : isComplete ? 'text-teal-400' : 'text-violet-400'
            }`}>
              {isFailed || isComplete ? (isComplete ? '100' : '0') : getOverallProgress()}%
            </div>
            <div className="text-white/30 text-xs">Overall</div>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isComplete = step.status === 'complete';
            const isActive = index === activeStepIndex;
            const isFailed = step.status === 'failed';
            
            return (
              <div key={step.id} className="flex-1 flex flex-col items-center gap-2">
                <LiquidStepIndicator
                  step={step}
                  isActive={isActive}
                  isComplete={isComplete}
                />
                <span className={`text-[10px] font-medium ${
                  isFailed ? 'text-red-400' 
                  : isComplete ? 'text-teal-400'
                  : isActive ? 'text-violet-300'
                  : 'text-white/30'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connecting line */}
        <div className="flex items-center justify-center mt-3">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </div>

      {/* Status badge */}
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-semibold ${
        isFailed ? 'bg-red-500/20 text-red-400 border border-red-500/30'
        : isComplete ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
        : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
      } border`}>
        {isFailed ? 'FAILED' : isComplete ? 'COMPLETE' : platform?.toUpperCase() || 'PROCESSING'}
      </div>
    </motion.div>
  );
}