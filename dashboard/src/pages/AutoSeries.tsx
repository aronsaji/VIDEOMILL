import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Zap, 
  Activity, 
  Clock, 
  BarChart3, 
  Settings2,
  ChevronRight,
  Play
} from 'lucide-react';

export default function AutoSeries() {
  const { orders = [], fetchOrders, subscribeToChanges } = usePipelineStore();

  useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const series = [
    { id: '1', title: 'CYBER_PUNK_DAILY', status: 'ACTIVE', velocity: '+18.4%', renders: 24, health: 98 },
    { id: '2', title: 'MINIMAL_TECH_FLOW', status: 'PAUSED', velocity: '-2.1%', renders: 12, health: 85 },
    { id: '3', title: 'VAPOR_WAVE_NIGHTS', status: 'ACTIVE', velocity: '+42.1%', renders: 56, health: 100 },
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] text-[#e5e2e3] uppercase italic">
            AUTO_SERIES_TERMINAL
          </h1>
          <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest mt-1">
            Autonomous Pipeline Management // Recursive Content Nodes
          </p>
        </div>
        <button className="bg-[#BD00FF] hover:bg-[#BD00FF]/80 text-black px-8 py-3 font-headline font-bold uppercase italic skew-x-[-12deg] transition-all">
          DEPLOY_NEW_PIPELINE
        </button>
      </header>

      {/* Bento Stats */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A0A0B] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#BD00FF]" />
              <span className="font-label-caps text-[10px] font-bold text-zinc-500 uppercase">System_Velocity</span>
            </div>
            <div className="font-headline text-4xl font-black text-white italic">+142%</div>
            <div className="mt-4 h-1 w-full bg-white/5">
              <div className="h-full bg-[#BD00FF]" style={{ width: '75%' }} />
            </div>
          </div>
          <div className="bg-[#0A0A0B] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-[#6bff83]" />
              <span className="font-label-caps text-[10px] font-bold text-zinc-500 uppercase">Render_Stack</span>
            </div>
            <div className="font-headline text-4xl font-black text-white italic">{safeOrders.length}</div>
            <p className="font-data-mono text-[10px] text-zinc-600 uppercase mt-2">Active Production Threads</p>
          </div>
          <div className="bg-[#0A0A0B] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-[#00f5ff]" />
              <span className="font-label-caps text-[10px] font-bold text-zinc-500 uppercase">Pipeline_Health</span>
            </div>
            <div className="font-headline text-4xl font-black text-white italic">99.8%</div>
            <p className="font-data-mono text-[10px] text-zinc-600 uppercase mt-2">All Agents Operational</p>
          </div>
        </div>

        {/* Global Control */}
        <div className="col-span-12 lg:col-span-4 bg-[#BD00FF]/5 border border-[#BD00FF]/20 p-6 relative overflow-hidden">
          <div className="scanline-overlay absolute inset-0 opacity-10" />
          <h3 className="font-label-caps text-xs font-bold text-[#BD00FF] uppercase mb-6 tracking-widest flex items-center gap-2">
            <Settings2 size={14} /> MASTER_ORCHESTRATION
          </h3>
          <div className="space-y-3">
             <button className="w-full py-3 bg-[#BD00FF] text-black font-headline font-bold uppercase italic text-sm">RESUME_ALL_PIPELINES</button>
             <button className="w-full py-3 bg-white/5 border border-white/10 text-white font-headline font-bold uppercase italic text-sm">PAUSE_ALL_TRAFFIC</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Active Series Management */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <h2 className="font-label-caps text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">MANAGED_PIPELINES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {series.map(s => (
              <motion.div 
                key={s.id}
                whileHover={{ y: -5 }}
                className="bg-[#0A0A0B] border border-white/10 p-6 relative group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-white uppercase italic group-hover:text-[#BD00FF] transition-colors">{s.title}</h3>
                    <span className="font-data-mono text-[10px] text-zinc-500 uppercase tracking-widest">{s.status} // CLUSTER_{s.id}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${s.status === 'ACTIVE' ? 'bg-[#6bff83] animate-pulse shadow-[0_0_8px_#6bff83]' : 'bg-zinc-700'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3">
                    <span className="font-label-caps text-[9px] text-zinc-500 uppercase block mb-1">Velocity</span>
                    <span className="font-data-mono text-sm text-[#6bff83]">{s.velocity}</span>
                  </div>
                  <div className="bg-white/5 p-3">
                    <span className="font-label-caps text-[9px] text-zinc-500 uppercase block mb-1">Health</span>
                    <span className="font-data-mono text-sm text-[#00f5ff]">{s.health}%</span>
                  </div>
                </div>
                <button className="w-full py-2 border border-white/10 text-zinc-400 font-label-caps text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <Settings2 size={12} /> CONFIGURE_PIPELINE
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Logs / Terminal */}
        <div className="col-span-12 lg:col-span-4 bg-[#0A0A0B] border border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="font-label-caps text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-[#6bff83]" /> AGENT_LOG_FEED
            </span>
            <span className="w-2 h-2 rounded-full bg-[#6bff83] animate-pulse" />
          </div>
          <div className="flex-1 p-4 font-data-mono text-[11px] space-y-3 overflow-y-auto max-h-[400px]">
             {safeOrders.slice(0, 8).map((log, i) => (
               <div key={i} className="flex gap-3 text-zinc-500 border-l border-zinc-800 pl-3">
                 <span className="shrink-0 text-[#BD00FF]">{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}</span>
                 <p className="uppercase leading-relaxed">
                   TASK_EXECUTION: <span className="text-white">{log.topic || log.title}</span> // 
                   STATUS: <span className="text-[#6bff83]">{log.status}</span> // 
                   CLUSTER_NODE: <span className="text-zinc-400">0x{i}F</span>
                 </p>
               </div>
             ))}
             {safeOrders.length === 0 && (
               <div className="text-zinc-800 text-center py-10">NO_LIVE_FEED_DETECTED</div>
             )}
          </div>
          <button className="w-full py-3 border-t border-white/10 font-label-caps text-[9px] text-zinc-600 uppercase hover:bg-white/5 transition-all tracking-[0.2em]">
            DOWNLOAD_FULL_LOG_MANIFEST
          </button>
        </div>
      </div>
    </div>
  );
}
