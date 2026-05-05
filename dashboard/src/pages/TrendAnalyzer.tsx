import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  TrendingUp, Activity, Globe, Zap, 
  Terminal, Shield, Cpu, Radar,
  Maximize2, ArrowUpRight, Search
} from 'lucide-react';

export default function TrendRadar() {
  const { trends = [], fetchTrends, subscribeToChanges } = usePipelineStore();
  const [activeSignal, setActiveSignal] = useState<any>(null);

  useEffect(() => {
    fetchTrends();
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, []);

  const safeTrends = Array.isArray(trends) ? trends : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-[#BD00FF] font-data-mono text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">
            <Radar size={14} className="animate-pulse" />
            GLOBAL_TREND_INTERCEPTION_ARRAY
          </div>
          <h1 className="font-headline text-[56px] font-[900] tracking-[-0.04em] leading-[0.9] text-white uppercase italic">
            TREND_RADAR
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Signals/Sec</span>
              <span className="font-headline text-4xl font-black text-[#6bff83] italic">1,422</span>
           </div>
           <div className="bg-[#0A0A0B] border border-white/10 p-6 flex flex-col min-w-[200px]">
              <span className="font-label-caps text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Neural Load</span>
              <span className="font-headline text-4xl font-black text-[#00f5ff] italic">42%</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Radar Map */}
        <section className="col-span-12 lg:col-span-8 bg-[#0A0A0B] border border-white/10 relative overflow-hidden group min-h-[600px]">
           <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(189,0,255,0.05)_0%,_transparent_70%)]" />
           
           <div className="p-8 flex justify-between items-center border-b border-white/5 relative z-10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <Globe size={18} className="text-[#BD00FF]" />
                 <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">NEURAL_HEATMAP_v1.2</h2>
              </div>
              <div className="flex gap-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                 ))}
              </div>
           </div>

           {/* Visualization Area */}
           <div className="relative h-full flex items-center justify-center p-20">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Radar Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[300px] h-[300px] border border-white/5 rounded-full" />
                 <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
                 <div className="w-[900px] h-[900px] border border-white/5 rounded-full" />
                 {/* Radar Beam */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#BD00FF]/20 to-transparent origin-center rounded-full"
                   style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}
                 />
              </div>

              {/* Trend Nodes */}
              {safeTrends.slice(0, 12).map((trend, i) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                    position: 'absolute',
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`
                  }}
                  className="group cursor-pointer z-20"
                  onClick={() => setActiveSignal(trend)}
                >
                   <div className="relative">
                      <div className="w-4 h-4 bg-[#BD00FF] rounded-full animate-ping opacity-20 absolute inset-0" />
                      <div className="w-4 h-4 bg-[#BD00FF] border-2 border-white/20 rounded-full group-hover:scale-150 transition-all shadow-[0_0_15px_#BD00FF]" />
                      <div className="absolute left-6 top-0 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 opacity-0 group-hover:opacity-100 transition-all pointer-events-none min-w-[150px]">
                         <p className="font-data-mono text-[9px] text-[#BD00FF] uppercase font-black">{trend.growth_stat || '+124%'}</p>
                         <p className="font-headline text-xs font-bold text-white uppercase italic truncate">{trend.title}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Right Panel: Intercepted Signals */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
           <section className="bg-[#0A0A0B] border border-white/10 p-8 flex flex-col h-full max-h-[800px]">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-3">
                    <Zap size={18} className="text-[#6bff83]" />
                    <h2 className="font-label-caps text-xs font-bold text-white uppercase tracking-widest">LIVE_INTERCEPT_FEED</h2>
                 </div>
                 <div className="bg-[#6bff83]/10 px-2 py-1 border border-[#6bff83]/20">
                    <span className="font-data-mono text-[9px] text-[#6bff83] font-black animate-pulse">SCANNING</span>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-4">
                 {safeTrends.map((trend, i) => (
                   <motion.div 
                     key={trend.id}
                     whileHover={{ x: 5 }}
                     className="p-4 bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-[#BD00FF]/30 transition-all cursor-pointer"
                   >
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-data-mono text-[9px] text-zinc-600 uppercase">0x{i.toString(16).toUpperCase()}</span>
                            <span className="font-data-mono text-[9px] text-[#6bff83] font-black uppercase tracking-widest">{trend.growth_stat || '+88%'}</span>
                         </div>
                         <h4 className="font-headline text-md font-bold text-white uppercase italic truncate group-hover:text-[#BD00FF] transition-colors">
                            {trend.title}
                         </h4>
                      </div>
                      <ArrowUpRight size={16} className="text-zinc-800 group-hover:text-[#BD00FF] transition-colors" />
                   </motion.div>
                 ))}
                 {safeTrends.length === 0 && (
                   <div className="p-20 text-center text-zinc-800 font-data-mono uppercase text-xs">
                      No signals detected in sector.
                   </div>
                 )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                 <div className="p-6 bg-[#BD00FF]/5 border border-[#BD00FF]/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-4">
                       <Shield size={16} className="text-[#BD00FF]" />
                       <span className="font-label-caps text-[10px] font-bold text-white uppercase tracking-widest">AI_PREDICTION_ENGINE</span>
                    </div>
                    <p className="font-data-mono text-[11px] text-zinc-400 uppercase italic leading-relaxed">
                       "Pattern 'CYBER_FLUX' is converging with 'Y2K_RETRO'. Optimal production window: 12-24H."
                    </p>
                    <button className="w-full mt-6 py-3 bg-[#BD00FF] text-black font-headline font-black uppercase italic text-[11px] hover:shadow-[0_0_15px_#BD00FF] transition-all">
                       FEED_THE_ENGINE
                    </button>
                 </div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}
