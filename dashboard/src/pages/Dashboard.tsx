import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  TrendingUp, 
  Play, 
  Activity, 
  Cpu, 
  Layers,
  ChevronRight,
  Terminal,
  Zap,
  Globe,
  Monitor,
  Mic2,
  Share2,
  Radar,
  Database as DatabaseIcon
} from 'lucide-react';

import { useI18nStore } from '../store/i18nStore';

export default function Dashboard() {
  const { t } = useI18nStore();
  const orders = usePipelineStore(state => state.orders);
  const trends = usePipelineStore(state => state.trends);
  const videos = usePipelineStore(state => state.videos);
  const fetchInitialData = usePipelineStore(state => state.fetchInitialData);
  const subscribeToChanges = usePipelineStore(state => state.subscribeToChanges);

  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    vram: 18.4,
    temp: 42,
    throughput: 1.2
  });
  const [systemHealth, setSystemHealth] = useState({
    commandCenter: 'ONLINE',
    voiceServer: 'WAITING',
    neuralDatabase: 'LINKED',
    automationHub: 'ACTIVE'
  });

  useEffect(() => {
    setMounted(true);
    fetchInitialData();
    const unsubscribe = subscribeToChanges();
    
    // Check Voice Server (Epic Engine)
    const checkHealth = () => {
      fetch('http://localhost:3001/health')
        .then(res => res.json())
        .then(data => {
          setSystemHealth(prev => ({ ...prev, voiceServer: 'ONLINE' }));
          if (data.gpu) {
            setMetrics(prev => ({
              ...prev,
              temp: data.gpu.temp || prev.temp,
              vram: data.gpu.vram || prev.vram
            }));
          }
        })
        .catch(() => setSystemHealth(prev => ({ ...prev, voiceServer: 'OFFLINE' })));
    };

    checkHealth();
    const healthInterval = setInterval(checkHealth, 5000);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      clearInterval(healthInterval);
    };
  }, [fetchInitialData, subscribeToChanges]);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeTrends = Array.isArray(trends) ? trends : [];
  const productions = usePipelineStore(state => state.productions);
  const safeVideos = Array.isArray(videos) && videos.length > 0 ? videos : (Array.isArray(productions) ? productions : []);

  useEffect(() => {
    console.log("📊 Dashboard Data Check:", { videosCount: safeVideos.length, system: systemHealth.voiceServer });
  }, [safeVideos]);

  const stats = [
    { label: 'RENDER_FLOW', value: safeVideos.filter(v => v.status === 'rendering' || v.status === 'processing').length || 0, sub: 'ACTIVE_NODES', color: 'text-[#6bff83]', icon: Cpu, borderColor: 'border-[#6bff83]/20' },
    { label: 'ARCHIVE_SIZE', value: safeVideos.length, sub: 'FINISHED_ASSETS', color: 'text-[#BD00FF]', icon: TrendingUp, borderColor: 'border-[#BD00FF]/20' },
    { label: 'QUEUE_DEPTH', value: safeVideos.filter(v => v.status === 'pending' || v.status === 'queued').length || 0, sub: 'TASKS_PENDING', color: 'text-[#00f5ff]', icon: Layers, borderColor: 'border-[#00f5ff]/20' },
    { label: 'LIVE_TRENDS', value: safeTrends.length, sub: 'RADAR_ACTIVE', color: 'text-[#ffaa00]', icon: Activity, borderColor: 'border-[#ffaa00]/20' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Kinetic Metrics Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`panel-kinetic p-8 group clipped-corner ${stat.borderColor} bg-white/[0.01]`}
          >
            <div className="scanline-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-black/40 border border-white/5 clipped-corner-sm ${stat.color}`}>
                   <stat.icon size={22} />
                </div>
                <div className="font-label-caps text-[11px] text-zinc-500 uppercase tracking-[0.4em] font-black group-hover:text-white transition-colors">
                  {t(stat.sub)}
                </div>
              </div>
              <div className="font-headline text-5xl font-black text-white tracking-tighter mb-1 italic">
                {String(stat.value).padStart(2, '0')}
              </div>
              <div className="font-label-caps text-[12px] font-bold text-zinc-300 uppercase tracking-[0.25em]">{t(stat.label)}</div>
            </div>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-current opacity-30 ${stat.color}`} style={{ width: '100%' }} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Feed: Production Monitor */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="panel-kinetic border-[#BD00FF]/10 clipped-corner min-h-[600px] flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#BD00FF] animate-pulse-led rounded-full" />
                <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">LIVE_PRODUCTION_ORCHESTRATOR</h2>
              </div>
              <div className="flex gap-6 font-data-mono text-[12px]">
                <span className="text-zinc-400 uppercase font-bold tracking-widest">NETWORK: <span className="text-[#6bff83]">ACTIVE</span></span>
                <span className="text-zinc-400 uppercase font-bold tracking-widest">FPS: <span className="text-[#00f5ff]">60.0</span></span>
              </div>
            </div>
            
            <div className="divide-y divide-white/5 flex-1">
              {safeVideos.length > 0 ? [...safeVideos]
                .sort((a, b) => {
                  const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
                  const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
                  return timeB - timeA;
                })
                .slice(0, 6).map((video) => (
                <div key={video.id} className="p-8 flex items-center gap-8 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
                  <div className="w-24 h-32 bg-[#0A0A0B] border border-white/10 relative overflow-hidden shrink-0 clipped-corner-sm group-hover:border-[#BD00FF]/40 transition-colors">
                    <div className="absolute inset-0 bg-[#BD00FF]/5 group-hover:bg-[#BD00FF]/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                       {video.status === 'completed' ? <Play size={32} className="text-[#6bff83]/40" /> : <Zap size={32} className="text-[#BD00FF]/40 animate-pulse" />}
                    </div>
                    {/* Visual Progress Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${video.progress || 0}%` }}
                        className="h-full bg-[#BD00FF]"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`px-3 py-1 font-data-mono text-[9px] font-black uppercase tracking-widest border clipped-corner-sm ${
                        video.status === 'completed' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-[#BD00FF]/10 text-[#BD00FF] border-[#BD00FF]/20'
                      }`}>
                        {video.status || 'PROCESSING'}
                      </span>
                      <span className="font-data-mono text-[10px] text-zinc-600 uppercase font-bold tracking-widest">SEC_ID: {String(video.id).slice(0,12)}</span>
                    </div>
                    <h3 className="font-headline text-2xl font-black text-white uppercase italic truncate group-hover:text-[#BD00FF] transition-colors tracking-tight">
                      {video.title || video.topic || 'NEURAL_GEN_TARGET'}
                    </h3>
                    <div className="flex gap-8 mt-4">
                      <div className="flex flex-col">
                        <span className="font-data-mono text-[8px] text-[#BD00FF] animate-pulse uppercase mb-1">
                          {video.sub_status || 'Waiting_for_node...'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3">
                     <div className="font-data-mono text-lg font-black text-[#6bff83] italic">{String(video.progress || '0').padStart(2, '0')}%</div>
                     <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#BD00FF] to-[#6bff83]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${video.progress || 0}%` }}
                        />
                     </div>
                  </div>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
                   <div className="p-8 bg-white/[0.01] border border-white/5 clipped-corner text-zinc-800">
                      <Cpu size={64} />
                   </div>
                    <p className="text-[#BD00FF] font-data-mono uppercase tracking-[0.3em] text-xs animate-pulse">SCANNING NEURAL NETWORK FOR PENDING TASKS...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar: System Telemetry */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* System Architecture */}
          <div className="panel-kinetic p-8 border-[#00f5ff]/10 clipped-corner">
            <div className="flex items-center gap-3 mb-8">
              <Globe size={18} className="text-[#00f5ff]" />
              <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">SYSTEM_ARCHITECTURE</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Command Center', status: systemHealth.commandCenter, icon: Monitor, color: 'text-[#BD00FF]', led: 'bg-[#BD00FF]' },
                { name: 'Voice Server', status: systemHealth.voiceServer, icon: Mic2, color: 'text-[#6bff83]', led: 'bg-[#6bff83]' },
                { name: 'Neural Database', status: systemHealth.neuralDatabase, icon: DatabaseIcon, color: 'text-[#ffaa00]', led: 'bg-[#ffaa00]' },
                { name: 'Automation Hub', status: systemHealth.automationHub, icon: Share2, color: 'text-[#00f5ff]', led: 'bg-[#00f5ff]' },
              ].map((node) => (
                <div key={node.name} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 clipped-corner-sm group hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-4">
                    <node.icon size={16} className={node.color} />
                    <span className="font-data-mono text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{node.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-data-mono text-[9px] px-2 py-0.5 font-black italic ${
                      node.status === 'ONLINE' || node.status === 'LINKED' || node.status === 'ACTIVE' 
                      ? 'text-[#6bff83]' 
                      : 'text-red-500'
                    }`}>
                      {node.status}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${node.led} animate-pulse-led`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Performance */}
          <div className="panel-kinetic p-8 border-[#ffaa00]/10 clipped-corner">
            <div className="flex items-center gap-3 mb-8">
              <Terminal size={18} className="text-[#ffaa00]" />
              <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">ENGINE_PERFORMANCE</h2>
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between font-data-mono text-[10px] uppercase font-bold tracking-widest">
                     <span className="text-zinc-400">Core Temp</span>
                     <span className="text-white">{metrics.temp}°C</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                      animate={{ width: `${(metrics.temp/100)*100}%` }}
                      className="h-full bg-orange-500" 
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between font-data-mono text-[10px] uppercase font-bold tracking-widest">
                     <span className="text-zinc-400">VRAM Usage</span>
                     <span className="text-white">{metrics.vram}GB</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                      animate={{ width: `${(metrics.vram/24)*100}%` }}
                      className="h-full bg-[#BD00FF]" 
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between font-data-mono text-[10px] uppercase font-bold tracking-widest">
                     <span className="text-zinc-400">Net Throughput</span>
                     <span className="text-white">{metrics.throughput} GBPS</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                      animate={{ width: `${(metrics.throughput/5)*100}%` }}
                      className="h-full bg-[#00f5ff]" 
                     />
                  </div>
               </div>
            </div>
          </div>

          {/* Radar Intercept */}
          <div className="bg-[#BD00FF] p-0.5 clipped-corner">
            <div className="bg-black p-8 clipped-corner relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[#BD00FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-headline text-2xl font-black text-[#BD00FF] italic uppercase leading-tight tracking-tighter">
                     RADAR_INTERCEPT
                   </h3>
                   <Radar size={20} className="text-[#BD00FF] animate-radar" />
                </div>
                <div className="space-y-3">
                  {[...safeTrends]
                    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                    .slice(0, 3)
                    .map((trend: any, i: number) => (
                    <div key={trend.id || i} className="flex justify-between items-center bg-white/[0.03] p-3 border-l-2 border-[#BD00FF]">
                      <span className="font-data-mono text-[10px] text-white font-bold uppercase tracking-widest truncate mr-4">
                        {trend.title || trend.topic || 'NEURAL_SIGNAL'}
                      </span>
                      <span className="font-data-mono text-[9px] text-[#6bff83] font-black italic">{trend.growth_stat || 'STABLE'}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end items-center gap-2 font-data-mono text-[10px] text-[#BD00FF] font-black uppercase italic group-hover:gap-4 transition-all">
                  VIEW_RADAR <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
