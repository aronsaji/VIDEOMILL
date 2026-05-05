import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { 
  Cpu, Zap, Settings, Activity, Play, 
  Terminal, Globe, Shield, Database,
  PenTool, Video, Layers, CheckCircle2
} from 'lucide-react';

const LANGUAGES = [
  { id: 'Norsk', label: 'Norway (Norsk)' },
  { id: 'English', label: 'UK/USA (English)' },
  { id: 'Español', label: 'Spain (Español)' },
];

const PLATFORMS = [
  { id: 'TIKTOK', label: 'TikTok', icon: Zap },
  { id: 'INSTAGRAM_REELS', label: 'Instagram Reels', icon: Video },
  { id: 'YOUTUBE_SHORTS', label: 'YouTube Shorts', icon: Play },
];

const AGENTS = [
  { id: 'agent-w', name: 'NEURAL_WRITER_v4', role: 'SCRIPT_SYNTHESIS', status: 'ACTIVE', color: 'text-[#BD00FF]', icon: PenTool },
  { id: 'agent-e', name: 'PIXEL_EDITOR_v9', role: 'VISUAL_ASSEMBLY', status: 'WAITING', color: 'text-[#00f5ff]', icon: Layers },
  { id: 'agent-r', name: 'RENDER_FORCE_RTX', role: 'FINAL_EXPORT', status: 'ONLINE', color: 'text-[#6bff83]', icon: Cpu },
];

