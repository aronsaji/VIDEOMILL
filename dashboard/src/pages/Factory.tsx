import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, PenTool, Layers, Cpu, 
  Settings2, Activity, Shield, 
  ChevronRight, Play, Globe, 
  Sparkles, History, CheckCircle2, 
  AlertCircle, Clock, Database
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { useI18nStore } from '../store/i18nStore';

const AGENTS = [
  { id: 'agent-w', name: 'NEURAL_WRITER_v4', role: 'SCRIPT_SYNTHESIS', status: 'ACTIVE', color: 'text-[#BD00FF]', icon: PenTool },
  { id: 'agent-e', name: 'PIXEL_EDITOR_v9', role: 'VISUAL_ASSEMBLY', status: 'WAITING', color: 'text-[#00f5ff]', icon: Layers },
  { id: 'agent-r', name: 'RENDER_FORCE_RTX', role: 'FINAL_EXPORT', status: 'ONLINE', color: 'text-[#6bff83]', icon: Cpu },
];

export default function Factory() {
  const { t } = useI18nStore();
  const { orders = [], fetchOrders, subscribeToChanges } = usePipelineStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedVoice, setSelectedVoice] = useState('Male 1');

  useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToChanges();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchOrders, subscribeToChanges]);

  const activeCycles = Array.isArray(orders) 
    ? orders.filter(o => o.status !== 'completed' && o.status !== 'failed').length 
    : 0;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const payload = {
      action: 'viranode-generate',
      topic: prompt,
      language: selectedLanguage,
      voice: selectedVoice,
      timestamp: new Date().toISOString(),
      priority: 'CRITICAL',
      source: 'FACTORY_DIRECT_DISPATCH'
    };

    try {
      const success = await triggerProduction(payload);
      if (success) {
        setPrompt('');
        fetchOrders();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getAgentStatus = (agentId: string) => {
    if (isGenerating) {
       if (agentId === 'agent-w') return { label: 'SYNTHESIZING', color: 'text-[#BD00FF]', pulse: true };
       return { label: 'PREPARING', color: 'text-zinc-500', pulse: false };
    }

    if (activeCycles > 0) {
       if (agentId === 'agent-w') return { label: 'IDLE', color: 'text-zinc-600', pulse: false };
       if (agentId === 'agent-e') return { label: 'ASSEMBLING', color: 'text-[#00f5ff]', pulse: true };
       if (agentId === 'agent-r') return { label: 'RENDERING', color: 'text-[#6bff83]', pulse: true };
    }

    return null;
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#BD00FF] font-data-mono text-[11px] font-black uppercase tracking-[0.4em] mb-3">
            <Activity size={16} />
            NODE_ORCHESTRATION_v2.4
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            {t('THE_FACTORY')}
          </h1>
        </div>
        
        <div className="flex gap-6 relative z-10">
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner">
             <span className="font-label-caps text-[12px] text-zinc-400 uppercase tracking-[0.3em] mb-2 font-bold">{t('ACTIVE_CYCLES')}</span>
             <span className="font-headline text-5xl font-black text-white italic tracking-tighter">
               {String(activeCycles).padStart(2, '0')}
             </span>
          </div>
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#6bff83]/20 bg-[#6bff83]/5 clipped-corner">
             <span className="font-label-caps text-[12px] text-zinc-400 uppercase tracking-[0.3em] mb-2 font-bold">{t('QUEUE_DEPTH')}</span>
             <span className="font-headline text-5xl font-black text-[#6bff83] italic tracking-tighter">
               {String(orders.length || 0).padStart(2, '0')}
             </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Automated Workstations */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <section className="panel-kinetic p-8 space-y-8 clipped-corner border-white/5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                 <Shield size={18} className="text-[#BD00FF]" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">AGENT_ORCHESTRATION_NODES</h2>
              </div>
              
              <div className="space-y-4">
                 {AGENTS.map((agent, i) => {
                    const dynamic = getAgentStatus(agent.id);
                    const statusLabel = dynamic?.label || agent.status;
                    const statusColor = dynamic?.color || (agent.status === 'ACTIVE' ? 'text-[#6bff83]' : 'text-zinc-600');
                    const isPulsing = dynamic?.pulse || agent.status === 'ACTIVE';

                    return (
                      <motion.div 
                        key={agent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 bg-white/[0.01] border transition-all cursor-crosshair clipped-corner-sm ${
                           dynamic?.pulse ? 'border-[#BD00FF]/40 bg-[#BD00FF]/5' : 'border-white/5'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-4 bg-black/60 border border-white/5 clipped-corner-sm ${agent.color}`}>
                               <agent.icon size={22} className={dynamic?.pulse ? 'animate-pulse' : ''} />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`font-data-mono text-[9px] px-2 py-0.5 font-black italic tracking-widest ${statusColor}`}>
                                {statusLabel}
                              </span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isPulsing ? 'bg-[#6bff83]' : 'bg-zinc-800'} ${isPulsing ? 'animate-pulse-led' : ''}`} />
                            </div>
                         </div>
                         <h3 className="font-headline text-xl font-black text-white uppercase italic mb-1 tracking-tight">
                           {agent.name}
                         </h3>
                         <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">{agent.role}</p>
                      </motion.div>
                    );
                 })}
              </div>
           </section>

           <section className="panel-kinetic p-8 clipped-corner border-white/5 bg-gradient-to-br from-[#BD00FF]/5 to-transparent">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Database size={18} className="text-[#00f5ff]" />
                    <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">LIVE_QUEUE_FEED</h2>
                 </div>
                 <span className="font-data-mono text-[9px] text-[#00f5ff] font-black animate-pulse">STREAMING_LIVE</span>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                    {orders.slice(0, 5).map((order) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-white/[0.02] border border-white/5 clipped-corner-sm flex flex-col gap-2"
                      >
                         <div className="flex justify-between items-start">
                            <span className="font-headline text-[13px] font-black text-white uppercase italic truncate max-w-[150px]">
                              {order.topic || 'NEURAL_TASK'}
                            </span>
                            <span className="font-data-mono text-[9px] text-zinc-500">#{String(order.id).slice(0,6)}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                               {order.status === 'completed' ? <CheckCircle2 size={12} className="text-[#6bff83]" /> : 
                                order.status === 'failed' ? <AlertCircle size={12} className="text-red-500" /> :
                                <Clock size={12} className="text-[#BD00FF] animate-spin-slow" />}
                               <span className="font-data-mono text-[9px] text-zinc-400 uppercase">{order.status || 'PENDING'}</span>
                            </div>
                            <span className="font-data-mono text-[9px] text-[#BD00FF] font-black">{order.progress || 0}%</span>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </section>
        </div>

        {/* Main Content Area: Production Terminal */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className="panel-kinetic p-10 clipped-corner border-[#BD00FF]/20 bg-[#0A0A0B] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Cpu size={120} className="text-[#BD00FF]" />
              </div>

              <div className="relative z-10 space-y-10">
                 <div className="flex justify-between items-start">
                    <div>
                       <span className="font-label-caps text-[11px] text-[#BD00FF] font-black uppercase tracking-[0.4em] mb-4 block">SYSTEM_INPUT_INTERFACE</span>
                       <h2 className="font-headline text-4xl font-black text-white italic uppercase tracking-tighter">INITIATE_PRODUCTION_BURST</h2>
                    </div>
                    <div className="p-4 border border-[#BD00FF]/30 clipped-corner-sm bg-[#BD00FF]/10 text-[#BD00FF]">
                       <Zap size={24} className={isGenerating ? 'animate-pulse' : ''} />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="relative">
                       <textarea 
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         placeholder="DESCRIBE_THE_VIRAL_CONCEPT_OR_NEURAL_TOPIC..."
                         className="w-full h-48 bg-black/40 border border-white/10 p-8 text-white font-headline text-xl italic uppercase placeholder:text-zinc-800 focus:outline-none focus:border-[#BD00FF]/50 transition-all clipped-corner resize-none"
                       />
                       <div className="absolute bottom-6 right-6 flex gap-4">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-500 font-data-mono text-[10px] font-black uppercase hover:text-white transition-colors clipped-corner-sm">
                             <Sparkles size={14} />
                             AI_OPTIMIZE
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">PRODUCTION_LANGUAGE</label>
                          <div className="flex flex-wrap gap-2">
                             {['English', 'Norsk', 'Tamil', 'Hindi', 'Español'].map(lang => (
                               <button 
                                 key={lang}
                                 onClick={() => setSelectedLanguage(lang)}
                                 className={`px-4 py-2 font-data-mono text-[11px] font-black uppercase transition-all clipped-corner-sm border ${
                                   selectedLanguage === lang ? 'bg-[#BD00FF] border-[#BD00FF] text-white' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-[#BD00FF]/50'
                                 }`}
                               >
                                 {lang}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">VOICE_SYNTHESIS_MODEL</label>
                          <div className="flex gap-2">
                             {['Male 1', 'Female 1', 'Male 2', 'Neural Max'].map(voice => (
                               <button 
                                 key={voice}
                                 onClick={() => setSelectedVoice(voice)}
                                 className={`px-4 py-2 font-data-mono text-[11px] font-black uppercase transition-all clipped-corner-sm border ${
                                   selectedVoice === voice ? 'bg-[#00f5ff] border-[#00f5ff] text-black' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-[#00f5ff]/50'
                                 }`}
                               >
                                 {voice}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full group relative h-24 overflow-hidden clipped-corner bg-white text-black transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                    >
                       <div className="absolute inset-0 bg-[#BD00FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                       <div className="relative z-10 flex items-center justify-center gap-4">
                          <span className="font-headline text-2xl font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">
                            {isGenerating ? 'EXECUTING_DISPATCH...' : 'EXECUTE_PRODUCTION_SEQUENCE'}
                          </span>
                          <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform group-hover:text-white" />
                       </div>
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="panel-kinetic p-8 clipped-corner border-white/5 flex items-center gap-6 group hover:border-[#6bff83]/30 transition-colors">
                 <div className="p-5 bg-[#6bff83]/10 text-[#6bff83] border border-[#6bff83]/20 clipped-corner-sm group-hover:scale-110 transition-transform">
                    <History size={32} />
                 </div>
                 <div>
                    <h4 className="font-headline text-2xl font-black text-white italic uppercase tracking-tight">HISTORY_ARCHIVE</h4>
                    <p className="font-data-mono text-[11px] text-zinc-500 uppercase tracking-widest font-bold">View all previous generations</p>
                 </div>
              </div>
              <div className="panel-kinetic p-8 clipped-corner border-white/5 flex items-center gap-6 group hover:border-[#BD00FF]/30 transition-colors">
                 <div className="p-5 bg-[#BD00FF]/10 text-[#BD00FF] border border-[#BD00FF]/20 clipped-corner-sm group-hover:scale-110 transition-transform">
                    <Settings2 size={32} />
                 </div>
                 <div>
                    <h4 className="font-headline text-2xl font-black text-white italic uppercase tracking-tight">FACTORY_CONFIG</h4>
                    <p className="font-data-mono text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Adjust global node parameters</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
