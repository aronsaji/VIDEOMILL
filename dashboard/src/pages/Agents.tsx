import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { 
  Cpu, Shield, Terminal, Zap, Activity, 
  Search, Info, AlertTriangle, Layers,
  ChevronRight, ArrowUpRight, Monitor
} from 'lucide-react';

const AGENTS = [
  { id: 'atlas', name: 'ATLAS_v4', role: 'DIRECTOR', status: 'ACTIVE', focus: 'STRATEGY', color: 'text-[#BD00FF]', description: 'Governs the primary production narrative. Optimizes for viral hooks.' },
  { id: 'kronos', name: 'KRONOS_v9', role: 'EDITOR', status: 'IDLE', focus: 'PACING', color: 'text-[#6bff83]', description: 'Frame-perfect visual assembly. Manages beat-sync and transitions.' },
  { id: 'nova', name: 'NOVA_SCAN', role: 'RESEARCHER', status: 'SCANNING', focus: 'TRENDS', color: 'text-[#00f5ff]', description: 'Deep-web data miner. Identifies emerging visual patterns.' },
  { id: 'pulse', name: 'PULSE_DIST', role: 'DISTRIBUTOR', status: 'ACTIVE', focus: 'ALGORITHM', color: 'text-[#ffaa00]', description: 'Deployment expert. Calculates optimal posting windows.' },
];

export default function Agents() {
  const { subscribeToChanges } = usePipelineStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
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
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#ffaa00] font-data-mono text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            <Shield size={14} className="animate-pulse" />
            AI_AGENT_COMMAND_CORE
          </div>
          <h1 className="font-headline text-[56px] font-[900] tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            NEURAL_AGENTS
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Active Nodes</span>
              <span className="font-headline text-4xl font-black text-[#6bff83] italic">04/04</span>
           </div>
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Compute Load</span>
              <span className="font-headline text-4xl font-black text-[#BD00FF] italic">28%</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Agent Grid */}
        <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {AGENTS.map((agent, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               key={agent.id}
               className="bg-[#0A0A0B] border border-white/10 p-8 group hover:border-[#BD00FF]/30 transition-all relative overflow-hidden"
             >
                <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-10">
                   <div className={`p-4 bg-black border border-white/5 ${agent.color} group-hover:scale-110 transition-transform`}>
                      <Cpu size={32} />
                   </div>
                   <div className="flex flex-col items-end">
                      <span className={`font-data-mono text-[9px] px-2 py-1 border mb-2 ${
                        agent.status === 'ACTIVE' || agent.status === 'SCANNING' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-white/5 text-zinc-500 border-white/10'
                      }`}>
                         {agent.status}
                      </span>
                      <span className="font-data-mono text-[9px] text-zinc-600 uppercase tracking-widest">Uptime: 99.9%</span>
                   </div>
                </div>

                <h3 className="font-headline text-3xl font-[900] text-white uppercase italic mb-1 tracking-tighter leading-none group-hover:text-[#BD00FF] transition-colors">
                   {agent.name}
                </h3>
                <p className="font-label-caps text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-6">
                   {agent.role} // {agent.focus}_FOCUS
                </p>
                <p className="font-data-mono text-[11px] text-zinc-400 leading-relaxed italic uppercase mb-8 h-12 line-clamp-2">
                   "{agent.description}"
                </p>

                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                   <div className="flex gap-1">
                      {[1,2,3,4,5].map(j => (
                        <div key={j} className={`w-3 h-1 ${j <= 4 ? agent.color.replace('text-', 'bg-') : 'bg-white/5'}`} />
                      ))}
                   </div>
                   <button className="font-data-mono text-[10px] text-white uppercase flex items-center gap-2 group/btn">
                      CONFIGURE <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Sidebar: Telemetry & Reports */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
           {/* Agent Log Feed */}
           <section className="bg-[#0A0A0B] border border-white/10 p-8 flex flex-col max-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-[#6bff83]" />
                    <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">NEURAL_LOG_STREAM</h2>
                 </div>
                 <div className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse shadow-[0_0_8px_#6bff83]" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-4">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="space-y-1 group">
                      <div className="flex justify-between text-[9px] font-data-mono uppercase">
                         <span className="text-[#BD00FF]">{log.agent_name || 'SYSTEM'}</span>
                         <span className="text-zinc-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-data-mono text-[10px] text-zinc-400 leading-relaxed uppercase italic">
                         {log.message || log.log_content || 'Node execution verified.'}
                      </p>
                   </div>
                 )) : (
                   <div className="py-20 text-center text-zinc-800 font-data-mono uppercase text-xs">
                      listening for agent signals...
                   </div>
                 )}
              </div>
           </section>

           {/* System Reports */}
           <section className="bg-[#0A0A0B] border border-white/10 p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <Layers size={18} className="text-[#00f5ff]" />
                 <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">SYSTEM_REPORTS</h2>
              </div>

              <div className="space-y-3">
                 {reports.length > 0 ? reports.map((report, i) => (
                   <div key={i} className="p-4 bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-[#00f5ff]/30 transition-all">
                      <div>
                         <p className="font-headline text-xs font-bold text-white uppercase italic">{report.title || 'DAILY_STABILITY_SUMMARY'}</p>
                         <p className="font-data-mono text-[9px] text-zinc-600 uppercase">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-800 group-hover:text-[#00f5ff] transition-colors" />
                   </div>
                 )) : (
                   <div className="text-zinc-800 font-data-mono text-[10px] uppercase">No reports archived.</div>
                 )}
              </div>
              
              <button className="w-full py-3 bg-white/5 border border-white/10 text-zinc-500 font-headline font-bold uppercase italic text-[11px] hover:text-white hover:bg-white/10 transition-all">
                 VIEW_ALL_REPORTS
              </button>
           </section>
        </aside>
      </div>
    </div>
  );
}
