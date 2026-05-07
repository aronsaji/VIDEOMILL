import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Factory as FactoryIcon, 
  Cpu, 
  Settings, 
  Play, 
  StopCircle, 
  AlertCircle,
  CheckCheck,
  Layers,
  Container,
  Activity,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Production } from '../types';

interface RenderJob {
  id: string;
  name: string;
  progress: number;
  status: 'rendering' | 'completed' | 'queued' | 'failed';
  worker: string;
  eta: string;
  raw?: Production;
}

export const Factory = () => {
  const { t } = useTranslation();
  const [activeJobs, setActiveJobs] = useState<RenderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('productions')
        .select('id, title, status, progress, duration, created_at, error')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        const mappedJobs: RenderJob[] = data.map((prod: Production) => ({
          id: prod.id,
          name: prod.title,
          progress: prod.progress || 0,
          status: prod.status === 'processing' ? 'rendering' : 
                  prod.status === 'completed' ? 'completed' : 
                  prod.status === 'failed' ? 'failed' : 'queued',
          worker: prod.status === 'processing' ? `Node-${Math.floor(Math.random() * 20).toString().padStart(2, '0')}` : 'Standby',
          eta: prod.status === 'processing' ? 'Beregner...' : '00:00',
          raw: prod
        }));
        setActiveJobs(mappedJobs as any);
      }
    } catch (err: any) {
      console.error("Fetch jobs error:", err);
      setErrorStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productions',
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStop = async (id: string) => {
    try {
      await supabase
        .from('productions')
        .update({ status: 'failed', error: 'Stopped by user' })
        .eq('id', id);
    } catch (err) {
      console.error("Stop error:", err);
    }
  };

  const handleStart = async (job: RenderJob) => {
    try {
      // 1. Update status in Supabase
      await supabase
        .from('productions')
        .update({ status: 'processing', progress: 0 })
        .eq('id', job.id);
      
      // 2. Trigger n8n retry
      if (job.raw) {
        await fetch('/api/retry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...job.raw,
            video_id: job.id,
            retry: true
          }),
        });
      }
    } catch (err) {
      console.error("Start error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('factory.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('factory.subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-2 rounded-lg flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="mono text-[8px] text-text-muted uppercase tracking-widest">Total Kapasitet</span>
              <span className="mono text-xs text-primary font-bold">142.4 GHZ / 2TB VRAM</span>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
               <Activity size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-xl">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-display uppercase tracking-widest flex items-center gap-3">
                 <Container className="text-primary" size={20} /> {t('factory.queue')}
               </h3>
               <div className="flex gap-2">
                 <button className="p-2 border border-outline hover:border-primary text-text-muted hover:text-primary rounded transition-all">
                   <Settings size={16} />
                 </button>
               </div>
             </div>

             <div className="space-y-4">
               {loading ? (
                 <div className="flex flex-col items-center justify-center p-20 gap-4">
                   <Loader2 className="animate-spin text-primary" size={32} />
                   <p className="mono text-[10px] uppercase tracking-widest text-text-muted">Synkroniserer med Nevral Cluster...</p>
                 </div>
               ) : errorStatus ? (
                 <div className="p-10 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
                    <AlertCircle className="text-red-400 mx-auto mb-3" size={24} />
                    <p className="mono text-[10px] uppercase text-red-400 font-bold mb-1">CLUSTER TILKOBLINGSFEIL</p>
                    <p className="text-[9px] text-text-muted">{errorStatus}</p>
                 </div>
               ) : activeJobs.length === 0 ? (
                 <div className="p-20 text-center border border-dashed border-outline rounded-xl">
                    <p className="mono text-[10px] uppercase tracking-widest text-text-muted">Ingen aktive produksjoner i køen...</p>
                    <button 
                      onClick={() => window.location.href = '/create'}
                      className="mt-4 text-[10px] text-primary hover:underline uppercase font-bold"
                    >
                      Start en ny produksjon
                    </button>
                 </div>
               ) : (
                 <AnimatePresence mode="popLayout">
                   {activeJobs.map(job => (
                     <motion.div 
                       layout
                       key={job.id} 
                       className={cn(
                         "bg-surface/50 border border-outline rounded-lg p-5 flex flex-col items-stretch lg:flex-row lg:items-center gap-4 group transition-all",
                         job.status === 'rendering' && "border-primary/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.02)]",
                         job.status === 'failed' && "border-red-500/20"
                       )}
                     >
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-2">
                           <h4 className="font-bold truncate">{job.name}</h4>
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[8px] mono uppercase tracking-widest font-black",
                             job.status === 'completed' ? "bg-emerald-400 text-background" : 
                             job.status === 'rendering' ? "bg-primary text-background" : 
                             job.status === 'failed' ? "bg-red-500 text-white" : "bg-surface text-text-muted"
                           )}>
                             {job.status}
                           </span>
                         </div>
                         <div className="flex items-center gap-6 mt-1 text-text-muted mono text-[10px] uppercase tracking-widest">
                           <div className="flex items-center gap-1.5"><Cpu size={12} /> {job.worker}</div>
                           <div className="flex items-center gap-1.5"><FactoryIcon size={12} /> ETA: {job.eta}</div>
                           <div className="flex items-center gap-1.5"><Layers size={12} /> Render-Index: #{job.id.substring(0, 4)}</div>
                         </div>
                       </div>

                       <div className="lg:w-64 flex flex-col gap-2">
                         <div className="flex justify-between mono text-[10px] uppercase text-text-muted px-1">
                           <span>Fremdrift</span>
                           <span className="text-primary">{Math.round(job.progress)}%</span>
                         </div>
                         <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${job.progress}%` }}
                             className={cn(
                               "h-full shadow-[0_0_8px_currentColor]",
                               job.status === 'completed' ? "bg-emerald-400 text-emerald-400" : 
                               job.status === 'failed' ? "bg-red-500 text-red-500" : "bg-primary text-primary"
                             )} 
                           />
                         </div>
                       </div>

                       <div className="flex gap-2">
                         {job.status === 'rendering' && (
                           <button 
                             onClick={() => handleStop(job.id)}
                             className="p-2.5 bg-surface border border-outline hover:border-red-400 hover:text-red-400 rounded-lg transition-all"
                           >
                             <StopCircle size={18} />
                           </button>
                         )}
                         {(job.status === 'queued' || job.status === 'failed') && (
                           <button 
                             onClick={() => handleStart(job)}
                             className="p-2.5 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-background rounded-lg transition-all"
                           >
                             <Play size={18} />
                           </button>
                         )}
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-xl border border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] animate-pulse" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/30 transform group-hover:rotate-12 transition-transform">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-display font-black tracking-tight mb-4 uppercase">System Varsel</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6 font-medium">
                Node-07 rapporterer om termisk kutt i GPU-kjerne 4. Automatisk omfordeling av ressurser er utført for å opprettholde render-hastighet.
              </p>
              <div className="flex items-center gap-2 text-[10px] mono text-primary uppercase font-bold py-2 px-3 bg-primary/5 border border-primary/10 rounded tracking-[0.2em]">
                Status: Balansert
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-xl">
             <h3 className="text-[10px] mono uppercase tracking-[0.3em] text-text-muted mb-8">Node Ressursfordeling</h3>
             <div className="space-y-8">
               {[
                 { label: 'GPU Cluster Alpha', val: 92 },
                 { label: 'GPU Cluster Beta', val: 45 },
                 { label: 'Asset Storage', val: 78 },
                 { label: 'Network I/O', val: 32 },
               ].map(node => (
                 <div key={node.label}>
                   <div className="flex justify-between items-center mb-3">
                     <span className="mono text-[10px] uppercase tracking-widest">{node.label}</span>
                     <span className="mono text-[10px] text-primary">{node.val}%</span>
                   </div>
                   <div className="h-1 bg-surface rounded-full overflow-hidden flex gap-[2px]">
                     {Array.from({ length: 20 }).map((_, i) => (
                       <div 
                         key={i} 
                         className={cn(
                           "h-full flex-1 transition-all duration-1000",
                           (i / 20) * 100 < node.val ? "bg-primary" : "bg-outline/20"
                         )} 
                       />
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
