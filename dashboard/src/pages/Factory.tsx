import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import {
  Cpu, Gauge, Factory, Rocket, Database, Clock,
  StopCircle, Activity, Terminal, Search, Filter
} from 'lucide-react';

const glass = {
  background: 'rgba(9, 16, 12, 0.6)',
  backdropFilter: 'blur(20px) saturate(150%)',
  border: '1px solid rgba(12, 198, 135, 0.2)',
};

const LOG_ENTRIES = [
  { time: '14:22:01', tag: 'SYS', tagColor: 'text-emerald-400', text: 'Initializing Viral_Shorts_Gen_04 core modules...' },
  { time: '14:22:05', tag: 'GPU', tagColor: 'text-violet-400', text: 'Allocating 8GB VRAM to primary rendering cluster.' },
  { time: '14:23:12', tag: 'NET', tagColor: 'text-cyan-400', text: "CDN edge node 'Tokyo-02' established handshake." },
  { time: '14:25:44', tag: 'WARN', tagColor: 'text-amber-400', text: 'Latency detected on Asset_Server_Alpha. Retrying.' },
  { time: '14:26:01', tag: 'SYS', tagColor: 'text-emerald-400', text: 'Batch 28-A completed successfully. Yield: 42 videos.' },
  { time: '14:28:15', tag: 'AI', tagColor: 'text-cyan-400', text: 'Sentiment analysis pass complete for Explainer_Doc.' },
  { time: '14:30:00', tag: 'EVT', tagColor: 'text-emerald-300', text: 'Auto-scaling group active: Adding 2 nodes.' },
];

