import { usePipelineStore } from '../store/pipelineStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, ArrowUpRight, Flame, CheckCircle2, Clock, AlertTriangle, Loader, RefreshCw, Smartphone, Monitor, Send, Heart, Video, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '../types';
import React, { useState, useEffect } from 'react';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  queued:           { label: 'Køet',             color: 'text-gray-400',      bg: 'bg-gray-400/10 border-gray-400/20',      icon: Clock },
  script_generation:{ label: 'Skriver Manus',     color: 'text-blue-400',      bg: 'bg-blue-400/10 border-blue-400/20',      icon: Loader },
  rendering:        { label: 'Rendrer Video',     color: 'text-neon-cyan',     bg: 'bg-neon-cyan/10 border-neon-cyan/20',    icon: Loader },
  uploading:        { label: 'Laster opp',       color: 'text-purple-400',    bg: 'bg-purple-400/10 border-purple-400/20',  icon: Loader },
  published:        { label: 'Publisert',        color: 'text-green-400',     bg: 'bg-green-400/10 border-green-400/20',    icon: CheckCircle2 },
  analyzing:        { label: 'Analyserer',       color: 'text-neon-amber',    bg: 'bg-neon-amber/10 border-neon-amber/20',  icon: Loader },
  optimizing:       { label: 'Optimaliserer',    color: 'text-pink-400',      bg: 'bg-pink-400/10 border-pink-400/20',      icon: Loader },
  failed:           { label: 'Feilet',           color: 'text-red-400',       bg: 'bg-red-400/10 border-red-400/20',        icon: AlertTriangle },
  needs_attention:  { label: 'Trenger hjelp',    color: 'text-neon-amber',    bg: 'bg-neon-amber/10 border-neon-amber/20',  icon: AlertTriangle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] || { 
    label: status, 
    color: 'text-gray-400', 
    bg: 'bg-gray-400/10 border-gray-400/20', 
    icon: Clock 
  };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded border ${cfg.color} ${cfg.bg}`}>
      <Icon size={10} className={!['queued', 'published', 'failed', 'needs_attention'].includes(status) ? 'animate-spin' : ''} />
      {cfg.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    orders = [], 
    trends = [], 
    fetchInitialData, 
    fetchOrders,
    error: storeError 
  } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, [fetchInitialData, fetchOrders]);

  const activeOrders = Array.isArray(orders) 
    ? orders.filter(o => ['queued', 'script_generation', 'rendering', 'uploading'].includes(o.status))
    : [];

  const handleProduceTrend = (trend: any) => {
    navigate(`/factory?topic=${encodeURIComponent(trend.title || trend.topic)}`);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Command Center</h1>
          <p className="text-gray-500 mt-1">Full kontroll over VideoMill produksjonslinje.</p>
        </div>
        <button 
          onClick={() => navigate('/factory')}
          className="flex items-center gap-3 px-8 py-4 bg-neon-cyan text-black rounded-2xl font-black shadow-[0_0_30px_rgba(0,245,255,0.2)] hover:scale-105 transition-all group"
        >
          <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
          START NY PRODUKSJON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trend Radar */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-neon-cyan" />
              Trend Radar
            </h2>
            <div className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-[10px] font-mono text-neon-cyan">
              LIVE UPDATES
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {trends.slice(0, 6).map((trend, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={trend.id || i}
                className="group bg-surface/40 border border-white/5 rounded-2xl p-5 hover:border-neon-cyan/30 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => handleProduceTrend(trend)}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neon-cyan bg-neon-cyan/5 px-2 py-0.5 rounded border border-neon-cyan/10">
                        {trend.category || 'TRENDING'}
                      </span>
                      {trend.viral_score > 80 && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-neon-amber">
                          <Flame size={12} fill="currentColor" />
                          VIRAL POTENTIAL
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {trend.title || trend.topic}
                    </h3>
                  </div>
                  <button className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-neon-cyan hover:text-black">
                    <Wand2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Production */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="text-neon-amber" />
            Live Fabrikk-linje
          </h2>

          <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 min-h-[400px] backdrop-blur-md relative overflow-hidden">
            <AnimatePresence mode="popLayout">
              {activeOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-700">
                    <Clock size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold">Venter på nye ordre...</p>
                    <p className="text-xs text-gray-600">Start fabrikken for å se magien skje.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={order.id}
                      className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white line-clamp-1">{order.title || order.topic}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-600">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ 
                            width: order.status === 'rendering' ? '60%' : 
                                   order.status === 'uploading' ? '90%' : '20%' 
                          }}
                          className="h-full bg-neon-cyan shadow-[0_0_10px_#00f5ff]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            
            {/* Background Decoration */}
            <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none">
              <RefreshCw size={120} className="animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>

      {storeError && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/50 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 text-red-200 shadow-2xl z-50">
          <AlertTriangle size={18} />
          <span className="text-sm font-bold">Tilkoblingsfeil: Kunne ikke hente live-data</span>
        </div>
      )}
    </div>
  );
}
