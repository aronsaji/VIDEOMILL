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
import { useI18nStore } from '../store/i18nStore';

const AGENTS = [
  { id: 'atlas', name: 'ATLAS_v4', role: 'DIRECTOR', status: 'ACTIVE', focus: 'STRATEGY', color: 'text-[#b1cdb7]', description: 'Governs the primary production narrative. Optimizes for viral hooks.' },
  { id: 'kronos', name: 'KRONOS_v9', role: 'EDITOR', status: 'IDLE', focus: 'PACING', color: 'text-[#bec9bf]', description: 'Frame-perfect visual assembly. Manages beat-sync and transitions.' },
  { id: 'nova', name: 'NOVA_SCAN', role: 'RESEARCHER', status: 'SCANNING', focus: 'TRENDS', color: 'text-[#b1cdb7]', description: 'Deep-web data miner. Identifies emerging visual patterns.' },
  { id: 'pulse', name: 'PULSE_DIST', role: 'DISTRIBUTOR', status: 'ACTIVE', focus: 'ALGORITHM', color: 'text-[#e9bbbe]', description: 'Deployment expert. Calculates optimal posting windows.' },
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
      {/* Cinematic Header - Naturalist Studio */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={18} className="animate-pulse" />
            AI_OPERATOR_COMMAND_CORE
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            Neural_<span className="text-[#b1cdb7]">Agents</span>
          </h1>
          <p className="text-[#8c928c] mt-4 font-label-sm text-[11px] uppercase tracking-widest font-bold italic opacity-40">Latency: 12ms // Protocol: Neural-Link-V2</p>
        </div>
        
        <div className="flex gap-8">
           <div className="bg-[#1b1c1a] border border-[#424843] p-8 rounded-soft-xl flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-[0.3em] mb-4 italic opacity-40">ACTIVE_NODES</span>
              <span className="text-6xl font-bold text-[#b1cdb7] font-headline-md italic tracking-tighter leading-none">04<span className="text-[#424843] text-3xl">/04</span></span>
           </div>
           <div className="bg-[#1b1c1a] border border-[#424843] p-8 rounded-soft-xl flex flex-col min-w-[220px] shadow-sm relative overflow-hidden group">
              <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-[0.3em] mb-4 italic opacity-40">COMPUTE_LOAD</span>
              <span className="text-6xl font-bold text-[#b1cdb7] font-headline-md italic tracking-tighter leading-none">28<span className="text-[#424843] text-3xl">%</span></span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Main Agent Grid */}
        <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
           {AGENTS.map((agent, i) => (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={agent.id}
                className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl group hover:border-[#b1cdb7]/40 transition-all duration-700 relative overflow-hidden shadow-sm flex flex-col"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                   <CpuIcon size={120} className="group-hover:rotate-12 transition-transform duration-1000" />
                </div>
                
                <div className="flex justify-between items-start mb-16 relative z-10">
                   <div className={`p-6 bg-[#131412] rounded-soft-lg border border-[#424843] ${agent.color} group-hover:scale-110 group-hover:shadow-[0_0_25px_currentColor] group-hover:border-current transition-all duration-700`}>
                      <Cpu size={36} />
                   </div>
                   <div className="flex flex-col items-end">
                      <div className={`px-6 py-2 rounded-soft-sm text-[10px] font-bold uppercase tracking-[0.3em] border mb-4 flex items-center gap-3 italic ${
                        agent.status === 'ACTIVE' || agent.status === 'SCANNING' 
                          ? 'bg-[#2d4535] text-[#b1cdb7] border-[#b1cdb7]/20 shadow-xl shadow-[#b1cdb7]/5' 
                          : 'bg-[#131412] text-[#8c928c] border-[#424843]'
                      }`}>
                         <div className={`w-2 h-2 rounded-full ${agent.status === 'ACTIVE' ? 'bg-[#b1cdb7] animate-pulse shadow-[0_0_10px_#b1cdb7]' : 'bg-[#424843]'}`} />
                         {agent.status}
                      </div>
                      <span className="font-label-sm text-[10px] text-[#8c928c] font-bold uppercase tracking-widest italic opacity-40">UPTIME: 99.9%</span>
                   </div>
                </div>

                <h3 className="text-4xl font-bold text-[#e4e2e0] font-headline-md uppercase italic mb-4 tracking-tighter leading-none group-hover:text-[#b1cdb7] transition-colors duration-500">
                   {agent.name}
                </h3>
                <p className="font-label-sm text-[11px] text-[#8c928c] font-bold uppercase tracking-[0.4em] mb-10 italic opacity-40 group-hover:opacity-100 transition-opacity">
                   {agent.role} // <span className="text-[#e4e2e0] font-bold">{agent.focus}_CORE</span>
                </p>
                <p className="font-label-sm text-sm text-[#8c928c] leading-relaxed italic uppercase mb-12 h-14 line-clamp-2 font-bold opacity-60">
                   "{agent.description}"
                </p>

                <div className="pt-10 border-t border-[#424843] flex justify-between items-center mt-auto">
                   <div className="flex gap-3">
                      {[1,2,3,4,5].map(j => (
                        <div key={j} className={`w-8 h-2 rounded-soft-sm transition-all duration-500 ${j <= 4 ? agent.color.replace('text-', 'bg-') : 'bg-[#131412] border border-[#424843]'}`} />
                      ))}
                   </div>
                   <button className="font-label-sm text-[11px] text-[#e4e2e0] font-bold uppercase italic tracking-widest flex items-center gap-4 group/btn hover:text-[#b1cdb7] transition-all">
                      Diagnostics <ChevronRight size={18} className="group-hover/btn:translate-x-3 transition-transform duration-300" />
                   </button>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Sidebar: Telemetry & Reports */}
        <aside className="col-span-12 lg:col-span-4 space-y-10">
           {/* Agent Log Feed */}
           <section className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl flex flex-col h-[560px] shadow-sm overflow-hidden relative group">
              <div className="flex justify-between items-center mb-12 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
                       <Terminal size={24} />
                    </div>
                    <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em]">Neural_Log_Stream</h2>
                 </div>
                 <div className="w-3 h-3 bg-[#b1cdb7] rounded-full animate-pulse shadow-[0_0_15px_#b1cdb7]" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-6 relative z-10">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <div key={i} className="space-y-3 group/log border-l-2 border-transparent hover:border-[#b1cdb7] pl-6 transition-all duration-300">
                      <div className="flex justify-between font-label-sm text-[10px] uppercase font-bold tracking-widest italic opacity-40 group-hover:opacity-100 transition-opacity">
                         <span className="text-[#b1cdb7]">{log.agent_name || 'SYSTEM'}</span>
                         <span className="text-[#8c928c]">{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}</span>
                      </div>
                      <p className="font-label-sm text-[12px] text-[#8c928c] leading-relaxed uppercase italic group-hover/log:text-[#e4e2e0] transition-colors font-bold opacity-60 group-hover:opacity-100">
                         {log.message || log.log_content || 'Node execution verified.'}
                      </p>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center text-[#8c928c]/10 font-label-sm uppercase text-sm font-bold tracking-[0.5em] italic">
                      <Activity size={72} className="mb-10 animate-pulse" />
                      listening for signals...
                   </div>
                 )}
              </div>
           </section>

           {/* System Reports */}
           <section className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-10 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-6 mb-4 relative z-10">
                 <div className="p-4 bg-[#131412] rounded-soft-lg border border-[#424843] text-[#b1cdb7]">
                    <Layers size={24} />
                 </div>
                 <h2 className="font-label-sm text-[13px] font-bold text-[#e4e2e0] uppercase italic tracking-[0.4em]">Intel_Reports</h2>
              </div>

              <div className="space-y-6 relative z-10">
                 {reports.length > 0 ? reports.map((report, i) => (
                   <div key={i} className="p-8 bg-[#131412] border border-[#424843] rounded-soft-xl flex items-center justify-between group/report cursor-pointer hover:border-[#b1cdb7]/40 hover:bg-[#1f201e] transition-all duration-700 shadow-sm">
                      <div className="space-y-2">
                         <p className="text-xl font-bold text-[#e4e2e0] uppercase italic tracking-tight group-hover/report:text-[#b1cdb7] transition-colors font-headline-md">{report.title || 'Stability_Summary'}</p>
                         <p className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold tracking-widest italic opacity-40">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-soft-sm border border-[#424843] flex items-center justify-center group-hover/report:bg-[#b1cdb7] group-hover/report:border-[#b1cdb7] transition-all duration-500 group-hover/report:shadow-2xl group-hover/report:shadow-[#b1cdb7]/10">
                        <ArrowUpRight size={22} className="text-[#8c928c] group-hover/report:text-[#1d3526] transition-colors" />
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-[#8c928c]/10 font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] text-center italic opacity-20">No reports archived.</div>
                 )}
              </div>
              
              <button className="w-full py-6 bg-[#131412] border border-[#424843] rounded-soft-lg text-[#8c928c] font-bold uppercase italic text-[11px] tracking-[0.4em] hover:text-[#b1cdb7] hover:bg-[#1b1c1a] transition-all shadow-sm font-label-sm">
                 View All Reports
              </button>
           </section>
        </aside>
      </div>
    </div>
  );
}
