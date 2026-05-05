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
  Database,
  Mic2,
  Share2
} from 'lucide-react';

export default function Dashboard() {
  const { orders = [], trends = [], fetchInitialData, subscribeToChanges } = usePipelineStore();
  const [mounted, setMounted] = useState(false);
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
    fetch('http://localhost:3001/render', { method: 'HEAD' })
      .then(() => setSystemHealth(prev => ({ ...prev, voiceServer: 'ONLINE' })))
      .catch(() => setSystemHealth(prev => ({ ...prev, voiceServer: 'OFFLINE' })));

    return () => unsubscribe();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeTrends = Array.isArray(trends) ? trends : [];

  const stats = [
    { label: 'RENDER_FLOW', value: safeOrders.filter(o => o.status === 'processing' || o.status === 'rendering').length || 0, sub: 'ACTIVE_NODES', color: 'text-[#6bff83]', icon: Cpu },
    { label: 'VIRAL_VELOCITY', value: '42.8M', sub: 'LAST_24H', color: 'text-[#BD00FF]', icon: TrendingUp },
    { label: 'QUEUE_DEPTH', value: safeOrders.filter(o => o.status === 'queued' || o.status === 'pending').length || 0, sub: 'TASKS_PENDING', color: 'text-[#00f5ff]', icon: Layers },
    { label: 'SYSTEM_HEALTH', value: '99.9%', sub: 'STABLE', color: 'text-[#ffaa00]', icon: Activity },
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0B] border border-white/10 p-6 relative group overflow-hidden"
          >
            <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <stat.icon size={20} className={stat.color} />
                <span className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest">{stat.sub}</span>
              </div>
              <div className="font-headline text-4xl font-[900] text-white tracking-tighter mb-1">{stat.value}</div>
              <div className="font-label-caps text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 bg-current opacity-20 ${stat.color}`} style={{ width: '100%' }} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Feed: Active Productions */}
        <section className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-[#0A0A0B] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-[#BD00FF]" />
                <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">LIVE_PRODUCTION_QUEUE</h2>
              </div>
              <div className="flex gap-4 font-data-mono text-[10px]">
                <span className="text-zinc-600 uppercase">LATENCY: <span className="text-[#6bff83]">14MS</span></span>
                <span className="text-zinc-600 uppercase">THROUGHPUT: <span className="text-[#00f5ff]">8.2/MIN</span></span>
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {safeOrders.length > 0 ? safeOrders.slice(0, 5).map((order) => (
                <div key={order.id || order.video_id} className="p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                  <div className="w-24 h-32 bg-[#1c1b1c] border border-white/5 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[#BD00FF]/10 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                       {order.status === 'completed' ? <Play size={24} /> : <Zap size={24} />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 font-data-mono text-[9px] font-bold uppercase tracking-widest border ${
                        order.status === 'completed' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-[#BD00FF]/10 text-[#BD00FF] border-[#BD00FF]/20'
                      }`}>
                        {order.status || 'PROCESSING'}
                      </span>
                      <span className="font-data-mono text-[10px] text-zinc-600 uppercase">ID: {String(order.id || order.video_id).slice(0,8)}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-white uppercase italic truncate group-hover:text-[#BD00FF] transition-colors">
                      {order.title || order.topic || 'NEURAL_GEN_TARGET'}
                    </h3>
                    <div className="flex gap-4 mt-3">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[9px] text-zinc-600 uppercase">PLATFORM</span>
                        <span className="font-data-mono text-[11px] text-zinc-400 uppercase">{order.platform || 'TIKTOK'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[9px] text-zinc-600 uppercase">LANGUAGE</span>
                        <span className="font-data-mono text-[11px] text-zinc-400 uppercase">{order.language || 'NORSK'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <div className="font-data-mono text-xs text-[#6bff83]">{order.progress || '0'}%</div>
                     <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#6bff83]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress || 0}%` }}
                        />
                     </div>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-zinc-700 font-data-mono uppercase">
                   No active production nodes detected.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar: Telemetry & Trends */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          {/* Architecture Status */}
          <div className="bg-[#0A0A0B] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe size={16} className="text-[#00f5ff]" />
              <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">SYSTEM_ARCHITECTURE</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Command Center', status: systemHealth.commandCenter, icon: Monitor, color: 'text-[#BD00FF]' },
                { name: 'Voice Server', status: systemHealth.voiceServer, icon: Mic2, color: 'text-[#6bff83]' },
                { name: 'Neural Database', status: systemHealth.neuralDatabase, icon: Database, color: 'text-[#ffaa00]' },
                { name: 'Automation Hub', status: systemHealth.automationHub, icon: Share2, color: 'text-[#00f5ff]' },
              ].map((node) => (
                <div key={node.name} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 group">
                  <div className="flex items-center gap-3">
                    <node.icon size={14} className={node.color} />
                    <span className="font-data-mono text-[10px] text-zinc-400 uppercase">{node.name}</span>
                  </div>
                  <span className={`font-data-mono text-[9px] px-2 py-0.5 rounded-sm ${
                    node.status === 'ONLINE' || node.status === 'LINKED' || node.status === 'ACTIVE' 
                    ? 'bg-[#6bff83]/10 text-[#6bff83]' 
                    : 'bg-red-500/10 text-red-500'
                  }`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Telemetry */}
          <div className="bg-[#0A0A0B] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Terminal size={16} className="text-[#ffaa00]" />
              <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">ENGINE_TELEMETRY</h2>
            </div>
            <div className="space-y-4 font-data-mono text-[11px]">
              <div className="flex justify-between text-zinc-500 uppercase">
                <span>Core Temperature</span>
                <span className="text-[#6bff83]">42°C</span>
              </div>
              <div className="flex justify-between text-zinc-500 uppercase">
                <span>VRAM Allocation</span>
                <span className="text-[#BD00FF]">18.4GB / 24GB</span>
              </div>
              <div className="flex justify-between text-zinc-500 uppercase">
                <span>Network Load</span>
                <span className="text-[#00f5ff]">1.2 GBPS</span>
              </div>
            </div>
          </div>

          {/* Trending Pulse */}
          <div className="bg-[#BD00FF] p-6 clipped-corner group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="font-headline text-[24px] font-[900] text-black italic uppercase leading-tight mb-4">
                TREND_DETECTION_ACTIVE
              </h3>
              <div className="space-y-2">
                {(safeTrends.length > 0 ? safeTrends : [
                  { title: '#AI_GEN', growth_stat: '+124%' },
                  { title: '#NEON_FLUX', growth_stat: '+88%' }
                ]).slice(0, 3).map((trend, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/10 p-2 border-l-2 border-black">
                    <span className="font-data-mono text-[10px] text-black font-bold uppercase">{trend.title}</span>
                    <span className="font-data-mono text-[9px] text-black opacity-60">{trend.growth_stat || '+124%'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <ChevronRight size={20} className="text-black" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
