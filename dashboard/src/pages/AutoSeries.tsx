import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Zap, Activity, Clock, BarChart3, Settings2, 
  ChevronRight, Play, Terminal, Layers, 
  Calendar, RotateCcw, AlertCircle, Radio,
  Cpu, Target, ArrowUpRight, Box, PlayCircle
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';

export default function AutoSeries() {
  const { t } = useI18nStore();
  const { series, episodes, analyticsData, fetchInitialData, isLoading } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR_v2.0
          </div>
          <h1 className="text-6xl font-black text-on-surface font-headline-md tracking-tighter italic uppercase leading-none">
            Auto_<span className="text-primary">Pilot</span>
          </h1>
          <p className="text-on-surface-variant mt-4 font-mono text-[10px] uppercase tracking-widest font-black italic">Protocol: Async-Render-Stack // Nodes: 14 Active</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
          <div className="bg-surface border border-outline p-4 rounded-3xl flex items-center gap-6 shadow-sm">
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] text-on-surface-variant uppercase font-black tracking-widest mb-1 opacity-40">Global_AutoPilot</span>
                <span className="text-[10px] font-black text-primary uppercase italic">System_Active</span>
             </div>
             <button 
               className="w-16 h-8 bg-surface-container border border-outline rounded-full relative p-1 group overflow-hidden"
             >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-primary rounded-full shadow-lg shadow-primary/20 relative z-10"
                  initial={{ x: 32 }}
                />
             </button>
          </div>

          <button className="flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black italic uppercase text-sm tracking-widest hover:brightness-110 transition-all active:scale-95 group shadow-lg shadow-primary/20">
             New Pipeline
             <Zap size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'ACTIVE_SERIES', value: series.filter(s => s.status === 'active').length.toString().padStart(2, '0'), icon: RotateCcw, color: 'text-primary' },
           { label: 'SCHEDULED', value: episodes.length.toString().padStart(2, '0'), icon: Clock, color: 'text-primary' },
           { label: 'VELOCITY', value: '98.4%', icon: Activity, color: 'text-success' },
           { label: 'REACH_EST', value: formatNumber(analyticsData.totalViews || 0), icon: BarChart3, color: 'text-primary' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-surface border border-outline p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden shadow-sm hover:border-primary/30 transition-all duration-500"
           >
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className={`p-4 bg-surface-container rounded-2xl border border-outline ${stat.color} group-hover:scale-110 transition-all duration-500`}>
                    <stat.icon size={22} />
                 </div>
                 <span className="font-mono text-[9px] text-on-surface-variant uppercase font-black tracking-widest italic opacity-40">{stat.label}</span>
              </div>
              <div className="text-5xl font-black text-on-surface font-headline-md italic tracking-tighter leading-none relative z-10">{stat.value}</div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        <section className="col-span-12 lg:col-span-4">
           <div className="bg-surface border border-outline p-10 rounded-[3rem] min-h-[640px] flex flex-col relative overflow-hidden shadow-sm group">
              <div className="flex items-center gap-4 border-b border-outline pb-8 mb-10 relative z-10">
                 <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-primary">
                    <Calendar size={20} />
                 </div>
                 <h2 className="text-xs font-black text-on-surface uppercase italic tracking-[0.2em]">Transmission_Log</h2>
              </div>

              <div className="flex-1 space-y-10 relative z-10">
                 <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-outline opacity-30" />
                 
                 {episodes.length > 0 ? episodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-14 group cursor-crosshair"
                   >
                      <div className="absolute left-0 top-1 w-11 h-11 bg-surface border border-outline rounded-2xl flex items-center justify-center z-10 group-hover:border-primary transition-all duration-500 shadow-sm">
                         <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary animate-pulse shadow-[0_0_15px_rgba(8,145,178,0.3)]' : 'bg-outline'}`} />
                      </div>
                      
                      <div className="space-y-3 group-hover:translate-x-3 transition-transform duration-500">
                         <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-primary font-black uppercase tracking-[0.2em] italic bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="font-mono text-[8px] text-on-surface-variant font-black uppercase tracking-widest opacity-30">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="text-2xl font-black text-on-surface font-headline-md uppercase italic tracking-tight group-hover:text-primary transition-colors duration-500 leading-none">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-on-surface-variant uppercase font-black tracking-widest opacity-40">SERIES:</span>
                            <span className="font-mono text-[9px] text-on-surface-variant font-black uppercase italic tracking-widest">{ep.series?.title || 'GLOBAL_SEED'}</span>
                         </div>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-24">
                      <Terminal size={64} className="text-on-surface-variant mb-8 animate-pulse" />
                      <p className="text-on-surface-variant font-mono font-black uppercase tracking-[0.4em] text-[10px]">Awaiting next broadcast...</p>
                   </div>
                 )}
              </div>
           </div>
        </section>

        <section className="col-span-12 lg:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {series.length > 0 ? series.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={s.id}
                  className="bg-surface border border-outline p-10 rounded-[3rem] group hover:border-primary/30 transition-all duration-700 relative overflow-hidden shadow-sm flex flex-col min-h-[480px]"
                >
                   <div className="flex justify-between items-start mb-14 relative z-10">
                      <div className="p-6 bg-surface-container rounded-2xl border border-outline text-primary group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-700">
                         <RotateCcw size={32} className={s.status === 'active' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] italic border rounded-full ${
                          s.status === 'active' ? 'bg-success/10 text-success border-success/20 shadow-sm' : 'bg-error/5 text-error border-error/20'
                        }`}>
                           {s.status?.toUpperCase() || 'OFFLINE'}
                        </div>
                        {s.status === 'active' && <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                      </div>
                   </div>

                   <div className="flex-1 relative z-10">
                      <h3 className="text-4xl font-black text-on-surface font-headline-md uppercase italic mb-4 tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
                         {s.title || 'UNNAMED_PIPELINE'}
                      </h3>
                      <p className="font-mono text-xs text-on-surface-variant uppercase font-black leading-relaxed mb-12 line-clamp-3 italic group-hover:text-on-surface transition-colors opacity-60">
                         {s.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE_IN_SECTOR_04. RECURRING_UPLOADS_ENABLED.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-10 border-t border-outline pt-10 mb-10 relative z-10">
                      <div>
                         <span className="font-mono text-[9px] text-on-surface-variant uppercase font-black tracking-widest block mb-2 opacity-40">SUCCESS_RATE</span>
                         <span className="text-3xl text-on-surface font-black italic font-headline-md tracking-tighter leading-none">98.2%</span>
                      </div>
                      <div>
                         <span className="font-mono text-[9px] text-on-surface-variant uppercase font-black tracking-widest block mb-2 opacity-40">RENDERS_24H</span>
                         <span className="text-3xl text-on-surface font-black italic font-headline-md tracking-tighter leading-none">42</span>
                      </div>
                   </div>

                   <div className="flex gap-4 relative z-10">
                      <button className="flex-1 py-5 bg-surface-container border border-outline rounded-2xl text-on-surface-variant font-black uppercase italic text-xs tracking-[0.3em] hover:bg-on-surface hover:text-surface hover:border-on-surface transition-all duration-500 active:scale-95 shadow-sm">
                         Nodes
                      </button>
                      <button className="w-16 h-16 bg-surface-container border border-outline text-on-surface-variant hover:text-success hover:border-success hover:bg-success/5 transition-all rounded-2xl flex items-center justify-center active:scale-95 shadow-sm">
                         <PlayCircle size={24} />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2].map(i => (
                  <div key={i} className="bg-surface-container/20 border-2 border-outline border-dashed rounded-[3rem] h-[480px] flex items-center justify-center opacity-40">
                     <AlertCircle size={64} className="text-on-surface-variant/20" />
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
