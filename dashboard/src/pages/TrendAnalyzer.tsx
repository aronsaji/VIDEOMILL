import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { 
  TrendingUp, Activity, Globe, Zap, 
  Terminal, Shield, Cpu, Radar,
  Maximize2, ArrowUpRight, Search
} from 'lucide-react';

export default function TrendRadar() {
  const { trends = [], fetchTrends, subscribeToChanges } = usePipelineStore();
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const LANGUAGES = [
    { id: 'Norsk', label: 'Norway (Norsk)' },
    { id: 'English', label: 'UK/USA (English)' },
    { id: 'Español', label: 'Spain (Español)' },
  ];

  useEffect(() => {
    fetchTrends();
    const unsubscribe = subscribeToChanges();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchTrends, subscribeToChanges]);

  const safeTrends = Array.isArray(trends) ? trends : [];

  const handleFeedEngine = async (trend: any) => {
    if (!trend) return;
    setIsProcessing(true);
    try {
      const success = await triggerProduction({
        action: 'viranode-generate',
        topic: trend.title,
        language: selectedLanguage,
        source: 'TREND_RADAR_INTERCEPT',
        priority: 'HIGH',
        timestamp: new Date().toISOString()
      });
      if (success) {
        // Success feedback
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#00f5ff] font-data-mono text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic animate-pulse-led">
            <Radar size={14} />
            GLOBAL_TREND_INTERCEPTION_ARRAY_v4.2
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            TREND_RADAR
          </h1>
        </div>
        
        <div className="flex gap-6 relative z-10">
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#00f5ff]/20 bg-[#00f5ff]/5 clipped-corner">
             <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2 font-bold">TOTAL_SIGNALS</span>
             <span className="font-headline text-5xl font-black text-white italic tracking-tighter">
               {String(safeTrends.length).padStart(2, '0')}
             </span>
          </div>
          <div className="panel-kinetic p-8 flex flex-col min-w-[200px] group border-[#ffaa00]/20 bg-[#ffaa00]/5 clipped-corner">
             <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2 font-bold">GROWTH_PEAK</span>
             <span className="font-headline text-5xl font-black text-[#ffaa00] italic tracking-tighter">
               {safeTrends[0]?.growth_stat || '00%'}
             </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Radar Intercept Map */}
        <section className="col-span-12 lg:col-span-8 panel-kinetic border-white/5 clipped-corner min-h-[600px] relative overflow-hidden flex flex-col">
           <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
           
           <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
              <div className="flex items-center gap-3">
                 <Globe size={18} className="text-[#00f5ff]" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">NEURAL_HEATMAP_SECTOR_7</h2>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-data-mono text-[9px] text-zinc-600 uppercase font-black tracking-widest">SCAN_FREQ: 4.8GHZ</span>
                <div className="flex gap-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-1.5 h-1.5 bg-[#00f5ff]/20 rounded-full" />
                   ))}
                </div>
              </div>
           </div>

           {/* Radar Visualization Area */}
           <div className="flex-1 relative flex items-center justify-center p-20 overflow-hidden">
              {/* Radar Circles & Grid */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,245,255,0.05)_0%,_transparent_70%)]" />
                 <div className="w-[300px] h-[300px] border border-white/5 rounded-full" />
                 <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
                 <div className="w-[900px] h-[900px] border border-white/5 rounded-full" />
                 
                 {/* Crosshairs */}
                 <div className="absolute w-full h-[1px] bg-white/5" />
                 <div className="absolute h-full w-[1px] bg-white/5" />

                 {/* Rotating Radar Sweep */}
                 <div className="absolute w-[800px] h-[800px] animate-radar origin-center pointer-events-none">
                    <div className="w-1/2 h-1/2 bg-gradient-to-tr from-[#00f5ff]/20 to-transparent rounded-tl-full" />
                 </div>
              </div>

              {/* Trend Signal Nodes */}
              {safeTrends.slice(0, 15).map((trend, i) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                    position: 'absolute',
                    left: `${25 + (Math.sin(i * 1.5) * 30 + 30)}%`,
                    top: `${25 + (Math.cos(i * 1.5) * 30 + 30)}%`
                  }}
                  className="group cursor-pointer z-20"
                  onClick={() => setActiveSignal(trend)}
                >
                   <div className="relative">
                      <div className="w-4 h-4 bg-[#00f5ff] rounded-full animate-ping opacity-20 absolute inset-0" />
                      <div className="w-4 h-4 bg-[#00f5ff] border-2 border-white/20 rounded-full group-hover:scale-150 transition-all shadow-[0_0_15px_#00f5ff]" />
                      
                      {/* Signal Label Tooltip */}
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 panel-kinetic p-4 border-[#00f5ff]/30 opacity-0 group-hover:opacity-100 transition-all pointer-events-none min-w-[180px] clipped-corner-sm">
                         <div className="flex justify-between items-center mb-2">
                           <span className="font-data-mono text-[9px] text-[#00f5ff] uppercase font-black italic">{trend.growth_stat || '+124%'}</span>
                           <Activity size={10} className="text-[#00f5ff] animate-pulse-led" />
                         </div>
                         <p className="font-headline text-sm font-black text-white uppercase italic truncate tracking-tight">{trend.title}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Right Panel: Intercepted Signals Feed */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <section className="panel-kinetic p-8 flex flex-col flex-1 clipped-corner border-white/5">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                 <div className="flex items-center gap-3">
                    <Zap size={18} className="text-[#6bff83] animate-pulse" />
                    <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">LIVE_INTERCEPT_STREAM</h2>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="font-data-mono text-[9px] text-[#6bff83] font-black italic tracking-widest uppercase">SCANNING</span>
                    <div className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse-led" />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                 {safeTrends.map((trend, i) => (
                   <motion.div 
                     key={trend.id}
                     whileHover={{ x: 5 }}
                     onClick={() => setActiveSignal(trend)}
                     className={`p-5 bg-white/[0.01] border flex items-center justify-between group transition-all cursor-pointer clipped-corner-sm ${
                       activeSignal?.id === trend.id ? 'border-[#00f5ff] bg-[#00f5ff]/5' : 'border-white/5 hover:border-white/20'
                     }`}
                   >
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="font-data-mono text-[10px] text-zinc-700 font-bold">0x{i.toString(16).padStart(2, '0').toUpperCase()}</span>
                            <span className="font-data-mono text-[10px] text-[#6bff83] font-black uppercase tracking-widest italic">{trend.growth_stat || '+88%'}</span>
                         </div>
                         <h4 className="font-headline text-lg font-black text-white uppercase italic truncate group-hover:text-[#00f5ff] transition-colors tracking-tight">
                            {trend.title}
                         </h4>
                      </div>
                      <ArrowUpRight size={18} className={`transition-colors ${activeSignal?.id === trend.id ? 'text-[#00f5ff]' : 'text-zinc-800 group-hover:text-zinc-400'}`} />
                   </motion.div>
                 ))}
                 {safeTrends.length === 0 && (
                   <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                      <Search size={48} className="text-zinc-800 mb-4" />
                      <p className="text-zinc-600 font-data-mono uppercase tracking-[0.3em] text-[10px]">No active signals in current quadrant.</p>
                   </div>
                 )}
              </div>

              {/* Action Module: Neural Dispatch */}
              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="panel-kinetic p-8 border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner-sm group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                       <Shield size={18} className="text-[#BD00FF]" />
                       <span className="font-label-caps text-[10px] font-black text-white uppercase tracking-[0.4em]">PREDICTION_ENGINE</span>
                    </div>
                    
                    <div className="space-y-4 mb-8 relative z-10">
                       <p className="font-data-mono text-[11px] text-zinc-400 uppercase italic leading-relaxed">
                         {activeSignal 
                           ? `"${activeSignal.title} shows high conversion probability. Select target language and initiate."` 
                           : `"Analyzing convergence patterns. Standby for target identification."`}
                       </p>
                       
                       {activeSignal && (
                         <div className="flex gap-2">
                            {LANGUAGES.map(lang => (
                              <button
                                key={lang.id}
                                onClick={() => setSelectedLanguage(lang.id)}
                                className={`flex-1 py-2 px-3 font-data-mono text-[9px] font-black uppercase tracking-widest clipped-corner-sm border transition-all ${
                                  selectedLanguage === lang.id 
                                  ? 'bg-[#00f5ff]/20 border-[#00f5ff] text-white' 
                                  : 'bg-black/40 border-white/5 text-zinc-600 hover:border-white/20'
                                }`}
                              >
                                {lang.id}
                              </button>
                            ))}
                         </div>
                       )}
                    </div>

                    <button 
                      disabled={!activeSignal || isProcessing}
                      onClick={() => handleFeedEngine(activeSignal)}
                      className="btn-kinetic btn-kinetic-primary w-full group py-4 text-sm"
                    >
                       <span>{isProcessing ? 'PROCESSING...' : 'FEED_THE_ENGINE'}</span>
                       {!isProcessing && <Zap size={16} className="fill-current" />}
                    </button>
                 </div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}
