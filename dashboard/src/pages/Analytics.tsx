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
  const { analyticsData, fetchAnalytics, isLoading } = usePipelineStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

             <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-[120px] h-[120px] bg-[#00f5ff]/5 border border-[#00f5ff]/20 rounded-full flex items-center justify-center mb-6 relative">
                   <div className="absolute inset-0 border border-[#00f5ff]/10 rounded-full animate-ping" />
                   <Cpu size={48} className="text-[#00f5ff] animate-pulse" />
                </div>
                <h3 className="font-headline text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">NETWORK_SYNC_PENDING</h3>
                <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold max-w-sm mx-auto leading-relaxed">
                   ESTABLISHING_HANDSHAKE_WITH_LOCAL_NODE... INITIALIZING_DATA_STREAM_PIPELINES_v2.0
                </p>
                <button className="mt-10 px-8 py-3 bg-[#00f5ff] text-black font-headline font-black uppercase italic text-sm tracking-widest hover:shadow-[0_0_20px_#00f5ff] transition-all clipped-corner-sm">
                   INITIATE_RESCAN
                </button>
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
