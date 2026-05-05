import React, { useState, useEffect } from 'react';
import { 
  Zap, Video, MessageSquare, Bot, 
  Settings2, Activity, Globe, Info,
  Search, TrendingUp, Sparkles, Send,
  Cpu, Languages, Target, Mic2, Music2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useI18nStore } from '../store/i18nStore';

export default function CreateOrder() {
  const { t } = useI18nStore();
  const { trends, fetchTrends, queueProduction } = usePipelineStore();
  const [topic, setTopic] = useState('');
  const [selectedVoices, setSelectedVoices] = useState<string[]>(['josh']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'topic' | 'template' | 'auto'>('topic');

  useEffect(() => {
    fetchTrends(['US'], ['en']);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsSubmitting(true);
    try {
      await queueProduction({
        topic,
        voice_ids: selectedVoices,
        action: 'viranode-generate'
      });
      setTopic('');
    } finally {
      setIsSubmitting(null as any);
      setIsSubmitting(false);
    }
  };

  const voices = [
    { id: 'josh', name: 'Josh (Pro)', type: 'Narrator', quality: 'Ultra' },
    { id: 'bella', name: 'Bella (Soft)', type: 'Narrator', quality: 'Premium' },
    { id: 'antoni', name: 'Antoni (Deep)', type: 'Character', quality: 'Ultra' },
    { id: 'elli', name: 'Elli (Energetic)', type: 'Narrator', quality: 'Premium' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Zap size={18} className="animate-pulse" />
            INITIATE_PRODUCTION_SEQUENCE
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            Forge_<span className="text-[#b1cdb7]">Order</span>
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Creation Core - Panel System */}
        <div className="lg:col-span-8 space-y-10">
           <section className="bg-[#1b1c1a] border border-[#424843] p-12 rounded-soft-xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#b1cdb7]/5 blur-[60px] rounded-full" />
              
              <div className="flex bg-[#131412] p-2 rounded-soft-lg border border-[#424843] mb-12 w-fit">
                {[
                  { id: 'topic', label: 'Manual_Topic', icon: MessageSquare },
                  { id: 'template', label: 'Neural_Template', icon: Layers },
                  { id: 'auto', label: 'AI_Autonomous', icon: Sparkles },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 px-8 py-4 rounded-soft font-label-sm text-[11px] font-bold uppercase tracking-widest transition-all italic ${
                      activeTab === tab.id 
                        ? 'bg-[#2d4535] text-[#b1cdb7] shadow-lg' 
                        : 'text-[#8c928c] hover:text-[#e4e2e0]'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCreate} className="space-y-10 relative z-10">
                 <div className="space-y-6">
                    <label className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-[0.3em] italic opacity-40">PRODUCTION_TOPIC_INPUT</label>
                    <div className="relative group">
                       <input 
                         type="text"
                         value={topic}
                         onChange={(e) => setTopic(e.target.value)}
                         placeholder="Enter cinematic prompt or viral hook..."
                         className="w-full bg-[#131412] border border-[#424843] rounded-soft-xl p-8 text-lg font-bold text-[#e4e2e0] focus:ring-1 focus:ring-[#b1cdb7]/30 focus:border-[#b1cdb7] outline-none transition-all placeholder:text-[#e4e2e0]/5"
                       />
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                          <button type="button" className="p-3 text-[#8c928c] hover:text-[#b1cdb7] transition-all"><Mic2 size={20} /></button>
                          <div className="w-[1px] h-6 bg-[#424843]" />
                          <button type="button" className="p-3 text-[#8c928c] hover:text-[#b1cdb7] transition-all"><Music2 size={20} /></button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <label className="font-label-sm text-[11px] text-[#8c928c] uppercase font-bold tracking-[0.3em] italic opacity-40">VOCAL_SYNTHESIS_NODES</label>
                       <span className="text-[10px] text-[#b1cdb7] font-bold italic uppercase tracking-widest">{selectedVoices.length} Node(s) Selected</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {voices.map(voice => (
                         <button
                           key={voice.id}
                           type="button"
                           onClick={() => setSelectedVoices(prev => prev.includes(voice.id) ? prev.filter(v => v !== voice.id) : [...prev, voice.id])}
                           className={`p-6 rounded-soft-xl border transition-all flex items-center justify-between group/voice ${
                             selectedVoices.includes(voice.id)
                               ? 'bg-[#2d4535] border-[#b1cdb7]/30'
                               : 'bg-[#131412] border-[#424843] hover:border-[#b1cdb7]/40'
                           }`}
                         >
                            <div className="flex items-center gap-5 text-left">
                               <div className={`w-12 h-12 rounded-soft border flex items-center justify-center transition-all ${
                                 selectedVoices.includes(voice.id) ? 'bg-[#b1cdb7] text-[#1d3526]' : 'bg-[#1b1c1a] border-[#424843] text-[#8c928c]'
                               }`}>
                                  <Mic2 size={20} />
                               </div>
                               <div>
                                  <p className={`text-sm font-bold uppercase tracking-tight italic ${selectedVoices.includes(voice.id) ? 'text-[#e4e2e0]' : 'text-[#8c928c]'}`}>{voice.name}</p>
                                  <p className="font-label-sm text-[9px] text-[#8c928c] uppercase tracking-widest opacity-60">{voice.type} // {voice.quality}</p>
                               </div>
                            </div>
                            {selectedVoices.includes(voice.id) && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#b1cdb7] flex items-center justify-center">
                                 <Sparkles size={10} className="text-[#1d3526]" />
                              </motion.div>
                            )}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isSubmitting || !topic}
                   className={`w-full py-6 rounded-soft-xl font-label-sm text-[13px] font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl italic ${
                     isSubmitting || !topic
                       ? 'bg-[#1b1c1a] border border-[#424843] text-[#8c928c] cursor-not-allowed opacity-50'
                       : 'bg-[#b1cdb7] text-[#1d3526] hover:brightness-110 active:scale-[0.99] shadow-[#b1cdb7]/10'
                   }`}
                 >
                    {isSubmitting ? (
                      <>Processing_Neural_Load <Activity size={20} className="animate-spin" /></>
                    ) : (
                      <>Execute_Production_Sequence <Send size={20} /></>
                    )}
                 </button>
              </form>
           </section>
        </div>

        {/* Trend Pulse Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
           <div className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#424843] pb-6">
                 <div className="flex items-center gap-4 text-[#b1cdb7]">
                    <TrendingUp size={22} />
                    <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] italic">Trend_Pulse</h3>
                 </div>
                 <span className="text-[10px] text-[#8c928c] font-bold italic opacity-40 uppercase tracking-widest">Global_v4</span>
              </div>

              <div className="space-y-6">
                 {trends.slice(0, 5).map((trend, i) => (
                   <button 
                     key={i}
                     onClick={() => setTopic(trend.topic)}
                     className="w-full p-6 bg-[#131412] border border-[#424843] rounded-soft-lg hover:border-[#b1cdb7]/40 text-left transition-all group"
                   >
                      <div className="flex justify-between items-start mb-3">
                         <span className="font-label-sm text-[10px] text-[#b1cdb7] font-bold uppercase tracking-widest italic">{trend.score || '88'} Score</span>
                         <ArrowUpRight size={14} className="text-[#8c928c] group-hover:text-[#b1cdb7] transition-all" />
                      </div>
                      <p className="text-sm font-bold text-[#e4e2e0] uppercase italic tracking-tight group-hover:text-[#b1cdb7] transition-colors line-clamp-1">{trend.topic}</p>
                   </button>
                 ))}
                 <div className="pt-4">
                    <button className="w-full py-4 border border-dashed border-[#424843] text-[#8c928c] hover:text-[#b1cdb7] hover:border-[#b1cdb7]/30 rounded-soft-lg font-label-sm text-[11px] font-bold uppercase tracking-widest transition-all italic">
                       Rescan_Global_Sectors
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-[#b1cdb7]/5 border border-[#b1cdb7]/10 rounded-soft-xl space-y-4">
              <div className="flex items-center gap-4 text-[#b1cdb7]">
                 <Info size={18} />
                 <span className="font-label-sm text-[10px] font-bold uppercase tracking-[0.2em] italic">System_Guidance</span>
              </div>
              <p className="font-body-md text-[13px] text-[#8c928c] leading-relaxed italic">
                The "Execute_Production_Sequence" trigger initiates a multi-stage neural render process. Total synthesis time varies based on voice density and asset complexity.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
