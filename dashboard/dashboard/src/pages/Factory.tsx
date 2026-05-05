import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Settings2, Download, Share2, Layers,
  Cpu, Zap, Activity, Box, Maximize2,
  Volume2, Film, Timer, History, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { useI18nStore } from '../store/i18nStore';

export default function Factory() {
  const { t } = useI18nStore();
  const { activeProduction, queueProduction } = usePipelineStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (activeProduction?.status === 'processing') {
      const interval = setInterval(() => {
        setProgress(p => (p < 100 ? p + 0.5 : 0));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeProduction]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#bec9bf] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Cpu size={18} className="animate-pulse" />
            LAB_01 // PRODUCTION_READY
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            The_<span className="text-[#b1cdb7]">Factory</span>
          </h1>
        </div>
        
        <div className="flex bg-[#1b1c1a] border border-[#424843] p-3 rounded-soft-lg gap-3 shadow-sm">
           <div className="px-6 py-4 border-r border-[#424843] flex flex-col gap-1">
              <span className="font-label-sm text-[9px] text-[#8c928c] uppercase font-bold italic opacity-40">NODE_STATUS</span>
              <span className="text-[11px] font-bold text-[#b1cdb7] uppercase tracking-widest italic">SYNCHRONIZED</span>
           </div>
           <div className="px-6 py-4 flex flex-col gap-1">
              <span className="font-label-sm text-[9px] text-[#8c928c] uppercase font-bold italic opacity-40">ACTIVE_LOAD</span>
              <span className="text-[11px] font-bold text-[#e4e2e0] uppercase tracking-widest italic">42% GPU</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Production Monitor - Canvas Frame */}
        <div className="lg:col-span-8 space-y-8">
           <div className="aspect-video bg-[#0d0e0d] border border-[#424843] rounded-soft-xl relative overflow-hidden group shadow-2xl">
              {/* Scanline & Grain Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 {activeProduction ? (
                   <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center bg-[#131412]/60 backdrop-blur-sm z-10">
                         <div className="text-center space-y-8 w-full max-w-md px-10">
                            <div className="relative">
                               <Box size={80} className="text-[#b1cdb7] mx-auto animate-mist opacity-20" />
                               <Activity size={40} className="absolute inset-0 m-auto text-[#b1cdb7] animate-spin-slow" />
                            </div>
                            <div className="space-y-4">
                               <div className="flex justify-between font-label-sm text-[10px] font-bold italic tracking-[0.2em] text-[#b1cdb7]">
                                  <span>SYNTHESIZING_NODE</span>
                                  <span>{Math.round(progress)}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-[#1b1c1a] border border-[#424843] rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-[#b1cdb7] shadow-[0_0_15px_#b1cdb7]"
                                  />
                               </div>
                               <p className="font-label-sm text-[10px] text-[#8c928c] uppercase tracking-widest font-bold italic opacity-60">
                                  {activeProduction.title || 'Awaiting Metadata...'}
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center space-y-8 p-12">
                      <div className="w-24 h-24 rounded-soft-xl bg-[#1b1c1a] border border-[#424843] flex items-center justify-center mx-auto group-hover:border-[#b1cdb7]/40 transition-all">
                         <Film size={40} className="text-[#8c928c]/20 group-hover:text-[#b1cdb7]/40 transition-all" />
                      </div>
                      <p className="font-label-sm text-xs uppercase tracking-[0.5em] text-[#8c928c] font-bold italic opacity-40">System_Idle // Awaiting_Dispatch</p>
                   </div>
                 )}
              </div>

              {/* Viewport UI Overlay */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center z-20">
                 <div className="flex items-center gap-6 bg-[#131412]/80 backdrop-blur-md px-6 py-4 border border-[#424843] rounded-soft-lg shadow-xl">
                    <button className="text-[#8c928c] hover:text-[#e4e2e0] transition-all"><SkipBack size={20} /></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 flex items-center justify-center bg-[#b1cdb7] text-[#1d3526] rounded-soft shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                       {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    <button className="text-[#8c928c] hover:text-[#e4e2e0] transition-all"><SkipForward size={20} /></button>
                 </div>
                 <div className="flex items-center gap-4 bg-[#131412]/80 backdrop-blur-md px-6 py-4 border border-[#424843] rounded-soft-lg text-[#b1cdb7] font-label-sm text-[11px] font-bold tracking-widest italic shadow-xl">
                    <Timer size={18} />
                    00:42:15:08
                 </div>
              </div>
           </div>

           {/* Neural Input Interface */}
           <div className="p-10 bg-[#1b1c1a] border border-[#424843] rounded-soft-xl space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                 <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.3em] text-[#e4e2e0] italic">Production_Metadata</h3>
                 <button className="text-[#8c928c] hover:text-[#b1cdb7] transition-all"><Settings2 size={20} /></button>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic opacity-40">SYNTHESIS_MODEL</span>
                    <div className="p-5 bg-[#131412] border border-[#424843] rounded-soft-lg text-[#e4e2e0] font-label-sm text-[12px] font-bold italic tracking-widest">
                       GPT-4o_NEURAL_v2
                    </div>
                 </div>
                 <div className="space-y-4">
                    <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic opacity-40">RESOLUTION_PROTOCOL</span>
                    <div className="p-5 bg-[#131412] border border-[#424843] rounded-soft-lg text-[#e4e2e0] font-label-sm text-[12px] font-bold italic tracking-widest">
                       1080x1920 // VERTICAL_CINEMA
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Console: Production Log */}
        <aside className="lg:col-span-4 space-y-8">
           <div className="panel-naturalist p-8 h-full min-h-[600px] flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#424843]">
                 <div className="flex items-center gap-4 text-[#b1cdb7]">
                    <Activity size={20} />
                    <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] italic">Dispatch_Console</h3>
                 </div>
                 <span className="px-3 py-1 bg-[#2d4535] text-[#b1cdb7] text-[9px] font-bold uppercase tracking-widest rounded-soft-sm italic">LIVE_FEED</span>
              </div>

              <div className="flex-1 space-y-6 font-label-sm text-[11px] overflow-y-auto custom-scrollbar pr-4">
                 {[
                   { time: '20:15:02', msg: 'System integrity verified.', type: 'info' },
                   { time: '20:15:05', msg: 'Neural bridge established.', type: 'info' },
                   { time: '20:15:10', msg: 'Awaiting production packet...', type: 'warn' },
                   { time: '20:16:00', msg: 'Style update detected: NATURALIST_v2', type: 'success' },
                   { time: '20:16:01', msg: 'Re-rendering layout modules...', type: 'info' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-4 group">
                      <span className="text-[#8c928c] opacity-30 font-bold italic whitespace-nowrap">{log.time}</span>
                      <span className={`italic font-bold tracking-tight ${
                        log.type === 'success' ? 'text-[#b1cdb7]' : log.type === 'warn' ? 'text-[#bec9bf]' : 'text-[#8c928c]'
                      }`}>
                        {log.msg}
                      </span>
                   </div>
                 ))}
                 <div className="animate-pulse flex gap-4">
                    <span className="text-[#b1cdb7] font-bold italic">_</span>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#424843]">
                 <button 
                   className="w-full py-5 bg-[#b1cdb7] text-[#1d3526] rounded-soft-lg font-label-sm text-[12px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-[#b1cdb7]/10 hover:brightness-110 transition-all italic flex items-center justify-center gap-4"
                 >
                    <RefreshCcw size={20} />
                    Recalibrate_Node
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
