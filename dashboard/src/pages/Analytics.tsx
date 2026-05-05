import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Clock, Users, Activity, Shield, BarChart3, Target, ArrowUpRight, Cpu
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
  const engineOnline = true; // Assuming engine is reachable if dashboard is open

  const metrics = [
    { 
      label: 'TOTAL_NETWORK_VIEWS', 
      value: formatNumber(analyticsData.totalViews), 
      change: '+14%', 
      isPositive: true, 
      icon: Eye, 
      color: 'text-[#00f5ff]' 
    },
    { 
      label: 'WATCH_TIME_ACCUMULATED', 
      value: formatNumber(analyticsData.totalWatchTime), 
      change: '+8%', 
      isPositive: true, 
      icon: Clock, 
      color: 'text-[#BD00FF]' 
    },
    { 
      label: 'AUDIENCE_RETENTION', 
      value: `${analyticsData.avgRetention}%`, 
      change: 'STABLE', 
      isPositive: true, 
      icon: Users, 
      color: 'text-[#ffaa00]' 
    },
    { 
      label: 'NEURAL_ENGAGEMENT', 
      value: formatNumber(analyticsData.engagement), 
      change: '+24%', 
      isPositive: true, 
      icon: Activity, 
      color: 'text-[#6bff83]' 
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#BD00FF] font-data-mono text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic animate-pulse-led">
            <Activity size={14} />
            NEURAL_PERFORMANCE_METRICS_v2.4
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            DATA_SYNTHESIS
          </h1>
        </div>
        
        <div className="flex gap-4 relative z-10">
           {isLoading && <span className="animate-pulse text-[10px] font-mono text-green-500">SYNCING_LIVE_NODE...</span>}
           <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 clipped-corner-sm">
              <Shield size={14} className="text-[#6bff83]" />
              <span className="font-data-mono text-[9px] text-zinc-400 font-black tracking-widest uppercase">ENCRYPTION: AES-256</span>
           </div>
        </div>
      </header>

      {/* Epic Engine Status Bar */}
      <section className="bg-white/[0.02] border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
          <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
              <div className={`w-3 h-3 rounded-full ${engineOnline ? 'bg-[#6bff83] animate-pulse shadow-[0_0_10px_#6bff83]' : 'bg-red-500'}`} />
              <div>
                  <p className="font-data-mono text-[10px] text-zinc-500 uppercase tracking-widest">Epic_Engine_v14.4</p>
                  <h3 className="font-headline text-lg font-black text-white italic uppercase tracking-tighter">
                      {engineOnline ? 'SYSTEM_STATUS: NOMINAL' : 'SYSTEM_STATUS: DISCONNECTED'}
                  </h3>
              </div>
          </div>

          <div className="flex items-center gap-12 relative z-10">
              <div className="flex flex-col items-end">
                  <span className="font-data-mono text-[9px] text-zinc-600 uppercase">GPU_ORCHESTRATION</span>
                  <div className="flex gap-1 mt-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className={`w-1 h-3 ${i < (activeRenders.length > 0 ? 6 : 2) ? 'bg-[#BD00FF]' : 'bg-white/10'}`} />
                      ))}
                  </div>
              </div>
              <div className="flex flex-col items-end border-l border-white/10 pl-12">
                  <span className="font-data-mono text-[9px] text-zinc-600 uppercase">ACTIVE_NODES</span>
                  <span className="font-headline text-2xl font-black text-[#00f5ff] italic uppercase">{activeRenders.length}</span>
              </div>
          </div>
      </section>

      {/* Industrial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="panel-kinetic p-8 flex flex-col group border-white/5 bg-white/[0.01] clipped-corner relative overflow-hidden"
          >
            <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
               <div className={`p-3 bg-black/60 border border-white/5 clipped-corner-sm ${stat.color}`}>
                  <stat.icon size={20} />
               </div>
               <span className={`font-data-mono text-[10px] font-black ${stat.isPositive ? 'text-[#6bff83]' : 'text-[#e90053]'}`}>
                  {stat.change}
               </span>
            </div>
            <div className="font-headline text-5xl font-black text-white italic tracking-tighter mb-2">{stat.value}</div>
            <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Analytics Canvas */}
        <section className="col-span-12 lg:col-span-8">
          <div className="panel-kinetic p-10 clipped-corner border-white/5 min-h-[500px] flex flex-col relative overflow-hidden">
             <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
             
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-3">
                   <BarChart3 size={18} className="text-[#00f5ff]" />
                   <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">TELEMETRY_VISUALIZATION</h2>
                </div>
                <div className="flex gap-2">
                   {['24H', '7D', '30D', 'ALL'].map(t => (
                     <button key={t} className="px-3 py-1 font-data-mono text-[9px] font-black text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-white/10 clipped-corner-sm">
                        {t}
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 flex flex-col relative z-10">
                {/* Data Grid Background */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-[0.03] pointer-events-none">
                   {Array.from({ length: 24 }).map((_, i) => (
                     <div key={i} className="border border-white" />
                   ))}
                </div>

                <div className="flex-1 flex items-end gap-2 px-4 pb-8 h-[300px]">
                   {analytics.length > 0 ? (
                     analytics.slice(-12).map((snap, i) => {
                       const maxViews = Math.max(...analytics.map(s => s.views || 0)) || 100;
                       const height = ((snap.views || 0) / maxViews) * 100;
                       
                       return (
                         <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                            <div className="relative w-full flex flex-col justify-end h-full">
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${height}%` }}
                                 transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                                 className="w-full bg-gradient-to-t from-[#00f5ff]/40 to-[#00f5ff] relative group-hover:from-[#00f5ff]/60 group-hover:to-[#00f5ff] transition-all"
                               >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-data-mono text-[9px] text-[#00f5ff] font-black whitespace-nowrap">
                                     {formatNumber(snap.views)}
                                  </div>
                               </motion.div>
                            </div>
                            <span className="font-data-mono text-[8px] text-zinc-700 font-bold rotate-45 origin-left whitespace-nowrap uppercase">
                               {new Date(snap.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                       );
                     })
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 border-2 border-dashed border-white/10 rounded-full animate-spin mb-6" />
                        <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest">Awaiting sensor data stream...</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* Tactical Feed: Top Performers */}
        <section className="col-span-12 lg:col-span-4 space-y-8">
           <div className="panel-kinetic p-8 space-y-8 clipped-corner border-white/5 min-h-[500px]">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                 <Target size={18} className="text-[#BD00FF]" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">HIGH_VALUE_TARGETS</h2>
              </div>

              <div className="space-y-6">
                  {analyticsData.topPerformers.map((video, i) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="p-6 bg-white/[0.02] border border-white/5 clipped-corner-sm hover:border-[#BD00FF]/30 transition-all group cursor-crosshair"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <span className="font-data-mono text-[10px] text-[#BD00FF] font-black tracking-widest">{video.id.slice(0, 8)}</span>
                          <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-[#BD00FF] transition-colors" />
                       </div>
                       <h4 className="font-headline text-lg font-black text-white uppercase italic tracking-tight mb-6 group-hover:text-[#BD00FF] transition-colors line-clamp-2 leading-tight">
                          {video.title || 'Untitled Production'}
                       </h4>
                       <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                          <div>
                             <span className="font-label-caps text-[8px] text-zinc-600 uppercase block font-bold tracking-widest">STATUS</span>
                             <span className="font-headline text-xl text-white font-black italic tracking-tighter uppercase">{video.status}</span>
                          </div>
                          <div>
                             <span className="font-label-caps text-[8px] text-zinc-600 uppercase block font-bold tracking-widest">PLATFORM</span>
                             <span className="font-headline text-xl text-[#6bff83] font-black italic tracking-tighter uppercase">{video.platform || 'N/A'}</span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
              </div>

              <button className="w-full py-4 bg-white/[0.02] border border-white/10 text-zinc-600 hover:text-white hover:bg-white/[0.05] transition-all font-headline font-black uppercase italic text-[11px] tracking-widest clipped-corner-sm mt-4">
                 EXTRACT_FULL_LOGS
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
