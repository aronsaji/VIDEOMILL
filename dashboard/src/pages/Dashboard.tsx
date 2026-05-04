import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Play, ArrowUpRight, Flame, CheckCircle2, 
  Clock, AlertTriangle, Loader, RefreshCw, Smartphone, 
  Monitor, Send, Heart, Video, Sparkles, Wand2, Zap,
  Cpu, Database, Radio, Globe, Shield, Terminal, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePipelineStore } from '../store/pipelineStore';
import { useLanguage } from '../contexts/LanguageContext';
import type { Order, OrderStatus } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; glow: string; icon: any }> = {
  queued:           { label: 'BUFFERING',      color: 'text-gray-500',      glow: 'shadow-gray-500/10',     icon: Clock },
  script_generation:{ label: 'COGNITION',      color: 'text-brand-1',       glow: 'shadow-brand-1/20',      icon: Cpu },
  rendering:        { label: 'SYNTHESIS',      color: 'text-brand-1',       glow: 'shadow-brand-1/30',      icon: Zap },
  uploading:        { label: 'UPLOADING',      color: 'text-brand-1',       glow: 'shadow-brand-1/20',      icon: Send },
  published:        { label: 'DEPLOYED',       color: 'text-brand-1',       glow: 'shadow-brand-1/30',      icon: CheckCircle2 },
  failed:           { label: 'CORRUPTED',      color: 'text-red-500',       glow: 'shadow-red-500/20',      icon: AlertTriangle },
};

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders = [], trends = [], fetchInitialData, fetchOrders, isLoading } = usePipelineStore();

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => fetchOrders(), 5000);
    return () => clearInterval(interval);
  }, []);

  const activeProductions = orders.filter(o => o.status !== 'published' && o.status !== 'failed');
  const recentTrends = trends.slice(0, 4);

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-20 px-4 lg:px-0">
      {/* Tactical Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('dash.network_integrity'), value: 'OPTIMAL', icon: Shield, color: 'text-brand-1', detail: 'Encrypted_Link_1' },
          { label: t('dash.neural_activity'), value: activeProductions.length, icon: Cpu, color: 'text-brand-1', detail: t('common.active_nodes') },
          { label: t('dash.cognition_rate'), value: '98.4%', icon: Sparkles, color: 'text-brand-1', detail: t('common.stable') },
          { label: t('dash.data_velocity'), value: '4.2GB/S', icon: Database, color: 'text-brand-1', detail: 'Burst_Active' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="glass-ultra rounded-[32px] p-8 group relative overflow-hidden border border-white/5 hover:border-white/10 transition-all cursor-crosshair"
          >
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:rotate-12 ${stat.color}`}>
              <stat.icon size={80} />
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-black font-mono text-gray-500 uppercase tracking-[0.4em]">{stat.label}</p>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
              </div>
              <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${stat.color} leading-none`}>
                {stat.value}
              </h3>
              <div className="flex items-center gap-2 pt-1">
                 <div className={`w-1 h-1 rounded-full bg-current ${stat.color} animate-pulse`} />
                 <span className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">{stat.detail}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Operations Hub: Live Production Line */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                <Radio className="text-brand-1 animate-pulse" size={28} />
                Operations <span className="text-brand-1">Hub</span>
              </h2>
              <div className="flex items-center gap-3">
                 <div className="h-[1px] w-12 bg-brand-1/50" />
                 <span className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">{t('dash.live_stream')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
               <Layers size={14} className="text-brand-1" />
               <span className="text-[11px] font-black font-mono text-white uppercase tracking-widest">{activeProductions.length} {t('common.active_nodes')}</span>
            </div>
          </div>

          <div className="space-y-5">
            {activeProductions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-ultra rounded-[48px] py-32 text-center border border-dashed border-white/10"
              >
                <div className="p-8 bg-white/[0.02] rounded-full w-fit mx-auto mb-8 text-gray-700 border border-white/5 relative">
                  <div className="absolute inset-0 bg-neon-purple/5 rounded-full blur-xl" />
                  <Video size={48} className="relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">{t('dash.system_standby')}</h3>
                <p className="text-white/70 max-w-sm mx-auto text-sm font-bold leading-relaxed uppercase tracking-widest italic">The production grid is currently idle. Initialize a new synthesis cycle at the Factory node.</p>
                <button 
                  onClick={() => navigate('/factory')}
                  className="btn-standard mt-10 px-12"
                >
                  {t('dash.enter_factory')}
                </button>
              </motion.div>
            ) : (
              activeProductions.map((order, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={order.id}
                    className="card-standard !p-8 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group hover:!border-brand-1/30 transition-all"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-1 shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-brand-1 transition-colors leading-none">
                        {order.title || order.topic}
                      </h4>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400`}>
                          {order.language?.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest bg-brand-1/10 border border-brand-1/20 text-brand-1`}>
                          9:16_VERT
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-[11px] font-black font-mono text-gray-600 uppercase tracking-widest italic">
                        <Terminal size={12} className="text-brand-1" />
                        DEST: {order.platform_destinations?.join(' / ').toUpperCase() || 'TIKTOK_PRIMARY'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black font-mono text-gray-600 uppercase tracking-widest italic">
                        <Clock size={12} />
                        TS: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>

                    {/* Technical Progress Gauge */}
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between text-[11px] font-black font-mono text-gray-500 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2">
                           <div className="w-1 h-1 bg-brand-1 rounded-full animate-pulse" />
                           Synthesis Process
                        </span>
                        <span className="text-brand-1">{order.progress || 10}% Complete</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress || 10}%` }}
                          className="h-full bg-brand-1 shadow-[0_0_15px_rgba(0,245,255,0.4)]" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 min-w-[200px] justify-end w-full md:w-auto">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-[20px] bg-black/40 border border-white/5 ${STATUS_CONFIG[order.status]?.color || 'text-white'} shadow-lg group-hover:scale-105 transition-transform`}>
                      {React.createElement(STATUS_CONFIG[order.status]?.icon || Loader, { size: 16, className: order.status !== 'failed' && order.status !== 'published' ? 'animate-spin-slow' : '' })}
                      <span className="text-[11px] font-black tracking-[0.2em] uppercase italic">{STATUS_CONFIG[order.status]?.label || order.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Grid: Trend Radar & AI Expansion */}
        <div className="lg:col-span-4 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                  <Flame className="text-brand-1" size={24} />
                  Trend <span className="text-brand-1">Radar</span>
                </h2>
                <div className="h-[1px] w-8 bg-brand-1/50" />
              </div>
              <button 
                onClick={() => navigate('/trends')} 
                className="text-[13px] font-black text-brand-1 uppercase tracking-[0.3em] hover:text-white transition-colors border-b border-brand-1/20 pb-0.5"
              >
                Query_All
              </button>
            </div>

            <div className="space-y-4">
              {recentTrends.map((trend, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={trend.id}
                  onClick={() => navigate('/factory', { state: { trend } })}
                  className="glass-ultra rounded-[28px] p-6 border border-white/5 hover:border-brand-1/30 cursor-pointer group transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Activity size={40} className="text-brand-1" />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-brand-1 rounded-full animate-pulse" />
                         <span className="text-[11px] font-black font-mono text-brand-1 uppercase tracking-widest italic">
                            {trend.viral_score}% Viral_Yield
                         </span>
                      </div>
                      <span className="text-[11px] font-black font-mono text-gray-600 uppercase tracking-widest italic">{trend.platform}</span>
                    </div>
                    <h4 className="text-[13px] font-black text-white group-hover:text-brand-1 transition-colors leading-tight uppercase tracking-tight italic">
                      {trend.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5 mt-2">
                      {trend.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[11px] font-mono font-bold text-gray-700 uppercase">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Neural Expansion Module */}
        <div className="card-standard bg-gradient-to-br from-brand-1/10 to-transparent relative overflow-hidden group">
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-1 font-black text-[13px] uppercase tracking-[0.4em]">
                   <Zap size={14} /> Neural Agent X
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">Scale Your <span className="text-brand-1">Influence</span></h3>
                <p className="text-[14px] text-gray-500 leading-relaxed font-medium italic">Deploy autonomous series nodes to dominate the content grid.</p>
              </div>
              <button 
                onClick={() => navigate('/auto-series')}
                className="btn-standard w-full !bg-brand-1 !shadow-brand-1/30"
              >
                Launch Auto-Series Node
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
