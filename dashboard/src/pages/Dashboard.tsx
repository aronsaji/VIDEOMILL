import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useLanguage } from '../contexts/LanguageContext';
import type { Order } from '../types';

export default function Dashboard() {
  const { t } = useLanguage();
  const { orders = [], fetchInitialData, fetchOrders } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">
            COMMAND_DASHBOARD_V4
          </h1>
          <p className="font-data-mono text-[14px] tracking-[0.05em] text-[#BD00FF]/60">
            SESSION_TOKEN: 882-VX-VIRAL-ALPHA
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#2a2a2b] border border-white/10 px-4 py-2 flex flex-col justify-center">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">ENGINE STATUS</span>
            <span className="font-data-mono text-[14px] text-[#6bff83] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse" />
              ULTRA_HYPER_DRIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left 8-col */}
        <div className="md:col-span-8 space-y-4">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'TOTAL VIEWS (24H)', value: '4.2M', delta: '+12.4% FROM BASELINE', deltaIcon: 'trending_up', deltaColor: 'text-[#6bff83]' },
              { label: 'AVG ENGAGEMENT', value: '18.2%', delta: 'CRITICAL VELOCITY', deltaIcon: 'bolt', deltaColor: 'text-[#6bff83]' },
              { label: 'ACTIVE AGENTS', value: String(safeOrders.length || 14), delta: '3 EXECUTING SYNC', deltaIcon: '', deltaColor: 'text-[#e90053]' },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#201f20] border border-white/10 p-6 relative overflow-hidden"
              >
                <div className="scanline-overlay absolute inset-0 opacity-10" />
                <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 mb-2 block uppercase">{m.label}</span>
                <div className="font-headline text-4xl font-[900] text-white">{m.value}</div>
                <div className={`flex items-center gap-2 mt-4 ${m.deltaColor}`}>
                  {m.deltaIcon === 'trending_up' && (
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                  )}
                  {m.deltaIcon === 'bolt' && (
                    <span className="material-symbols-outlined text-sm">bolt</span>
                  )}
                  {!m.deltaIcon && (
                    <span className="w-2 h-2 bg-[#e90053] rounded-full animate-pulse" />
                  )}
                  <span className="font-data-mono text-[12px] tracking-[0.05em]">{m.delta}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Viral Velocity Chart */}
          <div className="bg-[#201f20] border border-white/10 p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline text-[24px] font-bold text-[#e5e2e3] uppercase tracking-tighter">
                Viral Velocity Forecast
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[10px] border border-white/10 font-data-mono hover:bg-white/5 text-zinc-500">1H</button>
                <button className="px-3 py-1 text-[10px] border border-[#BD00FF] text-[#BD00FF] font-data-mono bg-[#BD00FF]/10">6H</button>
                <button className="px-3 py-1 text-[10px] border border-white/10 font-data-mono hover:bg-white/5 text-zinc-500">24H</button>
              </div>
            </div>
            <div className="h-64 w-full relative">
              <div className="absolute inset-0 flex items-end justify-between gap-1">
                {[40, 55, 45, 70, 85, 95, 80, 75, 60, 50, 65, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-full transition-all hover:opacity-100"
                    style={{
                      height: `${h}%`,
                      background: i === 4 || i === 5 ? 'rgba(189,0,255,0.6)' : i === 6 || i === 7 ? 'rgba(0,254,102,0.4)' : 'rgba(236,178,255,0.2)',
                    }}
                  />
                ))}
              </div>
              <div className="absolute left-0 right-0 h-[1px] bg-[#e90053]/30 top-1/4" />
              <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-2/4" />
              <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-3/4" />
            </div>
            <div className="flex justify-between mt-4 font-data-mono text-[10px] text-zinc-500">
              <span>00:00</span><span>02:00</span><span>04:00</span><span>06:00</span><span>CURRENT</span>
            </div>
          </div>
        </div>

        {/* Right 4-col: Live Render Queue */}
        <div className="md:col-span-4">
          <div className="bg-[#201f20] border border-white/10 h-full relative flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-white uppercase">LIVE RENDER QUEUE</span>
              <span className="font-data-mono text-[10px] text-[#6bff83]">{safeOrders.length || 8} JOBS PENDING</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(safeOrders.length > 0 ? safeOrders.slice(0, 3) : [
                { id: '1', title: 'CYBER_PUNK_TRAILER', status: 'rendering', progress: 65 },
                { id: '2', title: 'LIQUID_MOTION_v2', status: 'queued', progress: 0 },
                { id: '3', title: 'GLOBAL_REACH_MAPPING', status: 'queued', progress: 0 },
              ]).map((order: any, i: number) => {
                const isActive = order.status === 'rendering' || order.status === 'script_generation';
                return (
                  <div key={order.id} className={`p-4 bg-white/5 ${isActive ? 'border-l-2 border-[#BD00FF]' : 'opacity-60'}`}>
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 flex-shrink-0 bg-[#353436] relative flex items-center justify-center">
                        {isActive && (
                          <span className="material-symbols-outlined text-white text-xs animate-spin">refresh</span>
                        )}
                        {!isActive && (
                          <span className="material-symbols-outlined text-zinc-600 text-xs">hourglass_empty</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-label-caps text-[10px] mb-1 ${isActive ? 'text-[#BD00FF]' : 'text-zinc-500'}`}>
                          PROJECT: {(order.title || order.topic || 'UNTITLED').toUpperCase().replace(/\s+/g, '_').slice(0, 20)}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {isActive ? 'Generating AI-Visuals sequence...' : 'Queued - Waiting for Agent'}
                        </p>
                        {isActive && (
                          <div className="mt-2 w-full bg-white/10 h-1">
                            <div className="bg-[#BD00FF] h-full" style={{ width: `${order.progress || 65}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="m-4 py-2 border border-white/10 font-label-caps text-[10px] text-zinc-500 hover:bg-white/5 transition-all uppercase">
              VIEW ALL JOBS ({safeOrders.length || 22})
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Engine Telemetry */}
        <div className="md:col-span-1 bg-[#201f20] border border-white/10 p-6">
          <h4 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 mb-4 flex items-center gap-2 uppercase">
            <span className="material-symbols-outlined text-sm">bolt</span> ENGINE TELEMETRY
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-400">GPU LOAD</span>
                <span className="font-data-mono text-xs text-white">88%</span>
              </div>
              <div className="w-full bg-white/5 h-1">
                <div className="bg-[#00fe66] h-full" style={{ width: '88%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-400">MEMORY</span>
                <span className="font-data-mono text-xs text-white">4.2GB / 16GB</span>
              </div>
              <div className="w-full bg-white/5 h-1">
                <div className="bg-[#BD00FF] h-full" style={{ width: '26%' }} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">TEMP</span>
              <span className="font-data-mono text-xs text-[#ffb4ab]">72°C</span>
            </div>
          </div>
        </div>

        {/* Live Status Feed */}
        <div className="md:col-span-3 bg-[#201f20] border border-white/10 overflow-hidden relative">
          <div className="scanline-overlay absolute inset-0 opacity-5" />
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h4 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-white uppercase">NON-STOP VIRAL ENGINE STATUS FEED</h4>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse" />
              <span className="font-data-mono text-[10px] text-[#6bff83]">LIVE_STREAM_ACTIVE</span>
            </div>
          </div>
          <div className="p-6 h-48 overflow-hidden font-data-mono text-[11px] space-y-1">
            <p className="text-zinc-500"><span className="text-[#BD00FF]">[08:42:11]</span> AGENT_DELTA: Deploying &apos;Tech-Short-04&apos; to TikTok cluster B.</p>
            <p className="text-zinc-500"><span className="text-[#BD00FF]">[08:42:15]</span> SYSTEM: High-engagement detected on Reels (ID: 99x-A). Boosting velocity.</p>
            <p className="text-[#6bff83] font-bold"><span className="text-[#BD00FF]">[08:42:18]</span> SIGNAL: Viral threshold exceeded in EU-WEST. Engagement +400%.</p>
            <p className="text-zinc-500"><span className="text-[#BD00FF]">[08:42:22]</span> AGENT_EPSILON: Analyzing comment sentiment... POSITIVE (89%).</p>
            <p className="text-zinc-500"><span className="text-[#BD00FF]">[08:42:25]</span> RENDER_CORE: Project &apos;FUTURE_X&apos; frame 1024/2048 complete.</p>
            <p className="text-zinc-500"><span className="text-[#BD00FF]">[08:42:29]</span> SYSTEM: Auto-generating 4 variations for AB testing.</p>
            <p className="text-[#e90053]"><span className="text-[#BD00FF]">[08:42:31]</span> ALERT: Content saturation alert in cluster &apos;GAMING_VIBES&apos;. Shifting niche.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
