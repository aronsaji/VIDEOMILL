import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { 
  Cpu, Zap, Settings, Activity, Play, 
  Terminal, Globe, Shield, Database as DatabaseIcon,
  PenTool, Video, Layers, CheckCircle2
} from 'lucide-react';

const LANGUAGES = [
  { id: 'Norsk', label: 'Norway (Norsk)' },
  { id: 'English', label: 'UK/USA (English)' },
  { id: 'Español', label: 'Spain (Español)' },
];

const PLATFORMS = [
  { id: 'TIKTOK', label: 'TikTok', icon: Zap },
  { id: 'INSTAGRAM', label: 'Instagram', icon: Video },
  { id: 'YOUTUBE', label: 'YouTube', icon: Play },
  { id: 'SNAPCHAT', label: 'Snapchat', icon: Zap },
];

const AGENTS = [
  { id: 'agent-w', name: 'NEURAL_WRITER_v4', role: 'SCRIPT_SYNTHESIS', status: 'ACTIVE', color: 'text-[#BD00FF]', icon: PenTool },
  { id: 'agent-e', name: 'PIXEL_EDITOR_v9', role: 'VISUAL_ASSEMBLY', status: 'WAITING', color: 'text-[#00f5ff]', icon: Layers },
  { id: 'agent-r', name: 'RENDER_FORCE_RTX', role: 'FINAL_EXPORT', status: 'ONLINE', color: 'text-[#6bff83]', icon: Cpu },
];
import { useI18nStore } from '../store/i18nStore';

