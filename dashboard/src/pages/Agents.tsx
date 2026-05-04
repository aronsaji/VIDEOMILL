import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, TrendingUp, DollarSign, Shield, MessageSquare, 
  Zap, Radar, Eye, Upload, Activity, Clock, 
  Lightbulb, AlertTriangle, RefreshCw, CheckCircle2 
} from 'lucide-react';

const AGENT_CONFIG = {
  COO: {
    name: 'COO',
    title: 'Chief Operating Officer',
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    description: 'Operasjoner, effektivitet og produksjons-KPIer',
    schedule: 'Daglig kl 02:00',
  },
  CFO: {
    name: 'CFO',
    title: 'Chief Financial Officer',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    description: 'Økonomi, ROI og kostnadsanalyse',
    schedule: 'Daglig kl 02:00',
  },
  Marketing: {
    name: 'Marketing',
    title: 'Marketing Director',
    icon: Eye,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    description: 'Trender, content-strategi og hashtags',
    schedule: 'Hver 4. time',
  },
  Watchdog: {
    name: 'Watchdog',
    title: 'Production Monitor',
    icon: Radar,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    description: 'Overvåker og starter feilede videoer på nytt',
    schedule: 'Hvert 10. min',
  },
  SocialResponse: {
    name: 'Social',
    title: 'Engagement Agent',
    icon: MessageSquare,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    description: 'Svarer automatisk på kommentarer og DMs',
    schedule: 'Realtid',
  },
  Publisher: {
    name: 'Publisher',
    title: 'Auto Distribution',
    icon: Upload,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="text-neon-cyan" size={28} />
            AI Agenter
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Dine automatiserte assistenter som jobber 24/7 for å skalere kanalen din.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface/50 border border-border rounded-xl px-4 py-2 text-right">
            <p className="text-[10px] text-gray-500 uppercase font-mono">Aktive agenter</p>
            <p className="text-xl font-bold text-neon-cyan font-mono">{enabledAgents.length} / {Object.keys(AGENT_CONFIG).length}</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(AGENT_CONFIG).map(([id, config]) => {
          const isEnabled = enabledAgents.includes(id);
          const Icon = config.icon;
          return (
            <motion.div
              key={id}
              whileHover={{ y: -5 }}
              className={`relative bg-surface/50 border ${isEnabled ? config.border : 'border-border'} rounded-2xl p-6 transition-all duration-300 overflow-hidden group`}
            >
              {/* Subtle background gradient for active agents */}
              {isEnabled && (
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-20 pointer-events-none`} />
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${config.bg} border ${config.border}`}>
                    <Icon className={config.color} size={24} />
                  </div>
                  <button
                    onClick={() => toggleAgent(id)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      isEnabled ? 'bg-neon-cyan' : 'bg-gray-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                      isEnabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white">{config.name}</h3>
                <p className="text-xs text-gray-500 font-mono mb-3">{config.title}</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {config.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                    <Clock size={12} />
                    {config.schedule}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    isEnabled ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    <Activity size={10} className={isEnabled ? 'animate-pulse' : ''} />
                    {isEnabled ? 'Live' : 'Pauset'}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity / Reports */}
      <div className="bg-surface/30 border border-border rounded-2xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
          <Activity className="text-neon-cyan" size={20} />
          Siste agent-aktivitet
        </h2>

        <div className="space-y-4">
          {[
            { agent: 'Watchdog', action: 'Gjenopprettet video VM-8291 etter rendering-feil.', time: '12 min siden', status: 'success' },
            { agent: 'Publisher', action: 'Video "AI Overtaking Jobs" publisert på TikTok og YouTube.', time: '45 min siden', status: 'success' },
            { agent: 'COO', action: 'Daglig rapport generert: 12% økning i visninger.', time: '3 timer siden', status: 'info' },
            { agent: 'Social', action: 'Svart på 14 nye kommentarer automatisk.', time: '5 timer siden', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-border/50 rounded-xl hover:border-neon-cyan/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{log.agent}</span>
                    <span className="text-[10px] text-gray-600 font-mono">— {log.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{log.action}</p>
                </div>
              </div>
              <button className="text-xs text-gray-500 hover:text-white transition-colors">Detaljer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
