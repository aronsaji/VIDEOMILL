import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Clock, Users, Activity, Shield, BarChart3, Target, ArrowUpRight, Cpu,
  Zap, Radio, Box, Terminal, Globe, Maximize2
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { useI18nStore } from '../store/i18nStore';

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function Analytics() {
  const { t } = useI18nStore();
  const { analyticsData, fetchAnalytics, isLoading, analytics, videos } = usePipelineStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const activeRenders = videos.filter(v => v.status === 'rendering');
  const engineOnline = true; 

  const metrics = [
    { 
      label: 'NETWORK_REACH', 
      value: formatNumber(analyticsData.totalViews || 0), 
      change: '+14% OVER_SEASON', 
      isPositive: true, 
      icon: Eye, 
      color: 'text-primary' 
    },
    { 
      label: 'WATCH_TIME', 
      value: formatNumber(analyticsData.totalWatchTime || 0), 
      change: '+8% TRENDING', 
      isPositive: true, 
      icon: Clock, 
      color: 'text-success' 
    },
    { 
      label: 'RETENTION', 
      value: `${analyticsData.avgRetention || 0}%`, 
      change: 'STABLE_NODE', 
      isPositive: true, 
      icon: Users, 
      color: 'text-primary' 
    },
    { 
      label: 'ENGAGEMENT', 
      value: formatNumber(analyticsData.engagement || 0), 
      change: '+24% SPIKE', 
      isPositive: true, 
      icon: Activity, 
      color: 'text-primary' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary font-mono text-[11px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Activity size={14} className="animate-pulse" />
            LIVE_DATA_SYNTHESIS_v14.4
          </div>
          <h1 className="text-6xl font-black text-on-surface font-headline-md tracking-tighter italic uppercase leading-none">
            System_<span className="text-primary">Telemetry</span>
          </h1>
        </div>
        
        <div className="flex gap-6">
           <div className="flex items-center gap-4 px-6 py-3 bg-surface border border-outline rounded-xl shadow-sm">
              <Shield size={16} className="text-success" />
              <span className="font-mono text-[10px] text-on-surface-variant font-black tracking-[0.2em] uppercase">AES_256_ACTIVE</span>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-outline p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-sm">
            <div className="flex items-center gap-8 relative z-10">
                <div className={`w-4 h-4 rounded-full ${engineOnline ? 'bg-success animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-error'}`} />
                <div>
                    <p className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-widest mb-1">Epic_Engine_v14.4_PRO</p>
                    <h3 className="text-3xl font-black text-on-surface font-headline-md italic uppercase tracking-tighter">
                        {engineOnline ? 'Status: Nominal' : 'Status: Offline'}
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
                <div className="flex flex-col items-end">
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-widest mb-2">GPU_LOAD</span>
                    <div className="flex gap-1.5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`w-2 h-4 rounded-full transition-all duration-500 ${i < (activeRenders.length > 0 ? 9 : 3) ? 'bg-primary shadow-[0_0_10px_rgba(8,145,178,0.2)]' : 'bg-surface-container'}`} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end border-l border-outline pl-12">
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-widest mb-1">NODES</span>
                    <span className="text-4xl font-black text-primary font-headline-md italic tracking-tighter leading-none">{activeRenders.length}</span>
                </div>
            </div>
        </div>

        <div className="bg-surface border border-outline p-8 rounded-[3rem] flex flex-col justify-center items-center text-center relative overflow-hidden shadow-sm group">
          <p className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-widest mb-4">Avg_Render_Time</p>
          <h4 className="text-5xl font-black text-on-surface font-headline-md italic tracking-tighter leading-none">142<span className="text-primary text-2xl">.4s</span></h4>
          <p className="text-[11px] text-success font-black uppercase tracking-widest mt-4 flex items-center gap-2 italic">
            <ArrowUpRight size={12} /> 12% Improved
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-outline p-8 rounded-[2.5rem] flex flex-col group relative overflow-hidden shadow-sm hover:border-primary/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className={`p-4 bg-surface-container rounded-2xl border border-outline ${stat.color} group-hover:scale-110 transition-all duration-500`}>
                  <stat.icon size={24} />
               </div>
               <div className={`px-3 py-1 rounded-full font-mono text-[10px] font-black border ${
                 stat.isPositive ? 'bg-emerald-50 text-success border-emerald-100' : 'bg-red-50 text-error border-red-100'
               }`}>
                  {stat.change}
               </div>
            </div>
            <div className="text-6xl font-black text-on-surface font-headline-md italic tracking-tighter mb-2 leading-none relative z-10">{stat.value}</div>
            <span className="text-[11px] text-on-surface-variant uppercase font-black tracking-[0.2em] italic relative z-10">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <section className="bg-surface border border-outline p-12 rounded-[3rem] shadow-sm relative overflow-hidden group">
         <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="p-3 bg-surface-container rounded-xl border border-outline text-primary">
               <Cpu size={20} />
            </div>
            <h2 className="text-sm font-black text-on-surface uppercase italic tracking-[0.3em]">Predictive_Insight_Matrix</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
               { label: 'TOP_VOICE_PERFORMANCE', value: 'Emma (EN)', sub: '92.4% Retention (Season High)', icon: Radio },
               { label: 'OPTIMAL_HOOK_TIME', value: '02.4s - 04.1s', sub: 'Critical Conversion Threshold', icon: Clock },
               { label: 'CONTENT_VECTOR', value: 'French_Cuisine', sub: '#la_cuisine_française #france', icon: Target },
            ].map((insight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="p-8 bg-surface-container border border-outline rounded-[2rem] hover:border-primary/40 transition-all duration-500"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <insight.icon size={16} className="text-primary" />
                    <span className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest">{insight.label}</span>
                 </div>
                 <div className="text-2xl font-black text-on-surface font-headline-md uppercase italic mb-2 leading-none">{insight.value}</div>
                 <p className="font-mono text-[11px] text-primary font-black uppercase tracking-widest italic">{insight.sub}</p>
              </motion.div>
            ))}
         </div>

         <div className="mt-12 p-8 bg-surface-container border border-outline rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap size={20} className="text-white" />
               </div>
               <div>
                  <p className="text-sm font-black text-on-surface uppercase italic">Optimization Strategy Ready</p>
                  <p className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-widest mt-1">AI Recommendation: Focus on "French Cuisine" segment for Paris/Lyon Geo-Targets.</p>
               </div>
            </div>
            <button className="px-8 py-4 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all italic shadow-lg shadow-primary/20">
               Apply_Optimization
            </button>
         </div>
      </section>

      <div className="grid grid-cols-12 gap-10">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-surface border border-outline p-10 rounded-[3rem] min-h-[560px] flex flex-col relative overflow-hidden shadow-sm group">
             <div className="flex items-center justify-between mb-16 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-surface-container rounded-xl border border-outline text-primary">
                      <BarChart3 size={20} />
                   </div>
                   <h2 className="text-xs font-black text-on-surface uppercase italic tracking-[0.3em]">Neural_History</h2>
                </div>
             </div>

             <div className="flex-1 flex flex-col relative z-10">
                <div className="flex-1 flex items-end gap-3 px-6 pb-12 h-[320px]">
                   {analytics && analytics.length > 0 ? (
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
                                 className="w-full bg-gradient-to-t from-primary/10 to-primary rounded-t-xl relative group-hover:shadow-lg transition-all duration-500"
                               />
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant font-black rotate-45 origin-left whitespace-nowrap uppercase tracking-widest">
                               {new Date(snap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                         </div>
                       );
                     })
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <Terminal size={40} className="text-on-surface-variant/10 mb-8" />
                        <p className="font-mono text-[11px] text-on-surface-variant uppercase font-black tracking-[0.3em]">Awaiting data stream...</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4">
           <div className="bg-surface border border-outline p-8 rounded-[3rem] space-y-10 shadow-sm relative overflow-hidden group min-h-[560px]">
              <div className="flex items-center justify-between border-b border-outline pb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface-container rounded-xl border border-outline text-primary">
                       <Target size={20} />
                    </div>
                    <h2 className="text-xs font-black text-on-surface uppercase italic tracking-[0.3em]">Top_Productions</h2>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                  {(analyticsData.topPerformers || []).map((video, i) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="p-6 bg-surface-container border border-outline rounded-[1.5rem] hover:border-primary/40 hover:bg-surface transition-all duration-500 group/item cursor-crosshair shadow-sm"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <span className="font-mono text-[10px] text-primary font-black uppercase tracking-[0.2em] italic">{video.id.slice(0, 8)}</span>
                          <ArrowUpRight size={14} className="text-on-surface-variant group-hover/item:text-primary transition-colors" />
                       </div>
                       <h4 className="text-xl font-black text-on-surface font-headline-md uppercase italic tracking-tight mb-8 group-hover/item:text-primary transition-colors duration-500 line-clamp-2 leading-none">
                          {video.title || 'Untitled_Production'}
                       </h4>
                       <div className="grid grid-cols-2 gap-6 border-t border-outline pt-6">
                          <div>
                             <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest block mb-2">STATUS</span>
                             <span className="text-xl text-on-surface font-black italic font-headline-md uppercase leading-none">{video.status}</span>
                          </div>
                          <div>
                             <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest block mb-2">PLATFORM</span>
                             <span className="text-xl text-success font-black italic font-headline-md uppercase leading-none">{video.platform || 'TIKTOK'}</span>
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
