import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Play, CheckCircle2, Clock, AlertTriangle,
  Loader, RefreshCw, Send, Zap, Cpu, Database, Terminal,
  Eye, FileText, Mic, Film, Upload, Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePipelineStore } from '../store/pipelineStore';
import { useLanguage } from '../contexts/LanguageContext';
import type { Order } from '../types';

const PIPELINE_STEPS = [
  { id: 1, name: 'Webhook', icon: Zap },
  { id: 2, name: 'Script (Groq)', icon: Terminal },
  { id: 3, name: 'Edge-TTS', icon: Mic },
  { id: 4, name: 'Vision Layer', icon: Eye },
  { id: 5, name: 'Studio Edit', icon: Film },
  { id: 6, name: 'FFmpeg Render', icon: Activity },
  { id: 7, name: 'Supabase Put', icon: Upload },
  { id: 8, name: 'Update DB', icon: Database },
];

const STATUS_TO_STEP: Record<string, number> = {
  queued: 0, script_generation: 2, rendering: 4, uploading: 6, published: 8, complete: 8, failed: -1,
};

const glass = {
  background: 'rgba(15, 15, 15, 0.6)',
  backdropFilter: 'blur(20px) saturate(150%)',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.03)',
};

const LOG_LINES = [
  { time: '14:22:01', tag: 'SYS', tagColor: 'text-cyan-400', text: 'Executing n8n-core::Webhook_Listener' },
  { time: '14:22:05', tag: 'AI', tagColor: 'text-violet-400', text: 'Scripting engine (Groq) payload received.' },
  { time: '14:22:08', tag: 'TTS', tagColor: 'text-cyan-400', text: 'Edge-TTS calling voice: "en-US-GuyNeural"' },
  { time: '14:22:15', tag: 'FFM', tagColor: 'text-zinc-500', text: 'ffmpeg -y -i input_01.mp4 -vf "scale=1920:1080"' },
  { time: '14:22:18', tag: 'FFM', tagColor: 'text-cyan-400', text: '[FFmpeg] frame= 452 fps= 24 q=28.0 size= 4224kB' },
  { time: '14:22:22', tag: 'VIS', tagColor: 'text-violet-400', text: 'Vision Layer: Analyzing metadata frames...' },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders = [], fetchInitialData, fetchOrders, isLoading } = usePipelineStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const activeOrders = safeOrders.filter(o => o.status !== 'published' && o.status !== 'complete');
  const selected = selectedOrder || activeOrders[0] || safeOrders[0];
  const currentStep = selected ? (STATUS_TO_STEP[selected.status] ?? 0) : 0;

  const getStepState = (stepIndex: number) => {
    if (!selected || selected.status === 'failed') return 'failed';
    const done = STATUS_TO_STEP[selected.status] ?? 0;
    if (stepIndex < done) return 'done';
    if (stepIndex === done) return 'active';
    return 'queued';
  };

  const gpuBars = [80, 60, 95, 40, 70, 50, 85];

  return (
    <div className="max-w-[1600px] mx-auto pb-20">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Production Queue */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-xl p-6" style={glass}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-['Space_Grotesk'] text-2xl font-semibold text-violet-400">Production Queue</h3>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{activeOrders.length} Active</span>
            </div>
            <div className="space-y-3">
              {safeOrders.slice(0, 5).map((order) => {
                const isSelected = selected?.id === order.id;
                const isActive = order.status === 'rendering' || order.status === 'script_generation';
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-violet-500/10 border border-violet-500/50'
                        : 'bg-zinc-950/60 border border-violet-500/10 hover:border-violet-500/40 opacity-80 hover:opacity-100'
                    }`}
                    style={{ boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.1)' : 'none' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {(order.title || order.topic || 'UNTITLED').toUpperCase().replace(/\s+/g, '_').slice(0, 22)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black ${
                        isActive ? 'bg-cyan-400/20 text-cyan-400' : order.status === 'failed' ? 'bg-red-500/20 text-red-400' : order.status === 'published' || order.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
                      }`}>
                        {order.status === 'rendering' ? 'Rendering' : order.status === 'script_generation' ? 'Processing' : order.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${order.progress || 0}%`,
                            background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
                            boxShadow: '0 0 10px rgba(6,182,212,0.5)',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-mono ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{order.progress || 0}%</span>
                    </div>
                  </div>
                );
              })}
              {safeOrders.length === 0 && (
                <div className="text-center py-12 text-zinc-600 text-xs uppercase tracking-widest">No active pipelines</div>
              )}
            </div>
          </div>

          {/* Live System Feed */}
          <div className="rounded-xl flex-1 flex flex-col overflow-hidden" style={glass}>
            <div className="p-4 border-b border-violet-500/20 bg-zinc-950/40 flex justify-between items-center">
              <span className="text-xs font-['Space_Grotesk'] font-bold text-zinc-300 uppercase tracking-widest">Live System Feed</span>
              <Activity size={14} className="text-cyan-400 animate-pulse" />
            </div>
            <div className="p-4 font-mono text-[10px] text-zinc-500 overflow-y-auto space-y-2 max-h-[400px]">
              {LOG_LINES.map((log, i) => (
                <p key={i}><span className={log.tagColor}>[{log.time}]</span> {log.text}</p>
              ))}
              <p className="text-zinc-400 animate-pulse">_ system awaiting next frame packet...</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline Detail */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Selected Item Header */}
          <div className="rounded-xl p-8 relative overflow-hidden" style={glass}>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Server size={120} className="text-violet-400" />
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-cyan-400 text-xs font-black tracking-widest uppercase">Currently Inspecting</span>
              <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tighter">
                {selected ? (selected.title || selected.topic || 'NO_SELECTION').toUpperCase().replace(/\s+/g, '_').slice(0, 28) : 'AWAITING_INPUT'}
              </h2>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={14} />
                  <span className="text-sm font-medium">Elapsed: 00:{String(Math.floor((selected?.progress || 0) / 2)).padStart(2, '0')}:12</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Database size={14} />
                  <span className="text-sm font-medium">Size: {((selected?.progress || 0) * 4.2).toFixed(1)} MB</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Zap size={14} />
                  <span className="text-sm font-medium">Source: n8n-Webhook-Prod</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8-Step Pipeline Grid */}
          <div className="grid grid-cols-4 gap-4">
            {PIPELINE_STEPS.map((step, i) => {
              const state = getStepState(i);
              const StepIcon = step.icon;
              const circumference = 2 * Math.PI * 45;
              let offset = circumference;
              let strokeColor = 'rgba(255,255,255,0.05)';
              let borderColor = 'border-l-zinc-700';
              let opacity = 'opacity-40';
              let stepColor = 'text-zinc-600';
              let nameColor = 'text-zinc-400';
              let iconColor = 'text-zinc-500';
              let bgExtra = '';

              if (state === 'done') {
                offset = 0;
                strokeColor = '#8B5CF6';
                borderColor = 'border-l-violet-500';
                opacity = '';
                stepColor = 'text-zinc-500';
                nameColor = 'text-white';
                iconColor = 'text-violet-400';
              } else if (state === 'active') {
                offset = circumference * 0.25;
                strokeColor = '#06B6D4';
                borderColor = 'border-l-cyan-400';
                opacity = '';
                stepColor = 'text-cyan-400';
                nameColor = 'text-white';
                iconColor = 'text-cyan-400';
                bgExtra = 'bg-cyan-500/5';
              }

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl p-6 border-l-4 ${borderColor} flex flex-col items-center gap-4 ${opacity} ${bgExtra}`}
                  style={glass}
                >
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(139,92,246,0.1)" strokeWidth="8" />
                      {state !== 'queued' && (
                        <circle
                          cx="50" cy="50" r="45" fill="transparent"
                          stroke={strokeColor} strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {state === 'done' ? (
                        <CheckCircle2 size={20} className={iconColor} />
                      ) : state === 'active' ? (
                        <StepIcon size={20} className={`${iconColor} animate-pulse`} />
                      ) : (
                        <StepIcon size={20} className={iconColor} />
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black uppercase tracking-tighter ${stepColor}`}>Step {String(step.id).padStart(2, '0')}</p>
                    <h4 className={`text-sm font-bold mt-1 ${nameColor}`}>{step.name}</h4>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* System Analytics Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl p-6" style={glass}>
              <h4 className="font-['Space_Grotesk'] font-bold text-zinc-300 mb-4 uppercase tracking-widest text-xs">GPU Load Distribution</h4>
              <div className="flex items-end gap-2 h-32">
                {gpuBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 2 ? 'rgba(6,182,212,0.2)' : 'rgba(139,92,246,0.2)',
                      borderTop: `1px solid ${i === 2 ? 'rgba(6,182,212,0.5)' : 'rgba(139,92,246,0.5)'}`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500">
                <span>08:00</span><span>10:00</span><span>12:00</span><span>LIVE</span>
              </div>
            </div>

            <div className="rounded-xl p-6 flex flex-col justify-between" style={glass}>
              <div>
                <h4 className="font-['Space_Grotesk'] font-bold text-zinc-300 mb-4 uppercase tracking-widest text-xs">Environment Meta</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Edge-TTS Server</span>
                    <span className="text-cyan-400 font-mono">STABLE (14ms)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Supabase Bucket</span>
                    <span className="text-cyan-400 font-mono">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Groq API Status</span>
                    <span className="text-cyan-400 font-mono">402 tokens/sec</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-violet-500/20 flex gap-4">
                <button className="flex-1 bg-zinc-900 text-zinc-300 py-2 rounded text-xs font-bold hover:bg-zinc-800 border border-zinc-800 transition-colors">Abort Pipeline</button>
                <button className="flex-1 bg-violet-600/20 text-violet-300 py-2 rounded text-xs font-bold hover:bg-violet-600/30 border border-violet-500/30 transition-colors">Force Re-Render</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
