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

export default function AutoSeries() {
  const { series, episodes, analyticsData, fetchInitialData, isLoading } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Cinematic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR_v2.0
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Auto_<span className="text-primary-container">Pilot</span>
          </h1>
          <p className="text-zinc-500 mt-4 font-mono text-[10px] uppercase tracking-widest">Protocol: Async-Render-Stack // Nodes: 14 Active</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
          <div className="bg-surface-container-low border border-white/5 p-4 rounded-3xl flex items-center gap-6 shadow-2xl">
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest mb-1">Global_AutoPilot</span>
                <span className="text-[10px] font-black text-primary-container uppercase italic">System_Active</span>
             </div>
             <button 
               onClick={() => {}}
               className="w-16 h-8 bg-black border border-white/10 rounded-full relative p-1 group overflow-hidden"
             >
                <div className="absolute inset-0 bg-primary-container/20 translate-x-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  layout
                  className="w-6 h-6 bg-primary-container rounded-full shadow-[0_0_15px_#22d3ee] relative z-10"
                  initial={{ x: 32 }}
                />
             </button>
          </div>

          <button className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black italic uppercase text-sm tracking-widest hover:bg-primary-container transition-all active:scale-95 group">
             New Pipeline
             <Zap size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </header>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'ACTIVE_SERIES', value: series.filter(s => s.status === 'active').length.toString().padStart(2, '0'), icon: RotateCcw, color: 'text-primary-container' },
           { label: 'SCHEDULED', value: episodes.length.toString().padStart(2, '0'), icon: Clock, color: 'text-[#00f5ff]' },
           { label: 'VELOCITY', value: '98.4%', icon: Activity, color: 'text-[#6bff83]' },
           { label: 'REACH_EST', value: formatNumber(analyticsData.totalViews), icon: BarChart3, color: 'text-[#e90053]' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-surface-container-low border border-white/5 p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden shadow-2xl hover:border-primary-container/30 transition-all duration-500"
           >
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className={`p-4 bg-black rounded-2xl border border-white/5 ${stat.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor] transition-all duration-500`}>
                    <stat.icon size={22} />
                 </div>
                 <span className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest">{stat.label}</span>
              </div>
              <div className="text-5xl font-black text-white font-headline-md italic tracking-tighter leading-none relative z-10">{stat.value}</div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Pipeline Timeline */}
        <section className="col-span-12 lg:col-span-4">
           <div className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] min-h-[640px] flex flex-col relative overflow-hidden shadow-2xl group">
              <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-10 relative z-10">
                 <div className="p-3 bg-black rounded-xl border border-white/5 text-[#00f5ff]">
                    <Calendar size={20} />
                 </div>
                 <h2 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Transmission_Log</h2>
              </div>

              <div className="flex-1 space-y-10 relative z-10">
                 <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-white/5" />
                 
                 {episodes.length > 0 ? episodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-14 group cursor-crosshair"
                   >
                      <div className="absolute left-0 top-1 w-11 h-11 bg-black border border-white/10 rounded-2xl flex items-center justify-center z-10 group-hover:border-primary-container transition-all duration-500 shadow-2xl">
                         <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary-container animate-pulse shadow-[0_0_15px_#22d3ee]' : 'bg-zinc-800'}`} />
                      </div>
                      
                      <div className="space-y-3 group-hover:translate-x-3 transition-transform duration-500">
                         <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-primary-container font-black uppercase tracking-[0.2em] italic bg-primary-container/5 px-3 py-1 rounded-full border border-primary-container/10">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="font-mono text-[8px] text-zinc-700 uppercase font-black tracking-widest">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="text-2xl font-black text-white font-headline-md uppercase italic tracking-tight group-hover:text-primary-container transition-colors duration-500 leading-none">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-zinc-800 uppercase font-black tracking-widest">SERIES:</span>
                            <span className="font-mono text-[9px] text-zinc-500 font-black uppercase italic tracking-widest">{ep.series?.title || 'GLOBAL_SEED'}</span>
                         </div>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-24">
                      <Terminal size={64} className="text-zinc-800 mb-8 animate-pulse" />
                      <p className="text-zinc-600 font-mono font-black uppercase tracking-[0.4em] text-[10px]">Awaiting next broadcast...</p>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Pipeline Matrix */}
        <section className="col-span-12 lg:col-span-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {series.length > 0 ? series.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={s.id}
                  className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] group hover:border-primary-container/30 transition-all duration-700 relative overflow-hidden shadow-2xl flex flex-col min-h-[480px]"
                >
                   <div className="flex justify-between items-start mb-14 relative z-10">
                      <div className="p-6 bg-black rounded-2xl border border-white/5 text-primary-container group-hover:shadow-[0_0_30px_#22d3ee44] group-hover:border-primary-container/50 transition-all duration-700">
                         <RotateCcw size={32} className={s.status === 'active' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] italic border rounded-full ${
                          s.status === 'active' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20 shadow-[0_0_15px_#6bff8333]' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                           {s.status?.toUpperCase() || 'OFFLINE'}
                        </div>
                        {s.status === 'active' && <div className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse shadow-[0_0_10px_#6bff83]" />}
                      </div>
                   </div>

                   <div className="flex-1 relative z-10">
                      <h3 className="text-4xl font-black text-white font-headline-md uppercase italic mb-4 tracking-tighter leading-none group-hover:text-primary-container transition-colors duration-500">
                         {s.title || 'UNNAMED_PIPELINE'}
                      </h3>
                      <p className="font-mono text-xs text-zinc-600 uppercase font-black leading-relaxed mb-12 line-clamp-3 italic group-hover:text-zinc-400 transition-colors">
                         {s.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE_IN_SECTOR_04. RECURRING_UPLOADS_ENABLED.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10 mb-10 relative z-10">
                      <div>
                         <span className="font-mono text-[9px] text-zinc-800 uppercase font-black tracking-widest block mb-2">SUCCESS_RATE</span>
                         <span className="text-3xl text-white font-black italic font-headline-md tracking-tighter leading-none">98.2%</span>
                      </div>
                      <div>
                         <span className="font-mono text-[9px] text-zinc-800 uppercase font-black tracking-widest block mb-2">RENDERS_24H</span>
                         <span className="text-3xl text-white font-black italic font-headline-md tracking-tighter leading-none">42</span>
                      </div>
                   </div>

                   <div className="flex gap-4 relative z-10">
                      <button className="flex-1 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-zinc-600 font-black uppercase italic text-xs tracking-[0.3em] hover:bg-primary-container hover:text-black hover:border-primary-container transition-all duration-500 active:scale-95 shadow-xl">
                         Nodes
                      </button>
                      <button className="w-16 h-16 bg-white/[0.03] border border-white/10 text-zinc-600 hover:text-[#6bff83] hover:border-[#6bff83] hover:bg-[#6bff83]/5 transition-all rounded-2xl flex items-center justify-center active:scale-95 shadow-xl">
                         <PlayCircle size={24} />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2].map(i => (
                  <div key={i} className="bg-surface-container-low/30 border border-white/5 rounded-[3rem] h-[480px] flex items-center justify-center opacity-10 border-dashed">
                     <AlertCircle size={64} className="text-zinc-800" />
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
