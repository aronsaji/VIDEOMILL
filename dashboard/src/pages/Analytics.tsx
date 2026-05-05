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
      color: 'text-[#b1cdb7]' 
    },
    { 
      label: 'WATCH_TIME', 
      value: formatNumber(analyticsData.totalWatchTime || 0), 
      change: '+8% TRENDING', 
      isPositive: true, 
      icon: Clock, 
      color: 'text-[#bec9bf]' 
    },
    { 
      label: 'RETENTION', 
      value: `${analyticsData.avgRetention || 0}%`, 
      change: 'STABLE_NODE', 
      isPositive: true, 
      icon: Users, 
      color: 'text-[#b1cdb7]' 
    },
    { 
      label: 'ENGAGEMENT', 
      value: formatNumber(analyticsData.engagement || 0), 
      change: '+24% SPIKE', 
      isPositive: true, 
      icon: Activity, 
      color: 'text-[#b1cdb7]' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Activity size={18} className="animate-pulse" />
            LIVE_DATA_SYNTHESIS_v14.4
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            System_<span className="text-[#b1cdb7]">Telemetry</span>
          </h1>
        </div>
        
        <div className="flex gap-6">
           <div className="flex items-center gap-4 px-8 py-4 bg-[#1b1c1a] border border-[#424843] rounded-soft-lg shadow-sm">
              <Shield size={20} className="text-[#b1cdb7]" />
              <span className="font-label-sm text-[11px] text-[#8c928c] font-bold tracking-[0.2em] uppercase italic opacity-60">AES_256_ACTIVE</span>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-sm">
            <div className="flex items-center gap-10 relative z-10">
                <div className={`w-5 h-5 rounded-full ${engineOnline ? 'bg-[#b1cdb7] animate-pulse shadow-[0_0_20px_#b1cdb7]' : 'bg-[#ffb4ab]'}`} />
                <div>
                    <p className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest mb-2 italic opacity-40">Epic_Engine_v14.4_PRO</p>
                    <h3 className="text-3xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter">
                        {engineOnline ? 'Status: Nominal' : 'Status: Offline'}
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-12 relative z-10">
                <div className="flex flex-col items-end">
                    <span className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest mb-4 italic opacity-40">GPU_LOAD</span>
                    <div className="flex gap-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`w-2.5 h-6 rounded-soft-sm transition-all duration-500 ${i < (activeRenders.length > 0 ? 9 : 3) ? 'bg-[#b1cdb7] shadow-[0_0_12px_#b1cdb7]' : 'bg-[#131412] border border-[#424843]'}`} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end border-l border-[#424843] pl-12">
                    <span className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest mb-2 italic opacity-40">NODES</span>
                    <span className="text-5xl font-bold text-[#b1cdb7] font-headline-md italic tracking-tighter leading-none">{activeRenders.length.toString().padStart(2, '0')}</span>
                </div>
            </div>
        </div>

        <div className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex flex-col justify-center items-center text-center relative overflow-hidden shadow-sm group">
          <p className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest mb-6 italic opacity-40">Avg_Render_Time</p>
          <h4 className="text-6xl font-bold text-[#e4e2e0] font-headline-md italic tracking-tighter leading-none">142<span className="text-[#b1cdb7] text-3xl">.4s</span></h4>
          <p className="text-[12px] text-[#b1cdb7] font-bold uppercase tracking-[0.2em] mt-6 flex items-center gap-3 italic">
            <ArrowUpRight size={16} /> 12% Improved
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
            className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex flex-col group relative overflow-hidden shadow-sm hover:border-[#b1cdb7]/40 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-10 relative z-10">
               <div className={`p-4 bg-[#131412] rounded-soft-lg border border-[#424843] ${stat.color} group-hover:scale-110 group-hover:border-[#b1cdb7]/30 transition-all duration-500`}>
                  <stat.icon size={28} />
               </div>
               <div className={`px-4 py-1.5 rounded-soft-sm font-label-sm text-[11px] font-bold border italic tracking-widest ${
                 stat.isPositive ? 'bg-[#2d4535] text-[#b1cdb7] border-[#b1cdb7]/20 shadow-[0_0_10px_#b1cdb7]/10' : 'bg-[#93000a]/10 text-[#ffb4ab] border-[#ffb4ab]/20'
               }`}>
                  {stat.change}
               </div>
            </div>
            <div className="text-6xl font-bold text-[#e4e2e0] font-headline-md italic tracking-tighter mb-4 leading-none relative z-10">{stat.value}</div>
            <span className="font-label-sm text-[12px] text-[#8c928c] uppercase font-bold tracking-[0.3em] italic relative z-10 opacity-40">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <section className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#b1cdb7]/5 blur-[100px] rounded-full" />
         <div className="flex items-center gap-6 mb-12 relative z-10">
            <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
               <Cpu size={24} />
            </div>
            <h2 className="text-sm font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em] font-label-sm">Predictive_Insight_Matrix</h2>
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
                className="p-10 bg-[#131412] border border-[#424843] rounded-soft-xl hover:border-[#b1cdb7]/40 transition-all duration-500 shadow-sm"
              >
                 <div className="flex items-center gap-4 mb-8">
                    <insight.icon size={20} className="text-[#b1cdb7]" />
                    <span className="font-label-sm text-[11px] text-[#8c928c] font-bold uppercase tracking-widest italic opacity-40">{insight.label}</span>
                 </div>
                 <div className="text-3xl font-bold text-[#e4e2e0] font-headline-md uppercase italic mb-4 leading-none tracking-tight">{insight.value}</div>
                 <p className="font-label-sm text-[11px] text-[#b1cdb7] font-bold uppercase tracking-widest italic opacity-60">{insight.sub}</p>
              </motion.div>
            ))}
         </div>

         <div className="mt-12 p-10 bg-[#131412] border border-[#424843] rounded-soft-xl flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 bg-[#b1cdb7] rounded-soft-lg flex items-center justify-center shadow-2xl shadow-[#b1cdb7]/10">
                  <Zap size={28} className="text-[#1d3526]" />
               </div>
               <div>
                  <p className="text-base font-bold text-[#e4e2e0] uppercase italic tracking-tight font-headline-md">Optimization Strategy Ready</p>
                  <p className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-widest mt-2 italic opacity-40">AI Recommendation: Focus on "French Cuisine" segment for Paris/Lyon Geo-Targets.</p>
               </div>
            </div>
            <button className="px-10 py-5 bg-[#b1cdb7] text-[#1d3526] rounded-soft-lg text-[12px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all italic font-label-sm shadow-xl shadow-[#b1cdb7]/10">
               Apply_Optimization
            </button>
         </div>
      </section>

      <div className="grid grid-cols-12 gap-12">
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl min-h-[600px] flex flex-col relative overflow-hidden shadow-sm group">
             <div className="flex items-center justify-between mb-16 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
                      <BarChart3 size={24} />
                   </div>
                   <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em]">Neural_History</h2>
                </div>
             </div>

             <div className="flex-1 flex flex-col relative z-10">
                <div className="flex-1 flex items-end gap-4 px-8 pb-16 h-[380px]">
                   {analytics && analytics.length > 0 ? (
                     analytics.slice(-14).map((snap, i) => {
                       const maxViews = Math.max(...analytics.map(s => s.views || 0)) || 100;
                       const height = ((snap.views || 0) / maxViews) * 100;
                       
                       return (
                         <div key={i} className="flex-1 flex flex-col items-center gap-8 group h-full justify-end">
                            <div className="relative w-full flex flex-col justify-end h-full">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${Math.max(height, 5)}%` }}
                                 transition={{ delay: i * 0.05, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                 className="w-full bg-[#2d4535] border border-[#b1cdb7]/20 rounded-t-soft relative group-hover:bg-[#b1cdb7] group-hover:shadow-[0_0_25px_#b1cdb7] transition-all duration-500"
                               />
                            </div>
                            <span className="font-label-sm text-[10px] text-[#8c928c] font-bold rotate-45 origin-left whitespace-nowrap uppercase tracking-widest italic opacity-40">
                               {new Date(snap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                         </div>
                       );
                     })
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center py-20">
                        <Terminal size={64} className="text-[#8c928c]/10 mb-10" />
                        <p className="font-label-sm text-xs uppercase tracking-[0.5em] text-[#8c928c] font-bold italic opacity-20">Awaiting data stream...</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4">
           <div className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-10 shadow-sm relative overflow-hidden group min-h-[600px]">
              <div className="flex items-center justify-between border-b border-[#424843] pb-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
                       <Target size={24} />
                    </div>
                    <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em]">Top_Productions</h2>
                 </div>
              </div>

              <div className="space-y-8 relative z-10">
                  {(analyticsData.topPerformers || []).map((video, i) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="p-8 bg-[#131412] border border-[#424843] rounded-soft-xl hover:border-[#b1cdb7]/40 hover:bg-[#1f201e] transition-all duration-500 group/item shadow-sm"
                    >
                       <div className="flex justify-between items-start mb-8">
                          <span className="font-label-sm text-[10px] text-[#b1cdb7] font-bold uppercase tracking-widest italic opacity-60">{video.id.slice(0, 8).toUpperCase()}</span>
                          <ArrowUpRight size={18} className="text-[#8c928c] group-hover/item:text-[#b1cdb7] transition-colors" />
                       </div>
                       <h4 className="text-2xl font-bold text-[#e4e2e0] font-headline-md uppercase italic tracking-tight mb-10 group-hover/item:text-[#b1cdb7] transition-colors duration-500 line-clamp-2 leading-none">
                          {video.title || 'Untitled_Production'}
                       </h4>
                       <div className="grid grid-cols-2 gap-8 border-t border-[#424843] pt-8">
                          <div className="space-y-2">
                             <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40">STATUS</span>
                             <span className="text-xl text-[#e4e2e0] font-bold italic uppercase leading-none tracking-tight">{video.status}</span>
                          </div>
                          <div className="space-y-2">
                             <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40">PLATFORM</span>
                             <span className="text-xl text-[#b1cdb7] font-bold italic uppercase leading-none tracking-tight">{video.platform || 'TIKTOK'}</span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
                  {(!analyticsData.topPerformers || analyticsData.topPerformers.length === 0) && (
                    <div className="py-24 text-center opacity-10">
                       <p className="font-label-sm text-xs uppercase tracking-[0.5em] text-[#8c928c] font-bold italic">No Active Performers</p>
                    </div>
                  )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
