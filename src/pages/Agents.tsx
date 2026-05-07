import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Search, 
  Database,
  RefreshCw,
  Activity,
  Terminal,
  Circle
} from 'lucide-react';
import { Agent } from '../types';
import { cn } from '../lib/utils';

const AGENTS: Agent[] = [
  { id: '1', name: 'ATLAS', role: 'Data Strategist', status: 'ACTIVE', function: 'Trend Detection & Keyword Extraction' },
  { id: '2', name: 'KRONOS', role: 'Time Manager', status: 'IDLE', function: 'Scheduling & Production Pipeline' },
  { id: '3', name: 'NOVA', role: 'Creative Director', status: 'SCANNING', function: 'Visual Asset Synthesis' },
  { id: '4', name: 'PULSE', role: 'Quality Control', status: 'ACTIVE', function: 'Rhythm & Sync Analysis' },
];

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const statusConfig = {
    ACTIVE: { color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    IDLE: { color: 'opacity-50', bg: 'bg-white/5' },
    SCANNING: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ERROR: { color: 'text-red-400', bg: 'bg-red-500/10' },
  };

  const config = statusConfig[agent.status] || statusConfig.IDLE;
  const initials = agent.name.substring(0, 2).toUpperCase();

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="border border-primary/10 bg-[#050505] p-4 rounded-xl flex gap-4 items-center shadow-lg group hover:border-primary/40 transition-all duration-300"
    >
      <div className={cn(
        "w-12 h-12 rounded flex items-center justify-center font-bold border transition-all",
        agent.status === 'ACTIVE' ? "bg-primary/20 text-primary border-primary/40" :
        agent.status === 'SCANNING' ? "bg-orange-500/10 text-accent border-accent/30" :
        "bg-white/5 text-white/30 border-white/10"
      )}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className={cn("font-mono text-xs", agent.status === 'ACTIVE' ? "text-primary" : "opacity-60")}>
            {agent.name}_v4
          </p>
          <span className={cn("text-[9px] font-bold uppercase tracking-widest", config.color)}>
            {agent.status}
          </span>
        </div>
        <p className="text-[10px] opacity-60 truncate uppercase tracking-tight">{agent.role}: {agent.function}</p>
      </div>
    </motion.div>
  );
};

export const Agents = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAgents = filter === 'ALL' 
    ? AGENTS 
    : AGENTS.filter(agent => agent.status === filter);

  const filterOptions = [
    { id: 'ALL', label: 'Alle' },
    { id: 'ACTIVE', label: 'Active', color: 'text-emerald-400' },
    { id: 'SCANNING', label: 'Scanning', color: 'text-orange-400' },
    { id: 'IDLE', label: 'Idle', color: 'text-white/60' },
    { id: 'ERROR', label: 'Error', color: 'text-red-400' },
  ];

  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Cluster synkronisert! Alle noder opererer på v4.2 protokollen.');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter mb-2">{t('agents.title')}</h1>
          <p className="text-text-muted font-mono text-sm tracking-widest uppercase">{t('agents.subtitle')}</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={cn(syncing && "animate-spin")} /> 
          {syncing ? 'Synkroniserer...' : 'Synkroniser Cluster'}
        </button>
      </div>

      <div className="bg-surface border border-primary/20 rounded-xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-primary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">AI Orchestrator Cluster</h3>
            <span className="text-[10px] px-2 py-0.5 border border-emerald-500/50 text-emerald-500 rounded bg-emerald-500/5 uppercase font-mono">SYSTEM STABILITET: 100%</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={cn(
                  "px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded transition-all border",
                  filter === option.id 
                    ? "bg-primary text-background border-primary" 
                    : "bg-surface border-outline hover:border-primary/50 text-text-muted"
                )}
              >
                <span className={cn(filter !== option.id && option.color)}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.length > 0 ? (
            filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center opacity-40">
              <p className="mono text-[10px] uppercase tracking-widest">Ingen agenter med status: {filter}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-[#050505] border-t border-primary/10 font-mono text-[9px] text-primary/60">
          [2026-05-06 19:26:19] NOVA_SCAN detekterte kjerne-trend for markedsføring: "Hyper-minimalist aesthetics"
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden border border-primary/10 flex flex-col h-[400px]">
          <div className="bg-surface/50 p-4 border-b border-primary/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Sentral Logg-strøm</h2>
            </div>
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
               <div className="w-2.5 h-2.5 rounded-full bg-accent/30" />
               <div className="w-2.5 h-2.5 rounded-full bg-red-400/30" />
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-[10px] overflow-y-auto space-y-3 bg-[#050505]/60">
             <div className="flex gap-4">
               <span className="text-primary/40 shrink-0">19:24:12</span>
               <p><span className="text-primary">ATLAS:</span> Skanner globale trender for "AI produktivitet"...</p>
             </div>
             <div className="flex gap-4">
               <span className="text-primary/40 shrink-0">19:24:15</span>
               <p><span className="text-accent">NOVA:</span> Visual asset synthesis initialisert. Stil: Sleek Interface.</p>
             </div>
             <div className="flex gap-4">
               <span className="text-primary/40 shrink-0">19:24:22</span>
               <p><span className="text-emerald-400">PULSE:</span> Innholdsjekk fullført. Synkronisering: Perfekt.</p>
             </div>
             <div className="flex gap-4">
               <span className="text-primary/40 shrink-0">19:24:30</span>
               <p><span className="text-text-muted opacity-50">SYSTEM:</span> Buffer tømt. Noder opererer i optimal modus.</p>
             </div>
             <div className="animate-pulse flex items-center gap-2 mt-4">
               <span className="w-1.5 h-3 bg-primary" />
               <span className="text-primary opacity-70">Overvåker cluster...</span>
             </div>
          </div>
        </div>

        <div className="glass p-8 rounded-xl border border-primary/10 bg-surface flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 border-b border-primary/10 pb-4">Cluster Ressurser</h3>
            <div className="space-y-8">
              {[
                { label: 'Latency', value: '12ms', percent: 12 },
                { label: 'Compute Power', value: '1.2 PFlops', percent: 85 },
                { label: 'Storage Cluster', value: '4.8 PB', percent: 62 },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] mono uppercase text-text-muted mb-3 italic tracking-tight">
                    <span>{stat.label}</span>
                    <span className="text-primary font-bold">{stat.value}</span>
                  </div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-sleek transition-all duration-1000" style={{ width: `${stat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-10 py-3 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-background transition-all">
            Håndter Cluster Ressurser
          </button>
        </div>
      </div>
    </div>
  );
};
