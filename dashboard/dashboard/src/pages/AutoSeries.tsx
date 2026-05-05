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
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[10px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={16} className="animate-pulse" />
            AUTONOMOUS_PIPELINE_ORCHESTRATOR_v2.0
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            Auto_<span className="text-[#b1cdb7]">Pilot</span>
          </h1>
          <p className="text-[#8c928c] mt-4 font-label-sm text-[11px] uppercase tracking-widest font-bold italic opacity-40">Protocol: Async-Render-Stack // Nodes: 14 Active</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="bg-[#1b1c1a] border border-[#424843] p-5 rounded-soft-xl flex items-center gap-8 shadow-sm">
             <div className="flex flex-col items-end">
                <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest mb-1 opacity-30 italic">Global_AutoPilot</span>
                <span className="font-label-sm text-[11px] font-bold text-[#b1cdb7] uppercase italic tracking-wider">System_Active</span>
             </div>
             <button 
               className="w-16 h-8 bg-[#131412] border border-[#424843] rounded-full relative p-1 group overflow-hidden"
             >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-[#b1cdb7] rounded-full shadow-lg shadow-[#b1cdb7]/20 relative z-10"
                  initial={{ x: 32 }}
                />
             </button>
          </div>

          <button className="flex items-center gap-5 bg-[#b1cdb7] text-[#1d3526] px-10 py-5 rounded-soft-lg font-bold italic uppercase text-[13px] tracking-widest hover:brightness-110 active:scale-95 group shadow-xl shadow-[#b1cdb7]/5 transition-all font-label-sm">
             New Pipeline
             <Zap size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'ACTIVE_SERIES', value: series.filter(s => s.status === 'active').length.toString().padStart(2, '0'), icon: RotateCcw, color: 'text-[#b1cdb7]' },
           { label: 'SCHEDULED', value: episodes.length.toString().padStart(2, '0'), icon: Clock, color: 'text-[#b1cdb7]' },
           { label: 'VELOCITY', value: '98.4%', icon: Activity, color: 'text-[#bec9bf]' },
           { label: 'REACH_EST', value: formatNumber(analyticsData.totalViews || 0), icon: BarChart3, color: 'text-[#b1cdb7]' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex flex-col group relative overflow-hidden shadow-sm hover:border-[#b1cdb7]/40 transition-all duration-500"
           >
              <div className="flex justify-between items-start mb-10 relative z-10">
                 <div className={`p-4 bg-[#131412] rounded-soft-lg border border-[#424843] ${stat.color} group-hover:scale-110 transition-all duration-500 group-hover:border-[#b1cdb7]/30`}>
                    <stat.icon size={26} />
                 </div>
                 <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40">{stat.label}</span>
              </div>
              <div className="text-5xl font-bold text-[#e4e2e0] font-headline-md italic tracking-tighter leading-none relative z-10 uppercase">{stat.value}</div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        <section className="col-span-12 lg:col-span-4">
           <div className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl min-h-[640px] flex flex-col relative overflow-hidden shadow-sm group">
              <div className="flex items-center gap-6 border-b border-[#424843] pb-10 mb-12 relative z-10">
                 <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
                    <Calendar size={24} />
                 </div>
                 <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em]">Transmission_Log</h2>
              </div>

              <div className="flex-1 space-y-12 relative z-10">
                 <div className="absolute left-[26px] top-0 bottom-0 w-[1px] bg-[#424843] opacity-30" />
                 
                 {episodes.length > 0 ? episodes.map((ep, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={ep.id} 
                     className="relative pl-16 group cursor-crosshair"
                   >
                      <div className="absolute left-0 top-1 w-12 h-12 bg-[#131412] border border-[#424843] rounded-soft-lg flex items-center justify-center z-10 group-hover:border-[#b1cdb7] transition-all duration-500 shadow-sm">
                         <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[#b1cdb7] animate-pulse shadow-[0_0_15px_#b1cdb7]' : 'bg-[#424843]'}`} />
                      </div>
                      
                      <div className="space-y-4 group-hover:translate-x-4 transition-transform duration-500">
                         <div className="flex justify-between items-center">
                            <span className="font-label-sm text-[10px] text-[#b1cdb7] font-bold uppercase tracking-[0.2em] italic bg-[#2d4535] px-4 py-1.5 rounded-soft-sm border border-[#b1cdb7]/20">
                               {new Date(ep.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="font-label-sm text-[9px] text-[#8c928c] font-bold uppercase tracking-widest opacity-30 italic">
                               {new Date(ep.scheduled_at).toLocaleDateString()}
                            </span>
                         </div>
                         <h4 className="text-2xl font-bold text-[#e4e2e0] font-headline-md uppercase italic tracking-tight group-hover:text-[#b1cdb7] transition-colors duration-500 leading-none">
                            {ep.title || 'NEURAL_EPISODE'}
                         </h4>
                         <div className="flex items-center gap-4">
                            <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest opacity-20 italic">SERIES:</span>
                            <span className="font-label-sm text-[10px] text-[#8c928c] font-bold uppercase italic tracking-widest opacity-60">{ep.series?.title || 'GLOBAL_SEED'}</span>
                         </div>
                      </div>
                   </motion.div>
                 )) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 py-32">
                      <Terminal size={72} className="text-[#8c928c] mb-10 animate-pulse" />
                      <p className="text-[#8c928c] font-label-sm font-bold uppercase tracking-[0.5em] text-[12px] italic">Awaiting next broadcast...</p>
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
                  className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl group hover:border-[#b1cdb7]/40 transition-all duration-700 relative overflow-hidden shadow-sm flex flex-col min-h-[500px]"
                >
                   <div className="flex justify-between items-start mb-16 relative z-10">
                      <div className="p-8 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7] group-hover:bg-[#2d4535] group-hover:border-[#b1cdb7]/40 transition-all duration-700">
                         <RotateCcw size={36} className={s.status === 'active' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`px-6 py-2 text-[10px] font-bold uppercase tracking-[0.4em] italic border rounded-soft-sm ${
                          s.status === 'active' ? 'bg-[#2d4535] text-[#b1cdb7] border-[#b1cdb7]/20 shadow-xl shadow-[#b1cdb7]/5' : 'bg-[#131412] text-[#8c928c] border-[#424843]'
                        }`}>
                           {s.status?.toUpperCase() || 'OFFLINE'}
                        </div>
                        {s.status === 'active' && <div className="w-2.5 h-2.5 bg-[#b1cdb7] rounded-full animate-pulse shadow-[0_0_15px_#b1cdb7]" />}
                      </div>
                   </div>

                   <div className="flex-1 relative z-10">
                      <h3 className="text-4xl font-bold text-[#e4e2e0] font-headline-md uppercase italic mb-6 tracking-tighter leading-none group-hover:text-[#b1cdb7] transition-colors duration-500">
                         {s.title || 'UNNAMED_PIPELINE'}
                      </h3>
                      <p className="font-label-sm text-sm text-[#8c928c] uppercase font-bold leading-relaxed mb-12 line-clamp-3 italic group-hover:text-[#e4e2e0] transition-colors opacity-40 group-hover:opacity-60">
                         {s.description || 'AUTONOMOUS_GEN_PROTOCOL_ACTIVE_IN_SECTOR_04. RECURRING_UPLOADS_ENABLED.'}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-12 border-t border-[#424843] pt-12 mb-12 relative z-10">
                      <div className="space-y-2">
                         <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest block italic opacity-20">SUCCESS_RATE</span>
                         <span className="text-3xl text-[#e4e2e0] font-bold italic font-headline-md tracking-tighter leading-none uppercase">98.2%</span>
                      </div>
                      <div className="space-y-2">
                         <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest block italic opacity-20">RENDERS_24H</span>
                         <span className="text-3xl text-[#e4e2e0] font-bold italic font-headline-md tracking-tighter leading-none uppercase">42</span>
                      </div>
                   </div>

                   <div className="flex gap-6 relative z-10">
                      <button className="flex-1 py-6 bg-[#131412] border border-[#424843] rounded-soft-lg text-[#8c928c] font-bold uppercase italic text-[11px] tracking-[0.4em] hover:bg-[#b1cdb7] hover:text-[#1d3526] hover:border-[#b1cdb7] transition-all duration-500 active:scale-95 shadow-sm font-label-sm">
                         Nodes
                      </button>
                      <button className="w-20 h-20 bg-[#131412] border border-[#424843] text-[#8c928c] hover:text-[#b1cdb7] hover:border-[#b1cdb7] hover:bg-[#2d4535] transition-all rounded-soft-lg flex items-center justify-center active:scale-95 shadow-sm">
                         <PlayCircle size={32} />
                      </button>
                   </div>
                </motion.div>
              )) : (
                [1,2].map(i => (
                  <div key={i} className="bg-[#131412]/50 border-2 border-[#424843] border-dashed rounded-soft-xl h-[500px] flex items-center justify-center opacity-20">
                     <AlertCircle size={72} className="text-[#8c928c]" />
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