export default function FactoryPage() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('TIKTOK');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const payload = {
        topic: prompt,
        platform: selectedPlatform,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        action: 'viranode-generate'
      };

      const success = await triggerProduction(payload);
      if (success) {
        setPrompt('');
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#BD00FF] font-data-mono text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            <Activity size={14} className="animate-pulse" />
            AUTONOMOUS_PRODUCTION_FACILITY
          </div>
          <h1 className="font-headline text-[56px] font-[900] tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            THE_FACTORY
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[180px] group hover:border-[#BD00FF]/30 transition-all">
             <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Active Cycles</span>
             <span className="font-headline text-4xl font-black text-white italic">0{orders.filter(o => o.status === 'rendering').length || 0}</span>
          </div>
          <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[180px] group hover:border-[#6bff83]/30 transition-all">
             <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Queue Depth</span>
             <span className="font-headline text-4xl font-black text-[#6bff83] italic">{String(orders.length || 0).padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Automated Workstations */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <section className="bg-[#0A0A0B] border border-white/10 p-8 space-y-8">
              <div className="flex items-center gap-3">
                 <Shield size={18} className="text-[#BD00FF]" />
                 <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">AGENT_WORKSTATIONS</h2>
              </div>
              
              <div className="space-y-4">
                 {AGENTS.map((agent, i) => (
                   <motion.div 
                     key={agent.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-6 bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all cursor-crosshair"
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className={`p-3 bg-black border border-white/5 ${agent.color}`}>
                            <agent.icon size={20} />
                         </div>
                         <span className={`font-data-mono text-[9px] px-2 py-0.5 border ${
                           agent.status === 'ACTIVE' ? 'bg-[#6bff83]/10 text-[#6bff83] border-[#6bff83]/20' : 'bg-white/5 text-zinc-500 border-white/10'
                         }`}>
                           {agent.status}
                         </span>
                      </div>
                      <h3 className="font-headline text-lg font-bold text-white uppercase italic mb-1 group-hover:text-[#BD00FF] transition-colors">
                        {agent.name}
                      </h3>
                      <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest">{agent.role}</p>
                   </motion.div>
                 ))}
              </div>
           </section>

           {/* Viral Probability Meter */}
           <div className="bg-[#BD00FF] p-8 clipped-corner relative overflow-hidden group">
              <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
              <h3 className="font-headline text-2xl font-black text-black italic uppercase leading-none mb-6">VIRAL_CONFIDENCE</h3>
              <div className="font-headline text-6xl font-black text-black italic tracking-tighter">
                {prompt.length > 20 ? '94.8%' : '00.0%'}
              </div>
              <div className="mt-6 flex gap-1 h-8 items-end">
                 {[40, 60, 45, 90, 80, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-black/20" style={{ height: `${h}%` }} />
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column: Neural Dispatcher */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <section className="bg-[#0A0A0B] border border-white/10 p-10 relative overflow-hidden group min-h-[500px] flex flex-col">
              <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
              <div className="flex items-center gap-3 mb-10">
                 <Zap size={20} className="text-[#BD00FF]" />
                 <h2 className="font-label-caps text-sm font-bold text-white uppercase tracking-[0.2em]">NEURAL_DISPATCH_UNIT</h2>
              </div>

              <div className="flex-1 space-y-10">
                 <div className="relative">
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-white/10 p-0 py-4 text-3xl font-headline font-bold text-white focus:border-[#BD00FF] focus:outline-none transition-all placeholder:text-zinc-800 uppercase italic leading-tight"
                      placeholder="ENTER_VIRAL_OBJECTIVE_HERE..."
                      rows={3}
                    />
                    <div className="absolute -bottom-1 left-0 h-[2px] bg-[#BD00FF] shadow-[0_0_15px_#BD00FF] w-0 group-focus-within:w-full transition-all duration-700" />
                 </div>

                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest block">TARGET_NETWORK</label>
                       <div className="grid grid-cols-1 gap-2">
                          {PLATFORMS.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => setSelectedPlatform(p.id)}
                              className={`flex items-center gap-3 p-4 border transition-all ${
                                selectedPlatform === p.id 
                                ? 'bg-[#BD00FF]/10 border-[#BD00FF] text-white' 
                                : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/20'
                              }`}
                            >
                               <p.icon size={16} />
                               <span className="font-data-mono text-[11px] font-bold uppercase">{p.label}</span>
                               {selectedPlatform === p.id && <CheckCircle2 size={14} className="ml-auto text-[#BD00FF]" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-widest block">LINGUISTIC_MODEL</label>
                       <div className="grid grid-cols-1 gap-2">
                          {LANGUAGES.map(l => (
                            <button 
                              key={l.id}
                              onClick={() => setSelectedLanguage(l.id)}
                              className={`flex items-center justify-between p-4 border transition-all ${
                                selectedLanguage === l.id 
                                ? 'bg-[#00f5ff]/10 border-[#00f5ff] text-white' 
                                : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/20'
                              }`}
                            >
                               <span className="font-data-mono text-[11px] font-bold uppercase">{l.label}</span>
                               <Globe size={14} className={selectedLanguage === l.id ? 'text-[#00f5ff]' : 'opacity-0'} />
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-10">
                 <button 
                   disabled={isGenerating || !prompt.trim()}
                   onClick={handleGenerate}
                   className="w-full bg-white hover:bg-[#6bff83] text-black p-8 font-headline font-black text-2xl uppercase italic flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 group overflow-hidden relative"
                 >
                    <div className="absolute inset-0 bg-white group-hover:bg-[#6bff83] transition-colors" />
                    <span className="relative z-10">{isGenerating ? 'EXECUTING_NEURAL_PATH...' : 'INITIATE_PRODUCTION_CYCLE'}</span>
                    {!isGenerating && <Play size={24} className="relative z-10 fill-current" />}
                 </button>
              </div>
           </section>

           {/* Production Monitor Log */}
           <section className="bg-[#0A0A0B] border border-white/10 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-[#6bff83]" />
                    <h2 className="font-label-caps text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LIVE_ENGINE_LOG</h2>
                 </div>
                 <div className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse" />
              </div>
              <div className="space-y-2 font-data-mono text-[11px] max-h-[120px] overflow-y-auto custom-scrollbar">
                 {orders.length > 0 ? orders.slice(0, 4).map((order, i) => (
                   <div key={i} className="flex gap-4 text-zinc-500">
                      <span className="text-[#BD00FF] shrink-0">[{new Date(order.created_at).toLocaleTimeString()}]</span>
                      <span className="truncate">TRANSCODE_REQ: {order.topic || order.title} // STATUS: <span className="text-[#6bff83]">{order.status}</span></span>
                   </div>
                 )) : (
                   <div className="text-zinc-700 italic lowercase">listening for neural pulse...</div>
                 )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