export default function Factory() {
  const fetchOrders = usePipelineStore(state => state.fetchOrders);
  const subscribeToChanges = usePipelineStore(state => state.subscribeToChanges);
  const orders = usePipelineStore(state => state.orders);

  const { language, t } = useI18nStore();
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('TIKTOK');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [voiceGender, setVoiceGender] = useState<'MALE' | 'FEMALE' | 'AUTO'>('AUTO');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { 
    fetchOrders(); 
    const unsubscribe = subscribeToChanges();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchOrders, subscribeToChanges]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const payload = {
        topic: prompt,
        platform: selectedPlatform,
        language: selectedLanguage,
        voice_gender: voiceGender,
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

  const activeCycles = orders.filter(o => o.status === 'rendering' || o.status === 'processing').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-8">
        <div className="relative z-10">
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            {t('THE_FACTORY')}
          </h1>
        </div>
        
        <div className="flex gap-6 relative z-10">
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner">
             <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2 font-bold">{t('ACTIVE_CYCLES')}</span>
             <span className="font-headline text-5xl font-black text-white italic tracking-tighter">
               {String(activeCycles).padStart(2, '0')}
             </span>
          </div>
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#6bff83]/20 bg-[#6bff83]/5 clipped-corner">
             <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2 font-bold">{t('QUEUE_DEPTH')}</span>
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
                 {AGENTS.map((agent, i) => (
                   <motion.div 
                     key={agent.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-6 bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] transition-all cursor-crosshair clipped-corner-sm hover:border-[#BD00FF]/30"
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className={`p-4 bg-black/60 border border-white/5 clipped-corner-sm ${agent.color}`}>
                            <agent.icon size={22} />
                         </div>
                         <div className="flex items-center gap-2">
                           <span className={`font-data-mono text-[9px] px-2 py-0.5 font-black italic tracking-widest ${
                             agent.status === 'ACTIVE' ? 'text-[#6bff83]' : 'text-zinc-600'
                           }`}>
                             {agent.status}
                           </span>
                           <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-[#6bff83]' : 'bg-zinc-800'} animate-pulse-led`} />
                         </div>
                      </div>
                      <h3 className="font-headline text-xl font-black text-white uppercase italic mb-1 group-hover:text-[#BD00FF] transition-colors tracking-tight">
                        {agent.name}
                      </h3>
                      <p className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">{agent.role}</p>
                   </motion.div>
                 ))}
              </div>
           </section>

           {/* Viral Confidence Module */}
           <div className="bg-[#BD00FF] p-[2px] clipped-corner">
              <div className="bg-[#0A0A0B] p-8 clipped-corner relative overflow-hidden group h-[280px] flex flex-col justify-between">
                 <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
                 <div className="flex justify-between items-start relative z-10">
                    <h3 className="font-headline text-2xl font-black text-[#BD00FF] italic uppercase tracking-tighter">VIRAL_ENGINE_OUTPUT</h3>
                    <Zap size={20} className="text-[#BD00FF] animate-pulse" />
                 </div>
                 <div className="relative z-10">
                    <div className="font-headline text-7xl font-black text-white italic tracking-tighter mb-2">
                      {prompt.length > 20 ? '94.8' : '00.0'}<span className="text-3xl text-[#BD00FF]">%</span>
                    </div>
                    <div className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">CONFIDENCE_SCORE</div>
                 </div>
                 <div className="mt-4 flex gap-1.5 h-12 items-end relative z-10">
                    {[40, 60, 45, 90, 80, 100, 70, 85, 40, 95].map((h, i) => (
                      <div key={i} className={`flex-1 ${prompt.length > 20 ? 'bg-[#BD00FF]' : 'bg-zinc-900'} opacity-30`} style={{ height: `${h}%` }} />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Neural Dispatcher */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <section className="panel-kinetic p-10 relative overflow-hidden group min-h-[580px] flex flex-col clipped-corner border-white/5">
              <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
              <div className="flex items-center gap-3 mb-12">
                 <Zap size={20} className="text-[#BD00FF] animate-pulse" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.4em]">NEURAL_DISPATCH_ORCHESTRATOR</h2>
              </div>

              <div className="flex-1 space-y-12 relative z-10">
                 <div className="relative group/input">
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 p-0 py-6 text-4xl font-headline font-black text-white focus:border-[#BD00FF] focus:outline-none transition-all placeholder:text-zinc-800 uppercase italic leading-[1.1] tracking-tighter"
                      placeholder="ENTER_CORE_OBJECTIVE..."
                      rows={3}
                    />
                    <div className="absolute -bottom-[1px] left-0 h-[2px] bg-[#BD00FF] shadow-[0_0_20px_#BD00FF] w-0 group-focus-within/input:w-full transition-all duration-1000" />
                 </div>

                 <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <label className="font-data-mono text-[10px] text-zinc-600 uppercase tracking-[0.3em] block font-bold">TARGET_DEPLOYMENT_NET</label>
                       <div className="grid grid-cols-1 gap-3">
                          {PLATFORMS.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => setSelectedPlatform(p.id)}
                              className={`flex items-center gap-4 p-5 border transition-all clipped-corner-sm ${
                                selectedPlatform === p.id 
                                ? 'bg-[#BD00FF]/10 border-[#BD00FF] text-white shadow-[0_0_20px_rgba(189,0,255,0.15)]' 
                                : 'bg-white/[0.01] border-white/5 text-zinc-500 hover:border-white/20'
                              }`}
                            >
                               <p.icon size={18} className={selectedPlatform === p.id ? 'text-[#BD00FF]' : ''} />
                               <span className="font-headline text-[13px] font-black uppercase italic tracking-wider">{p.label}</span>
                               {selectedPlatform === p.id && <div className="ml-auto w-1.5 h-1.5 bg-[#BD00FF] rounded-full animate-pulse-led" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <h2 className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] block font-bold">NEURAL_CONFIGURATION</h2>
                          <DatabaseIcon size={16} className="text-[#BD00FF] opacity-30" />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold block italic">{t('LANGUAGE')}</label>
                             <div className="grid grid-cols-1 gap-2">
                                {LANGUAGES.map(lang => (
                                  <button
                                    key={lang.id}
                                    onClick={() => setSelectedLanguage(lang.id)}
                                    className={`px-4 py-4 font-data-mono text-[10px] font-black transition-all border clipped-corner-sm flex justify-between items-center ${
                                      selectedLanguage === lang.id
                                        ? 'bg-[#BD00FF]/20 border-[#BD00FF] text-white shadow-[0_0_15px_rgba(189,0,255,0.2)]'
                                        : 'text-zinc-500 border-white/5 bg-white/[0.01] hover:border-white/20'
                                    }`}
                                  >
                                    <span className="uppercase">{lang.label}</span>
                                    {selectedLanguage === lang.id && <CheckCircle2 size={12} className="text-[#BD00FF]" />}
                                  </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold block italic">{t('VOICE_GENDER')}</label>
                             <div className="grid grid-cols-1 gap-2">
                                {(['AUTO', 'MALE', 'FEMALE'] as const).map((gender) => (
                                  <button
                                    key={gender}
                                    onClick={() => setVoiceGender(gender)}
                                    className={`px-4 py-4 font-data-mono text-[10px] font-black transition-all border clipped-corner-sm flex justify-between items-center ${
                                      voiceGender === gender 
                                        ? 'bg-[#BD00FF] text-black shadow-[0_0_15px_rgba(189,0,255,0.4)] border-[#BD00FF]' 
                                        : 'text-zinc-500 border-white/5 bg-white/[0.01] hover:border-white/20'
                                    }`}
                                  >
                                    <span className="uppercase">{t(gender)}</span>
                                    {voiceGender === gender && <Zap size={12} className="text-black" />}
                                  </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-12 relative z-10">
                 <button 
                   disabled={isGenerating || !prompt.trim()}
                   onClick={handleGenerate}
                   className="btn-kinetic btn-kinetic-primary w-full group py-8"
                 >
                    <span className="text-2xl">{isGenerating ? 'EXECUTING_CYCLES...' : 'INITIATE_PRODUCTION_BURST'}</span>
                    {!isGenerating && <Play size={28} className="fill-current" />}
                    <div className="absolute bottom-0 left-0 h-1 bg-[#BD00FF] w-0 group-hover:w-full transition-all duration-1000" />
                 </button>
              </div>
           </section>

           {/* Live Node Monitoring Log */}
           <section className="panel-kinetic p-8 space-y-6 clipped-corner border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-[#6bff83]" />
                    <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">LIVE_NODE_TELEMETRY</h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="font-data-mono text-[9px] text-[#6bff83] font-bold tracking-widest uppercase italic">UPLINK_STABLE</span>
                    <div className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse-led" />
                 </div>
              </div>
              <div className="space-y-3 font-data-mono text-[11px] max-h-[160px] overflow-y-auto custom-scrollbar">
                 {orders.length > 0 ? orders.slice(0, 5).map((order, i) => (
                   <div key={i} className="flex gap-6 p-3 bg-white/[0.01] border-l-2 border-zinc-800 hover:border-[#BD00FF] transition-all group">
                      <span className="text-zinc-600 shrink-0 font-bold">[{new Date(order.created_at).toLocaleTimeString()}]</span>
                      <span className="text-zinc-400 truncate group-hover:text-white transition-colors">
                        PATH_EXEC: {order.topic || order.title} // LANG: <span className="text-[#00f5ff]">{order.language || 'EN'}</span> // STATUS: <span className={order.status === 'completed' ? 'text-[#6bff83]' : 'text-[#BD00FF]'}>{order.status.toUpperCase()}</span>
                      </span>
                   </div>
                 )) : (
                   <div className="text-zinc-700 italic lowercase flex items-center gap-3">
                      <Activity size={12} className="animate-pulse" />
                      listening for neural pulse...
                   </div>
                 )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
