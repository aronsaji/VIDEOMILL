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
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-4 w-[1px] bg-slate-200" />
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">
            Production_Lab_<span className="text-primary-container">V14.4</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
            Drafts
          </button>
          <button className="px-6 py-2 bg-primary-container text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all">
            Save Project
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-1 bg-white border border-slate-200 rounded-2xl flex flex-col items-center py-6 gap-8 shadow-sm">
          {[
            { icon: Type, label: 'Text' },
            { icon: ImageIcon, label: 'Media' },
            { icon: Music, label: 'Audio' },
            { icon: Layers, label: 'Scenes' },
            { icon: Sparkles, label: 'AI' },
            { icon: Settings2, label: 'Config' }
          ].map((item, i) => (
            <button key={i} className="group relative flex flex-col items-center gap-2">
              <div className="p-3 text-slate-400 group-hover:text-primary-container group-hover:bg-cyan-50 rounded-xl transition-all">
                <item.icon size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 group-hover:text-primary-container transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-slate-900 border border-slate-200 rounded-[2rem] relative overflow-hidden group shadow-xl">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Live_Render</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
                    <Zap size={32} className="absolute inset-0 m-auto text-primary-container animate-pulse" />
                  </div>
                  <p className="text-xl font-black text-white font-headline-md uppercase italic tracking-tighter animate-pulse">Synthesizing_Neural_Frames...</p>
                </div>
              ) : (
                <div className="text-center space-y-6 max-w-lg px-10">
                   <Box size={80} className="mx-auto text-white/10" />
                   <h2 className="text-3xl font-black text-white font-headline-md uppercase italic tracking-tighter leading-tight">Initiate_New_Sequence</h2>
                   <p className="text-slate-400 font-mono text-[11px] uppercase tracking-widest leading-relaxed">
                     Input your prompt below to trigger the autonomous production node. Our RTX-4080 core will handle rendering.
                   </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-8 shadow-2xl">
               <button className="text-white/40 hover:text-white transition-colors"><SkipBack size={18} /></button>
               <button className="w-12 h-12 bg-primary-container text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                 <Play size={24} fill="currentColor" />
               </button>
               <button className="text-white/40 hover:text-white transition-colors"><SkipForward size={18} /></button>
               <div className="h-4 w-[1px] bg-white/10" />
               <div className="flex items-center gap-3 text-white/40">
                 <Volume2 size={18} />
                 <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-2/3 h-full bg-primary-container" />
                 </div>
               </div>
               <button className="text-white/40 hover:text-white transition-colors"><Maximize2 size={18} /></button>
            </div>
          </div>

          <div className="h-48 bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline_Sequencer</span>
                <span className="text-[9px] font-mono text-primary-container font-black">00:00:00:00</span>
             </div>
             <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                {orders.slice(0, 8).map((order, i) => (
                  <div key={i} className="flex-none w-40 h-full bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-between group hover:border-primary-container/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">S_{i+1}</span>
                      {order.status === 'completed' ? <CheckCircle2 size={12} className="text-[#10b981]" /> : <Clock size={12} className="text-primary-container animate-pulse" />}
                    </div>
                    <p className="text-[10px] font-black text-slate-900 uppercase italic truncate">{order.title || 'Untitled_Node'}</p>
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full bg-primary-container transition-all duration-1000`} style={{ width: `${order.progress || 0}%` }} />
                    </div>
                  </div>
                ))}
                <button className="flex-none w-40 h-full border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-container/30 hover:bg-slate-50 transition-all text-slate-300 hover:text-primary-container">
                   <Plus size={24} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Add Scene</span>
                </button>
             </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar shadow-sm">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">Neural_Input</h3>
                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision..."
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-300 focus:outline-none focus:border-primary-container/50 transition-all resize-none font-mono"
                  />
                  <button className="absolute bottom-3 right-3 p-2 bg-cyan-50 text-primary-container rounded-lg hover:bg-primary-container hover:text-white transition-all">
                    <Sparkles size={14} />
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Output_Profile</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['TikTok', 'YouTube', 'Reels', 'Shorts'].map(p => (
                    <button key={p} className="py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voice_Synthesis</h3>
                <div className="space-y-2">
                   {['Male_Premium', 'Female_Cinematic', 'Deep_Neural'].map(v => (
                     <button key={v} className="w-full py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-primary-container/30 transition-all">
                       <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">{v}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary-container" />
                     </button>
                   ))}
                </div>
              </section>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-6 bg-primary-container text-white font-black uppercase tracking-[0.2em] italic rounded-2xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-auto"
              >
                {isGenerating ? 'Dispatching...' : 'Execute_Render'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
