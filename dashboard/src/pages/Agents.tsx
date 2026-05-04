import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, TrendingUp, DollarSign, Shield, MessageSquare, 
  Zap, Radar, Eye, Upload, Activity, Clock, 
  Lightbulb, AlertTriangle, RefreshCw, CheckCircle2, Sparkles
} from 'lucide-react';

const AGENT_CONFIG = {
  COO: {
    name: 'COO',
    title: 'Chief Operating Officer',
    icon: TrendingUp,
    color: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    description: 'Operasjoner, effektivitet og produksjons-KPIer',
    schedule: 'Daglig kl 02:00',
  },
  CFO: {
    name: 'CFO',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    color: 'text-green-400',
    glow: 'shadow-green-500/20',
    description: 'Økonomi, ROI og kostnadsanalyse',
    schedule: 'Daglig kl 02:00',
  },
  Marketing: {
    name: 'Marketing',
    title: 'Marketing Director',
    icon: Eye,
    color: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    description: 'Trender, content-strategi og hashtags',
    schedule: 'Hver 4. time',
  },
  Watchdog: {
    name: 'Watchdog',
    title: 'Production Monitor',
    icon: Radar,
    color: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    description: 'Overvåker og starter feilede videoer på nytt',
    schedule: 'Hvert 10. min',
  },
  SocialResponse: {
    name: 'Social',
    title: 'Engagement Agent',
    icon: MessageSquare,
    color: 'text-neon-cyan',
    glow: 'shadow-neon-cyan/20',
    description: 'Svarer automatisk på kommentarer og DMs',
    schedule: 'Realtid',
  },
  Publisher: {
    name: 'Publisher',
    title: 'Auto Distribution',
    icon: Upload,
    color: 'text-rose-400',
    glow: 'shadow-rose-500/20',
    description: 'Laster opp ferdige videoer til sosiale medier',
    schedule: 'Ved ferdigstillelse',
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
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]"
          >
            <Sparkles size={14} />
            Autonomous Force
          </motion.div>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            AI Agenter
          </h1>
          <p className="text-gray-500 max-w-md">
            Dine automatiserte assistenter som jobber 24/7 for å skalere kanalen din.
          </p>
        </div>
        
        <div className="glass-morphism rounded-2xl px-6 py-4 flex items-center gap-6 border-neon-cyan/10">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">System Load</p>
            <p className="text-xl font-black text-neon-cyan font-mono">OPTIMAL</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">Aktive Agenter</p>
            <p className="text-xl font-black text-white font-mono">{enabledAgents.length} / 6</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(AGENT_CONFIG).map(([id, agent], i) => {
          const isActive = enabledAgents.includes(id);
          const Icon = agent.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={id}
              onClick={() => toggleAgent(id)}
              className={`group glass-morphism rounded-3xl p-8 cursor-pointer transition-all duration-500 relative overflow-hidden ${
                isActive ? `border-neon-cyan/30 ${agent.glow}` : 'opacity-60 grayscale'
              }`}
            >
              {/* Pulsing indicator for active agents */}
              {isActive && (
                <div className="absolute top-6 right-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
                  </span>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 transition-transform group-hover:scale-110 duration-500 ${agent.color}`}>
                  <Icon size={28} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{agent.name}</span>
                    <h3 className="text-lg font-black text-white group-hover:text-neon-cyan transition-colors italic uppercase">{agent.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                    {agent.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={12} />
                    <span>{agent.schedule}</span>
                  </div>
                  <div className={`font-bold ${isActive ? 'text-neon-cyan' : 'text-gray-700'}`}>
                    {isActive ? 'RUNNING' : 'STANDBY'}
                  </div>
                </div>
              </div>

              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Control Panel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
        <div className="glass-morphism rounded-3xl p-8 border-neon-amber/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-neon-amber/10 rounded-xl text-neon-amber">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">Kritisk Systemlogg</h2>
              <p className="text-xs text-gray-600 font-mono">Siste 24 timer</p>
            </div>
          </div>
          <div className="space-y-4 font-mono text-[11px]">
            <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-white/5 text-gray-400">
              <span className="text-neon-cyan">[08:42:11]</span>
              <span>Publisher: Video #V-1777-B laset opp til TikTok (Suksess)</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-white/5 text-gray-400">
              <span className="text-neon-cyan">[04:15:02]</span>
              <span>COO: Rapport generert og sendt til administrator</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10 text-red-400/80">
              <span className="text-red-500">[02:30:44]</span>
              <span>Watchdog: Rendering feilet for #V-1882. Automatisk restart utført.</span>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Bot size={200} />
          </div>
          <div className="space-y-6 relative z-10">
            <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">Global AI Status</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase">
                  <span className="text-gray-500">Autonomitets-nivå</span>
                  <span className="text-neon-cyan">94%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-neon-cyan shadow-[0_0_10px_#00f5ff]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono uppercase">
                  <span className="text-gray-500">ROI-Effektivitet</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
            </div>
            <button className="w-full py-4 glass-morphism border-neon-cyan/20 text-neon-cyan font-black tracking-[0.2em] rounded-xl hover:bg-neon-cyan/10 transition-all uppercase text-sm">
              Oppdater Alle Kjerner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
