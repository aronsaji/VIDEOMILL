import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, TrendingUp, DollarSign, Shield, MessageSquare, 
  Zap, Radar, Eye, Upload, Activity, Clock, 
  Sparkles, Terminal, Cpu, Database, Network, RefreshCw,
  Target, Globe, ShieldCheck, Layers, Boxes
} from 'lucide-react';

const AGENT_CONFIG = {
  COO: {
    name: 'COO',
    title: 'Chief Operating Officer',
    icon: TrendingUp,
    color: 'text-brand-2',
    description: 'Operational efficiency, production KPIs, and resource allocation.',
    schedule: 'Daily @ 02:00',
  },
  CFO: {
    name: 'CFO',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    color: 'text-brand-2',
    description: 'Financial oversight, ROI optimization, and budget synthesis.',
    schedule: 'Daily @ 02:00',
  },
  Marketing: {
    name: 'Marketing',
    title: 'Marketing Director',
    icon: Eye,
    color: 'text-brand-2',
    description: 'Trend analysis, multi-platform strategy, and metadata engineering.',
    schedule: 'Every 4 Hours',
  },
  Watchdog: {
    name: 'Watchdog',
    title: 'Production Monitor',
    icon: Radar,
    color: 'text-brand-2',
    description: 'Real-time monitoring and automated failure recovery protocols.',
    schedule: 'Every 10 Minutes',
  },
  SocialResponse: {
    name: 'Social',
    title: 'Engagement Agent',
    icon: MessageSquare,
    color: 'text-brand-2',
    description: 'Autonomous neural response to community engagement signals.',
    schedule: 'Real-time',
  },
  Publisher: {
    name: 'Publisher',
    title: 'Auto Distribution',
    icon: Upload,
    color: 'text-white',
    description: 'Automated multi-channel deployment upon asset finalization.',
    schedule: 'Event-driven',
  },
};

