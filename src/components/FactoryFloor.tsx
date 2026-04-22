import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useVideos } from '../lib/hooks/uselivedata';
import { useLanguage } from '../contexts/languageContext';
import { useAuth } from '../contexts/authContext';
import { Film, Zap, Activity, TrendingUp, Shield, Plus, Play, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import LivePipelineCard from './LivePipelineCard';
import GlassCard from './GlassCard';

type PipelineStatus = 'pending' | 'queued' | 'scripting' | 'voiceover' | 'recording' | 'editing' | 'rendering' | 'complete' | 'failed';

interface PipelineJob {
  id: string;
  title: string;
  platform: string;
  progress: number;
  status: PipelineStatus;
  steps: { id: string; label: string; status: PipelineStatus; progress: number }[];
  createdAt: Date;
}

const mockJobs: PipelineJob[] = [
  {
    id: '1',
    title: 'AI Tech Update #42',
    platform: 'tiktok',
    progress: 65,
    status: 'recording',
    createdAt: new Date(),
    steps: [
      { id: 's1', label: 'Script', status: 'complete', progress: 100 },
      { id: 's2', label: 'Voice', status: 'complete', progress: 100 },
      { id: 's3', label: 'Vision', status: 'complete', progress: 100 },
      { id: 's4', label: 'Edit', status: 'complete', progress: 100 },
      { id: 's5', label: 'Render', status: 'complete', progress: 100 },
      { id: 's6', label: 'Export', status: 'recording', progress: 30 },
    ],
  },
  {
    id: '2',
    title: 'Viral Product Demo',
    platform: 'youtube',
    progress: 30,
    status: 'scripting',
    createdAt: new Date(),
    steps: [
      { id: 's1', label: 'Script', status: 'complete', progress: 100 },
      { id: 's2', label: 'Voice', status: 'scripting', progress: 45 },
      { id: 's3', label: 'Vision', status: 'pending', progress: 0 },
      { id: 's4', label: 'Edit', status: 'pending', progress: 0 },
      { id: 's5', label: 'Render', status: 'pending', progress: 0 },
      { id: 's6', label: 'Export', status: 'pending', progress: 0 },
    ],
  },
  {
    id: '3',
    title: 'Trend Alert: AI News',
    platform: 'instagram',
    progress: 100,
    status: 'complete',
    createdAt: new Date(),
    steps: [
      { id: 's1', label: 'Script', status: 'complete', progress: 100 },
      { id: 's2', label: 'Voice', status: 'complete', progress: 100 },
      { id: 's3', label: 'Vision', status: 'complete', progress: 100 },
      { id: 's4', label: 'Edit', status: 'complete', progress: 100 },
      { id: 's5', label: 'Render', status: 'complete', progress: 100 },
      { id: 's6', label: 'Export', status: 'complete', progress: 100 },
    ],
  },
];

export default function FactoryFloor() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: videos, loading } = useVideos();
  const [activeJobs, setActiveJobs] = useState<PipelineJob[]>(mockJobs);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs(jobs => 
        jobs.map(job => {
          if (job.status === 'complete' || job.status === 'failed') return job;
          
          // Randomly progress some jobs
          const updatedSteps = job.steps.map((step, i) => {
            if (step.status === 'complete') return step;
            if (step.status === 'pending' && Math.random() > 0.7) {
              return { ...step, status: 'queued' as PipelineStatus, progress: 20 };
            }
            if (step.status === 'queued' || step.status === 'scripting' || step.status === 'voiceover' || step.status === 'recording' || step.status === 'editing') {
              const newProgress = Math.min(step.progress + Math.random() * 20, 100);
              const newStatus = newProgress >= 100 ? (i < job.steps.length - 1 ? job.steps[i + 1].status : 'complete' as PipelineStatus) : step.status;
              return { ...step, progress: newProgress, status: newStatus };
            }
            return step;
          });
          
          const allComplete = updatedSteps.every(s => s.status === 'complete');
          return { ...job, steps: updatedSteps, status: allComplete ? 'complete' as PipelineStatus : job.status };
        })
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const activeCount = activeJobs.filter(j => j.status !== 'complete' && j.status !== 'failed').length;
  const completeCount = activeJobs.filter(j => j.status === 'complete').length;
  const failedCount = activeJobs.filter(j => j.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
              <div className="text-xs text-white/40">Active Pipelines</div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completeCount}</div>
              <div className="text-xs text-white/40">Completed</div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2m</div>
              <div className="text-xs text-white/40">Avg. Time</div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="text-xs text-white/40">Success Rate</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Factory Floor Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Factory Floor</h2>
          <p className="text-sm text-white/40">Live pipeline monitor • {activeJobs.length} jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs text-teal-400">System Online</span>
          </div>
        </div>
      </div>

      {/* Pipeline Cards */}
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeJobs.map(job => (
            <LivePipelineCard
              key={job.id}
              jobId={job.id}
              title={job.title}
              platform={job.platform}
              steps={job.steps}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Neural Grid Background Pulse */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute inset-0 neural-grid" style={{ backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}