export default function FactoryPage() {
  const { orders = [], fetchOrders } = usePipelineStore();

  useEffect(() => { fetchOrders(); }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeOrders = safeOrders.filter(o => o.status !== 'published' && o.status !== 'complete' && o.status !== 'failed');

  const heroMetrics = [
    { label: 'CPU LOAD', value: '84.2%', pct: 84, color: '#06B6D4', icon: Cpu },
    { label: 'GPU UTILIZATION', value: '96.8%', pct: 96, color: '#8B5CF6', icon: Gauge },
    { label: 'DAILY YIELD', value: String(safeOrders.length * 12 || 0), pct: 0, color: '#44e3a1', icon: Factory },
  ];

  const pipelines = activeOrders.length > 0 ? activeOrders.slice(0, 3) : [
    { id: 'demo-1', title: 'Viral_Shorts_Gen_04', status: 'rendering', progress: 80, topic: '' },
    { id: 'demo-2', title: 'Explainer_Doc_Global', status: 'script_generation', progress: 30, topic: '' },
    { id: 'demo-3', title: 'AI_Avatar_Training_v4', status: 'uploading', progress: 95, topic: '' },
  ];

  const getCircleProps = (progress: number) => {
    const r = 32;
    const c = 2 * Math.PI * r;
    return { dasharray: c, dashoffset: c - (c * progress / 100) };
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 space-y-8">
      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {heroMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-6 relative overflow-hidden"
            style={glass}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <m.icon size={48} style={{ color: m.color }} />
            </div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{m.label}</h4>
            <div className="text-4xl font-['Space_Grotesk'] font-bold" style={{ color: m.color, textShadow: `0 0 12px ${m.color}60` }}>
              {m.value}
            </div>
            {m.pct > 0 && (
              <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${m.pct}%`,
                    backgroundColor: m.color,
                    boxShadow: `0 0 15px ${m.color}80`,
                  }}
                />
              </div>
            )}
            {m.pct === 0 && <p className="text-xs mt-2" style={{ color: m.color }}>+12% from baseline</p>}
          </motion.div>
        ))}

        {/* Spin Up Pipeline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl flex flex-col justify-center items-center gap-4 cursor-pointer group relative overflow-hidden"
          style={{ ...glass, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0.3))' }}
        >
          <Rocket size={48} className="text-violet-400 group-hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.6))' }} />
          <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">SPIN UP PIPELINE</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Pipelines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-emerald-400 tracking-tight">Active Pipelines</h2>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
              Real-time Stream
            </span>
          </div>

          <div className="space-y-4">
            {pipelines.map((pipeline: any, i: number) => {
              const pct = pipeline.progress || 0;
              const { dasharray, dashoffset } = getCircleProps(pct);
              const pipeColor = pct >= 90 ? '#06B6D4' : pct >= 50 ? '#44e3a1' : '#8B5CF6';
              const statusLabel = pipeline.status === 'rendering' ? 'Rendering' : pipeline.status === 'script_generation' ? 'Audio Sync' : pipeline.status === 'uploading' ? 'Finalizing' : 'Processing';

              return (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl p-6 flex items-center gap-6 group hover:bg-zinc-900/40 transition-all"
                  style={glass}
                >
                  <div className="relative flex-shrink-0">
                    <svg className="w-20 h-20" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" r="32" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle
                        cx="40" cy="40" r="32" fill="transparent"
                        stroke={pipeColor} strokeWidth="4"
                        strokeDasharray={dasharray}
                        strokeDashoffset={dashoffset}
                        style={{ filter: `drop-shadow(0 0 5px ${pipeColor})`, transition: 'stroke-dashoffset 1s ease-in-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: pipeColor }}>{pct}%</div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">
                        {(pipeline.title || pipeline.topic || 'PIPELINE').toUpperCase().replace(/\s+/g, '_').slice(0, 25)}
                      </h3>
                      <span
                        className="text-xs px-2 py-1 rounded font-bold uppercase animate-pulse"
                        style={{ background: `${pipeColor}15`, color: pipeColor, border: `1px solid ${pipeColor}30` }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 font-mono mb-3">Target: TikTok / Reels • Resolution: 1080x1920 • Engine: vMill-X2</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                        <Database size={12} /> STORAGE: {(pct * 0.05).toFixed(1)}GB
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-violet-400">
                        <Clock size={12} /> EST: {String(Math.max(0, 15 - Math.floor(pct / 7))).padStart(2, '0')}:{String(45 - pct % 60).padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  <button className="text-zinc-600 hover:text-red-400 transition-colors">
                    <StopCircle size={24} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Factory Log */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-emerald-400 tracking-tight">Factory Log</h2>
            <Filter size={14} className="text-zinc-500 hover:text-emerald-400 cursor-pointer transition-colors" />
          </div>

          <div className="rounded-xl flex flex-col overflow-hidden" style={{ ...glass, height: '600px', borderColor: 'rgba(12,198,135,0.1)' }}>
            <div className="p-3 border-b flex gap-2" style={{ borderColor: 'rgba(12,198,135,0.1)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {LOG_ENTRIES.map((entry, i) => (
                <div key={i} className="flex gap-3 hover:bg-emerald-500/5 p-1 rounded transition-colors">
                  <span className="text-zinc-600 shrink-0">{entry.time}</span>
                  <span className={entry.tagColor}>[{entry.tag}]</span>
                  <span className="text-zinc-300">{entry.text}</span>
                </div>
              ))}
              <div className="flex gap-3 text-zinc-600">
                <span className="shrink-0">14:31:22</span>
                <span>... system waiting for input ...</span>
              </div>
              <div className="flex gap-3 animate-pulse">
                <span className="text-zinc-600 shrink-0">14:32:04</span>
                <span className="text-emerald-300">[LIVE]</span>
                <span className="text-emerald-200">Processing metadata for viral_reels_pack_9.</span>
              </div>
            </div>

            <div className="p-3 bg-black/20 flex items-center gap-3" style={{ borderTop: '1px solid rgba(12,198,135,0.1)' }}>
              <Terminal size={14} className="text-emerald-400 animate-pulse" />
              <input className="bg-transparent border-none p-0 text-xs text-emerald-400 placeholder:text-emerald-900/40 focus:ring-0 focus:outline-none w-full" placeholder="Send system command..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
