import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Cpu, Shield, Terminal, Zap, Activity, 
  Search, Info, AlertTriangle, Layers,
  ChevronRight, ArrowUpRight, Monitor,
  Radio, HardDrive, Cpu as CpuIcon,
  Eye, MessageSquare, Share2, PlayCircle
} from 'lucide-react';

const AGENTS = [
  { id: 'atlas', name: 'ATLAS_v4', role: 'DIRECTOR', status: 'ACTIVE', focus: 'STRATEGY', color: 'text-primary-container', description: 'Governs the primary production narrative. Optimizes for viral hooks.' },
  { id: 'kronos', name: 'KRONOS_v9', role: 'EDITOR', status: 'IDLE', focus: 'PACING', color: 'text-[#6bff83]', description: 'Frame-perfect visual assembly. Manages beat-sync and transitions.' },
  { id: 'nova', name: 'NOVA_SCAN', role: 'RESEARCHER', status: 'SCANNING', focus: 'TRENDS', color: 'text-[#00f5ff]', description: 'Deep-web data miner. Identifies emerging visual patterns.' },
  { id: 'pulse', name: 'PULSE_DIST', role: 'DISTRIBUTOR', status: 'ACTIVE', focus: 'ALGORITHM', color: 'text-[#e90053]', description: 'Deployment expert. Calculates optimal posting windows.' },
];

export default function Agents() {
  const { subscribeToChanges } = usePipelineStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
    const unsubscribe = subscribeToChanges();
    return () => {
       if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const fetchAgentData = async () => {
    setIsLoading(true);
    try {
      const [logsRes, reportsRes] = await Promise.all([
        supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('agent_reports').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setLogs(logsRes.data || []);
      setReports(reportsRes.data || []);
    } catch (err) {
      console.error('Error fetching agent data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Cinematic Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            AI_OPERATOR_COMMAND_CORE
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Neural_<span className="text-primary-container">Agents</span>
          </h1>
          <p className="text-zinc-500 mt-4 font-mono text-[10px] uppercase tracking-widest">Latency: 12ms // Protocol: Neural-Link-V2</p>
        </div>
        
        <div className="flex gap-6">
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[200px] shadow-2xl relative overflow-hidden group">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">ACTIVE_NODES</span>
              <span className="text-5xl font-black text-[#6bff83] font-headline-md italic tracking-tighter">04<span className="text-zinc-800 text-3xl">/04</span></span>
           </div>
           <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl flex flex-col min-w-[200px] shadow-2xl relative overflow-hidden group">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-2">COMPUTE_LOAD</span>
              <span className="text-5xl font-black text-primary-container font-headline-md italic tracking-tighter">28<span className="text-zinc-800 text-3xl">%</span></span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Agent Grid */}
        <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {AGENTS.map((agent, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={agent.id}
               className="bg-surface-container-low border border-white/5 p-8 rounded-[3rem] group hover:border-primary-container/30 transition-all duration-500 relative overflow-hidden shadow-2xl"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CpuIcon size={80} className="group-hover:rotate-12 transition-transform duration-1000" />
                </div>
                
                <div className="flex justify-between items-start mb-12 relative z-10">
                   <div className={`p-5 bg-black rounded-2xl border border-white/5 ${agent.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_currentColor] transition-all duration-500`}>
                      <Cpu size={32} />
                   </div>
                   <div className="flex flex-col items-end">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3 flex items-center gap-1.5 ${
                        agent.status === 'ACTIVE' || agent.status === 'SCANNING' 
                          ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20 shadow-[0_0_10px_#6bff8344]' 
                          : 'bg-white/5 text-zinc-500 border-white/10'
                      }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-[#6bff83] animate-pulse' : 'bg-zinc-700'}`} />
                         {agent.status}
                      </div>
                      <span className="font-mono text-[8px] text-zinc-800 uppercase font-black tracking-widest">UPTIME: 99.9%</span>
                   </div>
                </div>

                <h3 className="text-4xl font-black text-white font-headline-md uppercase italic mb-2 tracking-tighter leading-none group-hover:text-primary-container transition-colors duration-500">
                   {agent.name}
                </h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-8 italic">
                   {agent.role} // <span className="text-white">{agent.focus}_CORE</span>
                </p>
                <p className="font-mono text-xs text-zinc-400 leading-relaxed italic uppercase mb-10 h-12 line-clamp-2">
                   "{agent.description}"
                </p>

                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                   <div className="flex gap-2">
                      {[1,2,3,4,5].map(j => (
                        <div key={j} className={`w-6 h-1.5 rounded-full transition-all duration-500 ${j <= 4 ? agent.color.replace('text-', 'bg-') : 'bg-white/5'}`} />
                      ))}
                   </div>
                   <button className="text-[10px] text-white font-black uppercase italic tracking-widest flex items-center gap-3 group/btn hover:text-primary-container transition-all">
                      Diagnostics <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                   </button>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Sidebar: Telemetry & Reports */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
           {/* Agent Log Feed */}
           <section className="bg-surface-container-low border border-white/5 p-8 rounded-[3rem] flex flex-col h-[520px] shadow-2xl overflow-hidden relative group">
              <div className="flex justify-between items-center mb-10 relative">
                 <div className="flex items-center gap-4">
                    <Terminal size={20} className="text-primary-container" />
                    <h2 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Neural_Log_Stream</h2>
                 </div>
                 <div className="w-2 h-2 bg-primary-container rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4 relative">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="space-y-2 group/log border-l-2 border-transparent hover:border-primary-container pl-4 transition-all duration-300">
                      <div className="flex justify-between text-[9px] font-mono uppercase font-black tracking-widest">
                         <span className="text-primary-container italic">{log.agent_name || 'SYSTEM'}</span>
                         <span className="text-zinc-700">{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}</span>
                      </div>
                      <p className="font-mono text-[10px] text-zinc-500 leading-relaxed uppercase italic group-hover/log:text-white transition-colors">
                         {log.message || log.log_content || 'Node execution verified.'}
                      </p>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center text-zinc-800 font-mono uppercase text-xs font-black tracking-[0.3em]">
                      <Activity size={40} className="mb-6 opacity-20 animate-pulse" />
                      listening for signals...
                   </div>
                 )}
              </div>
           </section>

           {/* System Reports */}
           <section className="bg-surface-container-low border border-white/5 p-8 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-4">
                 <Layers size={20} className="text-[#00f5ff]" />
                 <h2 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Intel_Reports</h2>
              </div>

              <div className="space-y-4">
                 {reports.length > 0 ? reports.map((report, i) => (
                   <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group/report cursor-pointer hover:border-[#00f5ff]/40 hover:bg-white/[0.04] transition-all duration-500">
                      <div>
                         <p className="text-sm font-black text-white uppercase italic tracking-tight mb-1 group-hover/report:text-[#00f5ff] transition-colors">{report.title || 'Stability_Summary'}</p>
                         <p className="font-mono text-[9px] text-zinc-700 uppercase font-black tracking-widest">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover/report:bg-[#00f5ff] transition-all duration-500">
                        <ArrowUpRight size={18} className="text-zinc-700 group-hover/report:text-black transition-colors" />
                      </div>
                   </div>
                 )) : (
                   <div className="py-10 text-zinc-800 font-mono text-[9px] font-black uppercase tracking-widest text-center">No reports archived.</div>
                 )}
              </div>
              
              <button className="w-full py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-zinc-600 font-black uppercase italic text-xs tracking-[0.3em] hover:text-white hover:bg-white/10 transition-all">
                 View All Reports
              </button>
           </section>
        </aside>
      </div>
    </div>
  );
}
