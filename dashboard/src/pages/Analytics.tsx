import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Clock, Users, Activity, Shield, BarChart3, Target, ArrowUpRight, Cpu,
  Zap, Radio, Box, Terminal, Globe, Maximize2
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function Analytics() {
  const { analyticsData, fetchAnalytics, isLoading, analytics, videos } = usePipelineStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const activeRenders = videos.filter(v => v.status === 'rendering');
  const engineOnline = true; 

  const metrics = [
    { 
      label: 'NETWORK_REACH', 
      value: formatNumber(analyticsData.totalViews), 
      change: '+14%', 
      isPositive: true, 
      icon: Eye, 
      color: 'text-primary-container' 
    },
    { 
      label: 'WATCH_TIME', 
      value: formatNumber(analyticsData.totalWatchTime), 
      change: '+8%', 
      isPositive: true, 
      icon: Clock, 
      color: 'text-[#6bff83]' 
    },
    { 
      label: 'RETENTION', 
      value: `${analyticsData.avgRetention}%`, 
      change: 'STABLE', 
      isPositive: true, 
      icon: Users, 
      color: 'text-[#00f5ff]' 
    },
    { 
      label: 'ENGAGEMENT', 
      value: formatNumber(analyticsData.engagement), 
      change: '+24%', 
      isPositive: true, 
      icon: Activity, 
      color: 'text-primary-container' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Cinematic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Activity size={14} className="animate-pulse" />
            LIVE_DATA_SYNTHESIS_v14.4
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            System_<span className="text-primary-container">Telemetry</span>
          </h1>
        </div>
        
        <div className="flex gap-6">
           <div className="flex items-center gap-4 px-6 py-3 bg-surface-container-low border border-white/5 rounded-xl shadow-2xl">
              <Shield size={16} className="text-[#6bff83]" />
              <span className="font-mono text-[9px] text-zinc-600 font-black tracking-[0.2em] uppercase">AES_256_ACTIVE</span>
           </div>
        </div>
      </header>

      {/* Engine Status Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-low border border-white/5 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
            <div className="flex items-center gap-8 relative z-10">
                <div className={`w-4 h-4 rounded-full ${engineOnline ? 'bg-[#6bff83] animate-pulse shadow-[0_0_20px_#6bff83]' : 'bg-red-500'}`} />
                <div>
                    <p className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest mb-1">Epic_Engine_v14.4_PRO</p>
                    <h3 className="text-3xl font-black text-white font-headline-md italic uppercase tracking-tighter">
                        {engineOnline ? 'Status: Nominal' : 'Status: Offline'}
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest mb-2">GPU_LOAD</span>
                    <div className="flex gap-1.5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`w-2 h-4 rounded-full transition-all duration-500 ${i < (activeRenders.length > 0 ? 9 : 3) ? 'bg-primary-container shadow-[0_0_10px_#22d3ee]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end border-l border-white/5 pl-12">
                    <span className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest mb-1">NODES</span>
                    <span className="text-4xl font-black text-primary-container font-headline-md italic tracking-tighter leading-none">{activeRenders.length}</span>
                </div>
            </div>
        </div>

        <div className="bg-surface-container-low border border-white/5 p-8 rounded-[3rem] flex flex-col justify-center items-center text-center relative overflow-hidden shadow-2xl group">
          <p className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest mb-4">Avg_Render_Time</p>
          <h4 className="text-5xl font-black text-white font-headline-md italic tracking-tighter leading-none">142<span className="text-primary-container text-2xl">.4s</span></h4>
          <p className="text-[10px] text-[#6bff83] font-black uppercase tracking-widest mt-4 flex items-center gap-2 italic">
            <ArrowUpRight size={12} /> 12% Improved
          </p>
        </div>
      </section>

      {/* Industrial Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low border border-white/5 p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden shadow-2xl hover:border-primary-container/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className={`p-4 bg-black rounded-2xl border border-white/5 ${stat.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor] transition-all duration-500`}>
                  <stat.icon size={24} />
               </div>
               <div className={`px-3 py-1 rounded-full font-mono text-[9px] font-black border ${
                 stat.isPositive ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
               }`}>
                  {stat.change}
               </div>
            </div>
            <div className="text-6xl font-black text-white font-headline-md italic tracking-tighter mb-2 leading-none relative z-10">{stat.value}</div>
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] italic relative z-10">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Neural Insight Matrix (Predictive Analysis) */}
      <section className="bg-surface-container-low border border-white/5 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
         <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
         <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="p-3 bg-black rounded-xl border border-white/5 text-primary-container animate-pulse">
               <Cpu size={20} />
            </div>
            <h2 className="text-sm font-black text-white uppercase italic tracking-[0.3em]">Predictive_Insight_Matrix</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
               { label: 'TOP_VOICE_PERFORMANCE', value: 'Emma (EN)', sub: '92.4% Retention', icon: Radio },
               { label: 'OPTIMAL_HOOK_TIME', value: '02.4s - 04.1s', sub: 'Critical Threshold', icon: Clock },
               { label: 'CONTENT_VECTOR', value: 'Tech_Infographic', sub: 'High Engagement', icon: Target },
            ].map((insight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="p-8 bg-black/40 border border-white/5 rounded-[2rem] hover:border-primary-container/40 transition-all duration-500"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <insight.icon size={16} className="text-zinc-700" />
                    <span className="font-mono text-[9px] text-zinc-700 font-black uppercase tracking-widest">{insight.label}</span>
                 </div>
                 <div className="text-2xl font-black text-white font-headline-md uppercase italic mb-2 leading-none">{insight.value}</div>
                 <p className="font-mono text-[10px] text-primary-container font-black uppercase tracking-widest italic">{insight.sub}</p>
              </motion.div>
            ))}
         </div>

         <div className="mt-12 p-8 bg-primary-container/5 border border-primary-container/10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shadow-[0_0_20px_#22d3ee]">
                  <Zap size={20} className="text-black" />
               </div>
               <div>
                  <p className="text-xs font-black text-white uppercase italic">Optimization Strategy Ready</p>
                  <p className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1">AI Recommendation: Increase post frequency in 'Tech' category for India sector.</p>
               </div>
            </div>
            <button className="px-8 py-4 bg-primary-container text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all italic">
               Apply_Optimization
            </button>
         </div>
      </section>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Telemetry Canvas */}
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] min-h-[560px] flex flex-col relative overflow-hidden shadow-2xl group">
             <div className="flex items-center justify-between mb-16 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-black rounded-xl border border-white/5 text-primary-container">
                      <BarChart3 size={20} />
                   </div>
                   <h2 className="text-xs font-black text-white uppercase italic tracking-[0.3em]">Neural_History</h2>
                </div>
             </div>

             <div className="flex-1 flex flex-col relative z-10">
                <div className="flex-1 flex items-end gap-3 px-6 pb-12 h-[320px]">
                   {analytics.length > 0 ? (
                     analytics.slice(-14).map((snap, i) => {
                       const maxViews = Math.max(...analytics.map(s => s.views || 0)) || 100;
                       const height = ((snap.views || 0) / maxViews) * 100;
                       
                       return (
                         <div key={i} className="flex-1 flex flex-col items-center gap-6 group h-full justify-end">
                            <div className="relative w-full flex flex-col justify-end h-full">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${Math.max(height, 5)}%` }}
                                 transition={{ delay: i * 0.05, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                 className="w-full bg-gradient-to-t from-primary-container/20 to-primary-container rounded-t-xl relative group-hover:shadow-[0_0_30px_#22d3ee] transition-all duration-500"
                               />
                            </div>
                            <span className="font-mono text-[8px] text-zinc-800 font-black rotate-45 origin-left whitespace-nowrap uppercase tracking-widest">
                               {new Date(snap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                         </div>
                       );
                     })
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <Terminal size={40} className="text-zinc-900 mb-8" />
                        <p className="font-mono text-[10px] text-zinc-800 uppercase font-black tracking-[0.3em]">Awaiting data stream...</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* High Value Targets sidebar */}
        <section className="col-span-12 lg:col-span-4">
           <div className="bg-surface-container-low border border-white/5 p-8 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden group min-h-[560px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-xl border border-white/5 text-primary-container">
                      <Target size={20} />
                    </div>
                    <h2 className="text-xs font-black text-white uppercase italic tracking-[0.3em]">Top_Productions</h2>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                  {analyticsData.topPerformers.map((video, i) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:border-primary-container/40 hover:bg-white/[0.04] transition-all duration-500 group/item cursor-crosshair shadow-xl"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <span className="font-mono text-[9px] text-primary-container font-black uppercase tracking-[0.2em] italic">{video.id.slice(0, 8)}</span>
                          <ArrowUpRight size={14} className="text-zinc-800 group-hover/item:text-primary-container transition-colors" />
                       </div>
                       <h4 className="text-xl font-black text-white font-headline-md uppercase italic tracking-tight mb-8 group-hover/item:text-primary-container transition-colors duration-500 line-clamp-2 leading-none">
                          {video.title || 'Untitled_Production'}
                       </h4>
                       <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                          <div>
                             <span className="font-mono text-[8px] text-zinc-700 uppercase font-black tracking-widest block mb-2">STATUS</span>
                             <span className="text-xl text-white font-black italic font-headline-md uppercase leading-none">{video.status}</span>
                          </div>
                          <div>
                             <span className="font-mono text-[8px] text-zinc-700 uppercase font-black tracking-widest block mb-2">PLATFORM</span>
                             <span className="text-xl text-[#6bff83] font-black italic font-headline-md uppercase leading-none">{video.platform || 'TIKTOK'}</span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
