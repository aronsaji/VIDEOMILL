import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, PenTool, Layers, Cpu, 
  Settings2, Activity, Shield, 
  ChevronRight, Play, Globe, 
  Sparkles, History, CheckCircle2, 
  AlertCircle, Clock, Database, Radio,
  Terminal, Box, ArrowUpRight, Plus,
  Volume2, Maximize2, SkipBack, SkipForward,
  Type, Image as ImageIcon, Music, Film,
  Share2, Download, Trash2, Save
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { useI18nStore } from '../store/i18nStore';

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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const payload = {
      action: 'viranode-generate',
      topic: prompt,
      language: selectedLanguage,
      voice: selectedVoice,
      title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '')
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

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex justify-between items-center bg-surface p-6 border border-outline rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-6 w-[2px] bg-[#4169E1]" />
          <h1 className="text-xl font-black text-[#1E3A8A] uppercase tracking-[0.2em] italic">
            Production_Lab_<span className="text-[#4169E1]">V14.4</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 bg-surface-container text-[#4169E1] hover:text-[#1E3A8A] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic border border-outline/50">
            Archive_Drafts
          </button>
          <button className="px-8 py-3 bg-[#4169E1] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#4169E1]/20 hover:brightness-110 transition-all italic">
            Manifest_Project
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        <div className="col-span-1 bg-surface border border-outline rounded-[2.5rem] flex flex-col items-center py-10 gap-10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#4169E1]/5 to-transparent" />
          {[
            { icon: Type, label: 'Text' },
            { icon: ImageIcon, label: 'Media' },
            { icon: Music, label: 'Audio' },
            { icon: Layers, label: 'Scenes' },
            { icon: Sparkles, label: 'AI' },
            { icon: Settings2, label: 'Config' }
          ].map((item, i) => (
            <button key={i} className="group relative flex flex-col items-center gap-3">
              <div className="p-4 text-on-surface-variant/40 group-hover:text-[#4169E1] group-hover:bg-[#4169E1]/10 rounded-2xl transition-all border border-transparent group-hover:border-[#4169E1]/20 shadow-sm group-hover:shadow-[#4169E1]/10">
                <item.icon size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/20 group-hover:text-[#4169E1] transition-colors italic">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="col-span-8 flex flex-col gap-8 overflow-hidden">
          <div className="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-[3.5rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
              <div className="px-5 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Live_Render_Output</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(65,105,225,0.05)_0%,transparent_70%)]" />
              {isGenerating ? (
                <div className="flex flex-col items-center gap-10">
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-[#4169E1]/10 border-t-[#4169E1] rounded-full animate-spin shadow-[0_0_30px_rgba(65,105,225,0.15)]" />
                    <Zap size={48} className="absolute inset-0 m-auto text-[#4169E1] animate-pulse" />
                  </div>
                  <div className="text-center space-y-4">
                    <p className="text-3xl font-black text-white font-headline-md uppercase italic tracking-tighter animate-pulse">Synthesizing_Neural_Frames...</p>
                    <p className="text-[#4169E1] font-mono text-xs uppercase tracking-[0.5em] font-black italic opacity-60">RTX_4080_GRID_ACTIVE</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 max-w-xl px-12 relative z-10">
                   <Box size={100} className="mx-auto text-white/[0.03]" />
                   <h2 className="text-5xl font-black text-white font-headline-md uppercase italic tracking-tighter leading-tight">Initiate_New_Sequence</h2>
                   <p className="text-white/30 font-mono text-xs uppercase tracking-[0.3em] leading-relaxed italic font-black">
                     Input your prompt into the neural field to trigger the autonomous production node. Multi-GPU clusters are standing by.
                   </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-2xl border border-white/10 px-10 py-5 rounded-[2rem] flex items-center gap-10 shadow-2xl">
               <button className="text-white/30 hover:text-[#4169E1] transition-all hover:scale-110"><SkipBack size={20} /></button>
               <button className="w-14 h-14 bg-[#4169E1] text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-[#4169E1]/30">
                 <Play size={28} fill="currentColor" />
               </button>
               <button className="text-white/30 hover:text-[#4169E1] transition-all hover:scale-110"><SkipForward size={20} /></button>
               <div className="h-6 w-[1px] bg-white/10" />
               <div className="flex items-center gap-4 text-white/30 group/vol">
                 <Volume2 size={20} className="group-hover/vol:text-[#4169E1] transition-colors" />
                 <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div className="w-2/3 h-full bg-[#4169E1] shadow-[0_0_10px_rgba(65,105,225,0.5)]" />
                 </div>
               </div>
               <button className="text-white/30 hover:text-[#4169E1] transition-all hover:scale-110"><Maximize2 size={20} /></button>
            </div>
          </div>

          <div className="h-56 bg-surface border border-outline rounded-[3rem] p-8 flex flex-col gap-6 shadow-sm">
             <div className="flex justify-between items-center border-b border-outline pb-4">
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] italic opacity-40">Timeline_Sequencer</span>
                <span className="text-[11px] font-mono text-[#4169E1] font-black italic tracking-widest bg-[#4169E1]/5 px-4 py-1.5 rounded-full border border-[#4169E1]/10 shadow-inner">00:00:00:00</span>
             </div>
             <div className="flex-1 flex gap-6 overflow-x-auto custom-scrollbar pb-4 px-2">
                {orders.slice(0, 8).map((order, i) => (
                  <div key={i} className="flex-none w-56 h-full bg-surface-container rounded-2xl border border-outline p-6 flex flex-col justify-between group hover:border-[#4169E1]/40 transition-all cursor-pointer shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#4169E1]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start relative z-10">
                      <span className="text-[10px] font-black text-on-surface-variant/20 uppercase tracking-widest font-mono">NODE_{i+1}</span>
                      {order.status === 'completed' ? <CheckCircle2 size={16} className="text-success" /> : <Clock size={16} className="text-[#4169E1] animate-pulse" />}
                    </div>
                    <p className="text-[12px] font-black text-[#1E3A8A] uppercase italic truncate mb-3 relative z-10">{order.title || order.topic || 'Untitled_Node'}</p>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden border border-outline/10 shadow-inner">
                       <div className={`h-full bg-[#4169E1] transition-all duration-1000 shadow-[0_0_8px_rgba(65,105,225,0.3)]`} style={{ width: `${order.progress || 0}%` }} />
                    </div>
                  </div>
                ))}
                <button className="flex-none w-56 h-full border-2 border-dashed border-outline rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#4169E1]/40 hover:bg-[#4169E1]/5 transition-all text-on-surface-variant/20 hover:text-[#4169E1] group/add">
                   <Plus size={32} className="group-hover/add:rotate-90 transition-transform duration-500" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Add_Scene</span>
                </button>
             </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-8 overflow-hidden">
           <div className="flex-1 bg-surface border border-outline rounded-[3rem] p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4169E1]/20 to-transparent" />
              <section className="space-y-6">
                <h3 className="text-xs font-black text-[#1E3A8A] uppercase tracking-[0.3em] italic">Neural_Input</h3>
                <div className="relative group">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision..."
                    className="w-full h-48 bg-surface-container border border-outline rounded-3xl p-6 text-sm text-[#1E3A8A] placeholder:text-[#1E3A8A]/10 focus:outline-none focus:border-[#4169E1]/50 transition-all resize-none font-mono font-black italic shadow-inner"
                  />
                  <button className="absolute bottom-6 right-6 p-3 bg-[#4169E1]/10 text-[#4169E1] rounded-2xl hover:bg-[#4169E1] hover:text-white transition-all shadow-xl shadow-[#4169E1]/10">
                    <Sparkles size={20} />
                  </button>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest italic opacity-40">Format_Matrix</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['TikTok', 'YouTube', 'Reels', 'Shorts'].map(p => (
                    <button key={p} className="py-4 bg-surface-container border border-outline rounded-2xl text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:bg-[#4169E1]/10 hover:text-[#4169E1] hover:border-[#4169E1]/30 transition-all shadow-sm italic">
                      {p}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest italic opacity-40">Voice_Synthesis</h3>
                <div className="space-y-4">
                   {['Male_Premium', 'Female_Cinematic', 'Deep_Neural'].map(v => (
                     <button key={v} className="w-full py-5 px-6 bg-surface-container border border-outline rounded-2xl flex items-center justify-between group hover:border-[#4169E1]/30 hover:bg-surface transition-all shadow-sm">
                       <span className="text-[11px] font-black text-on-surface-variant group-hover:text-[#1E3A8A] uppercase tracking-widest italic">{v}</span>
                       <div className="w-2.5 h-2.5 rounded-full bg-outline group-hover:bg-[#4169E1] group-hover:shadow-[0_0_12px_rgba(65,105,225,0.6)] transition-all" />
                     </button>
                   ))}
                </div>
              </section>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-10 bg-[#4169E1] text-white font-black uppercase tracking-[0.4em] italic rounded-[2rem] shadow-2xl shadow-[#4169E1]/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 mt-auto text-sm"
              >
                {isGenerating ? 'Dispatching...' : 'Execute_Render'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