export default function Agents() {
  const [enabledAgents, setEnabledAgents] = useState<string[]>(['COO', 'Watchdog', 'Publisher', 'SocialResponse']);

  const toggleAgent = (id: string) => {
    setEnabledAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-16 max-w-[1600px] mx-auto pb-24 px-4 lg:px-0">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-brand-2 font-mono text-[13px] font-black uppercase tracking-[0.5em]"
          >
            <Network size={16} className="animate-pulse" />
            Autonomous Command Hierarchy v2.0
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
              AI <span className="text-brand-2">Commanders</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-16 bg-brand-2/50" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[13px] italic">Strategic Neural Management Layer</p>
            </div>
          </div>
        </div>
        
        <div className="card-standard !px-12 !py-8 flex items-center gap-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-2/[0.02] blur-3xl group-hover:bg-brand-2/[0.05] transition-all" />
          <div className="relative z-10 space-y-2">
            <p className="text-[11px] text-gray-500 uppercase font-black font-mono tracking-[0.3em]">Synapse Load</p>
            <p className="text-4xl font-black text-brand-2 font-mono italic tracking-tighter uppercase">Optimal</p>
          </div>
          <div className="w-[1px] h-16 bg-white/10 relative z-10" />
          <div className="relative z-10 space-y-2 text-right">
            <p className="text-[11px] text-gray-500 uppercase font-black font-mono tracking-[0.3em]">Active Nodes</p>
            <p className="text-4xl font-black text-white font-mono italic tracking-tighter">{enabledAgents.length}<span className="text-gray-800 text-lg">/6</span></p>
          </div>
        </div>
      </div>

      {/* Agents Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {Object.entries(AGENT_CONFIG).map(([id, agent], i) => {
          const isActive = enabledAgents.includes(id);
          const Icon = agent.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={id}
              onClick={() => toggleAgent(id)}
              className={`group card-standard !p-12 cursor-pointer transition-all duration-700 relative overflow-hidden flex flex-col ${
                isActive 
                  ? `!border-brand-2/50 bg-brand-2/[0.03]` 
                  : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:border-white/20'
              }`}
            >
              {/* Dynamic Status Tag */}
              <div className="absolute top-12 right-12 flex items-center gap-3 px-5 py-2 bg-black/40 rounded-full border border-white/5">
                <span className={`text-[11px] font-black font-mono uppercase tracking-[0.2em] ${isActive ? 'text-brand-2' : 'text-gray-700'}`}>
                   {isActive ? 'Live' : 'Off'}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-brand-2' : 'bg-gray-800'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-brand-2' : 'bg-gray-900'}`}></span>
                </span>
              </div>

              <div className="space-y-10 relative z-10 flex-1">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-700 group-hover:rotate-[360deg] ${agent.color}`}>
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black font-mono text-gray-600 uppercase tracking-[0.4em] italic">{agent.name}_SUBSYSTEM</span>
                    <h3 className="text-2xl font-black text-white group-hover:text-brand-2 transition-colors italic uppercase tracking-tighter leading-none">{agent.title}</h3>
                  </div>
                  <p className="text-[14px] text-gray-500 leading-relaxed font-bold italic uppercase tracking-tight opacity-80">
                    "{agent.description}"
                  </p>
                </div>

                <div className="pt-10 mt-auto border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] font-black font-mono text-gray-700 uppercase tracking-widest italic group-hover:text-gray-400">
                    <Clock size={14} className="text-brand-2" />
                    <span>CYCLE: {agent.schedule}</span>
                  </div>
                  <div className={`text-[11px] font-black font-mono tracking-[0.3em] ${isActive ? 'text-brand-2' : 'text-gray-900'}`}>
                    {isActive ? 'CMD_READY' : 'WAIT_SIG'}
                  </div>
                </div>
              </div>

              {/* Advanced Interactive Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-2/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-2/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            </motion.div>
          );
        })}
      </div>

      {/* Terminal & Analytics Split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pt-8">
        {/* Modernized Kernel Log */}
        <div className="card-standard !p-12 space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-2/20" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-brand-2/10 rounded-3xl text-brand-2 border border-brand-2/20 shadow-lg shadow-brand-2/5">
                <Terminal size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Command <span className="text-brand-2">Stream</span></h2>
                <p className="text-[11px] text-gray-600 font-mono font-black uppercase tracking-[0.4em] italic">Real-time Node Telemetry</p>
              </div>
            </div>
            <button className="p-4 bg-white/5 text-gray-500 rounded-2xl hover:bg-brand-2 hover:text-white transition-all border border-white/5 shadow-xl">
              <RefreshCw size={22} className="hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
          
          <div className="space-y-5 font-mono text-[11px] relative z-10">
            {[
              { time: '08:42:11', node: 'PUBLISHER', msg: 'Video #V-1777-B uploaded to TikTok API - Status: 200 OK', color: 'text-brand-2' },
              { time: '04:15:02', node: 'COO', msg: 'Weekly performance synthesis finalized and stored in Vault.', color: 'text-brand-2' },
              { time: '02:30:44', node: 'WATCHDOG', msg: 'Rendering anomaly detected in #V-1882. Re-queuing job...', color: 'text-brand-2' },
              { time: '01:12:30', node: 'SOCIAL', msg: 'Processed 14 engagement signals via YouTube Webhook.', color: 'text-brand-2' },
              { time: '00:05:12', node: 'SYSTEM', msg: 'Global Command Node re-synchronized successfully.', color: 'text-brand-2' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-6 p-6 bg-black/40 rounded-3xl border border-white/5 text-gray-600 hover:text-white hover:bg-brand-2/5 transition-all group/item cursor-default">
                <span className={`${log.color} font-black group-hover/item:animate-pulse`}>[{log.time}]</span>
                <span className="text-gray-400 font-black uppercase tracking-widest">{log.node}</span>
                <span className="italic font-bold tracking-tight opacity-70 group-hover/item:opacity-100 uppercase text-[13px]">"{log.msg}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Command Panel */}
        <div className="card-standard !p-12 relative overflow-hidden group border border-white/5 flex flex-col justify-between">
          <div className="absolute inset-0 bg-brand-2/[0.01] pointer-events-none" />
          <div className="absolute -top-20 -right-20 p-24 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Cpu size={400} className="text-brand-2" />
          </div>

          <div className="space-y-12 relative z-10">
            <div className="space-y-4 text-center xl:text-left">
              <div className="flex items-center justify-center xl:justify-start gap-4 text-brand-2 font-mono text-[13px] font-black uppercase tracking-[0.5em] italic">
                <ShieldCheck size={20} />
                Protocol Integrity Verified
              </div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Global <span className="text-brand-2">Status</span></h2>
            </div>
            
            <div className="space-y-10">
              {/* Segment Meters */}
              {[
                { label: 'Autonomous Load', value: '92%' },
                { label: 'Neural Efficiency', value: '100%' },
              ].map((gauge, i) => (
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic opacity-70">{gauge.label}</span>
                    <span className="text-xs font-mono font-bold text-brand-2">{gauge.value}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, j) => (
                      <div 
                        key={j} 
                        className={`segment-meter-block ${j < (i === 0 ? 10 : 12) ? 'bg-brand-2 shadow-[0_0_8px_rgba(188,19,254,0.5)]' : 'bg-white/5'}`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="card-standard !p-8 !rounded-[32px] hover:!border-brand-2/50 transition-all group/stat">
                    <p className="text-[11px] font-black font-mono text-gray-600 uppercase tracking-[0.3em] mb-3 italic">Total Sync Cycles</p>
                    <div className="flex items-end gap-3">
                       <p className="text-3xl font-black text-white italic font-mono tracking-tighter">1.2M+</p>
                       <Boxes size={20} className="text-brand-2 mb-1 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    </div>
                 </div>
                  <div className="card-standard !p-8 !rounded-[32px] hover:!border-brand-2/50 transition-all group/stat">
                    <p className="text-[11px] font-black font-mono text-gray-600 uppercase tracking-[0.3em] mb-3 italic">Human Overrides</p>
                    <div className="flex items-end gap-3">
                       <p className="text-3xl font-black text-brand-2 italic font-mono tracking-tighter">ZERO</p>
                       <Shield size={20} className="text-brand-2 mb-1 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-standard w-full py-8 text-[13px] !bg-brand-2 !shadow-brand-2/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-2/0 via-white/20 to-brand-2/0 -translate-x-full group-hover/btn:animate-shimmer" />
            <span className="relative z-10 flex items-center justify-center gap-4 italic text-white">
              Synchronize Neural Grid
              <Zap size={18} fill="currentColor" />
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
