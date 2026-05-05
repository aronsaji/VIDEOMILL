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
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-slate-100 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR_v2.0
          </div>
          <h1 className="text-6xl font-black text-slate-900 font-headline-md tracking-tighter italic uppercase leading-none">
            Auto_<span className="text-primary-container">Pilot</span>
          </h1>
          <p className="text-slate-400 mt-4 font-mono text-[10px] uppercase tracking-widest">Protocol: Async-Render-Stack // Nodes: 14 Active</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
          <div className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center gap-6 shadow-sm">
             <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Global_AutoPilot</span>
                <span className="text-[10px] font-black text-primary-container uppercase italic">System_Active</span>
             </div>
             <button 
               onClick={() => {}}
               className="w-16 h-8 bg-slate-100 border border-slate-200 rounded-full relative p-1 group overflow-hidden"
             >
                <div className="absolute inset-0 bg-primary-container/10 translate-x-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  layout
                  className="w-6 h-6 bg-primary-container rounded-full shadow-lg shadow-cyan-500/20 relative z-10"
                  initial={{ x: 32 }}
                />
             </button>
          </div>

          <button className="flex items-center gap-4 bg-primary-container text-white px-10 py-5 rounded-2xl font-black italic uppercase text-sm tracking-widest hover:brightness-110 transition-all active:scale-95 group shadow-lg shadow-cyan-500/20">
             New Pipeline
             <Zap size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'ACTIVE_SERIES', value: series.filter(s => s.status === 'active').length.toString().padStart(2, '0'), icon: RotateCcw, color: 'text-primary-container' },
           { label: 'SCHEDULED', value: episodes.length.toString().padStart(2, '0'), icon: Clock, color: 'text-[#0891b2]' },
           { label: 'VELOCITY', value: '98.4%', icon: Activity, color: 'text-[#10b981]' },
           { label: 'REACH_EST', value: formatNumber(analyticsData.totalViews || 0), icon: BarChart3, color: 'text-primary-container' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden shadow-sm hover:border-primary-container/30 transition-all duration-500"
           >
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 ${stat.color} group-hover:scale-110 transition-all duration-500`}>
                    <stat.icon size={22} />
                 </div>
                 <span className="font-mono text-[9px] text-slate-400 uppercase font-black tracking-widest">{stat.label}</span>
              </div>
              <div className="text-5xl font-black text-slate-900 font-headline-md italic tracking-tighter leading-none relative z-10">{stat.value}</div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        <section className="col-span-12 lg:col-span-4">
           <div className="bg-white border border-slate-200 p-10 rounded-[3rem] min-h-[640px] flex flex-col relative overflow-hidden shadow-sm group">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-8 mb-10 relative z-10">
                 <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100 text-primary-container">
                    <Calendar size={20} />
                 </div>
                 <h2 className="text-xs font-black text-slate-900 uppercase italic tracking-[0.2em]">Transmission_Log</h2>
              </div>

              <div className="flex-1 space-y-10 relative z-10">
                 <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-slate-100" />
                 
                 {episodes.length > 0 ? episodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-14 group cursor-crosshair"
                   >
                      <div className="absolute left-0 top-1 w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center z-10 group-hover:border-primary-container transition-all duration-500 shadow-sm">
                         <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-primary-container animate-pulse shadow-[0_0_15px_rgba(8,145,178,0.3)]' : 'bg-slate-200'}`} />
                      </div>
                      
                      <div className="space-y-3 group-hover:translate-x-3 transition-transform duration-500">
                         <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] text-primary-container font-black uppercase tracking-[0.2em] italic bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="font-mono text-[8px] text-slate-300 uppercase font-black tracking-widest">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="text-2xl font-black text-slate-900 font-headline-md uppercase italic tracking-tight group-hover:text-primary-container transition-colors duration-500 leading-none">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-slate-400 uppercase font-black tracking-widest">SERIES:</span>
                            <span className="font-mono text-[9px] text-slate-500 font-black uppercase italic tracking-widest">{ep.series?.title || 'GLOBAL_SEED'}</span>
                         </div>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-24">
                      <Terminal size={64} className="text-slate-200 mb-8 animate-pulse" />
                      <p className="text-slate-400 font-mono font-black uppercase tracking-[0.4em] text-[10px]">Awaiting next broadcast...</p>
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
                  className="bg-white border border-slate-200 p-10 rounded-[3rem] group hover:border-primary-container/30 transition-all duration-700 relative overflow-hidden shadow-sm flex flex-col min-h-[480px]"
                >
                   <div className="flex justify-between items-start mb-14 relative z-10">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-primary-container group-hover:bg-cyan-50 group-hover:border-primary-container/30 transition-all duration-700">
                         <RotateCcw size={32} className={s.status === 'active' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] italic border rounded-full ${
                          s.status === 'active' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 shadow-sm' : 'bg-red-50 text-red-400 border-red-100'
                        }`}>
                           {s.status?.toUpperCase() || 'OFFLINE'}
                        </div>
                        {s.status === 'active' && <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />}
                      </div>
                   </div>

                   <div className="flex-1 relative z-10">
                      <h3 className="text-4xl font-black text-slate-900 font-headline-md uppercase italic mb-4 tracking-tighter leading-none group-hover:text-primary-container transition-colors duration-500">
                         {s.title || 'UNNAMED_PIPELINE'}
                      </h3>
                      <p className="font-mono text-xs text-slate-400 uppercase font-black leading-relaxed mb-12 line-clamp-3 italic group-hover:text-slate-500 transition-colors">
                         {s.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE_IN_SECTOR_04. RECURRING_UPLOADS_ENABLED.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-10 border-t border-slate-100 pt-10 mb-10 relative z-10">
                      <div>
                         <span className="font-mono text-[9px] text-slate-300 uppercase font-black tracking-widest block mb-2">SUCCESS_RATE</span>
                         <span className="text-3xl text-slate-900 font-black italic font-headline-md tracking-tighter leading-none">98.2%</span>
                      </div>
                      <div>
                         <span className="font-mono text-[9px] text-slate-300 uppercase font-black tracking-widest block mb-2">RENDERS_24H</span>
                         <span className="text-3xl text-slate-900 font-black italic font-headline-md tracking-tighter leading-none">42</span>
                      </div>
                   </div>

                   <div className="flex gap-4 relative z-10">
                      <button className="flex-1 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 font-black uppercase italic text-xs tracking-[0.3em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 active:scale-95 shadow-sm">
                         Nodes
                      </button>
                      <button className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 hover:text-[#10b981] hover:border-[#10b981] hover:bg-emerald-50 transition-all rounded-2xl flex items-center justify-center active:scale-95 shadow-sm">
                         <PlayCircle size={24} />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2].map(i => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-[3rem] h-[480px] flex items-center justify-center opacity-40 border-dashed">
                     <AlertCircle size={64} className="text-slate-200" />
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
