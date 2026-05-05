import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { 
  TrendingUp, Activity, Globe, Zap, 
  Terminal, Shield, Cpu, Radar,
  Maximize2, ArrowUpRight, Search
} from 'lucide-react';
import { Monitor } from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';

export default function TrendAnalyzer() {
  const { language, t } = useI18nStore();
  const { trends = [], fetchTrends, subscribeToChanges } = usePipelineStore();
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCountry, setSelectedCountry] = useState('GLOBAL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');

  const COUNTRIES = ['GLOBAL', 'USA', 'NORWAY', 'SPAIN', 'INDIA', 'FRANCE'];
  const RADAR_PLATFORMS = ['ALL', 'TIKTOK', 'X', 'YOUTUBE', 'INSTAGRAM'];

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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-8">
        <div className="relative z-10">
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            {t('TREND_RADAR')}
          </h1>
        </div>

        <div className="flex flex-wrap gap-6 relative z-10">
          {/* Radar Filters */}
          <div className="flex bg-black/60 p-2 border border-white/5 clipped-corner-sm gap-2">
            <div className="flex flex-col gap-1">
              <span className="font-data-mono text-[11px] text-zinc-400 px-2 uppercase">{t('COUNTRY')}</span>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-transparent text-white font-data-mono text-[10px] px-2 py-1 outline-none border-none cursor-pointer hover:text-[#00f5ff]"
              >
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131314]">{c}</option>)}
              </select>
            </div>
            <div className="w-[1px] h-full bg-white/5" />
            <div className="flex flex-col gap-1">
              <span className="font-data-mono text-[11px] text-zinc-400 px-2 uppercase">{t('PLATFORM')}</span>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent text-white font-data-mono text-[10px] px-2 py-1 outline-none border-none cursor-pointer hover:text-[#00f5ff]"
              >
                {RADAR_PLATFORMS.map(p => <option key={p} value={p} className="bg-[#131314]">{p}</option>)}
              </select>
            </div>
          </div>
        
          <div className="flex gap-4">
            <div className="panel-kinetic p-6 flex flex-col min-w-[180px] group border-[#00f5ff]/20 bg-[#00f5ff]/5 clipped-corner-sm">
               <span className="font-label-caps text-[11px] text-zinc-400 uppercase tracking-[0.3em] mb-1 font-bold">SIGNALS_SEC</span>
               <span className="font-headline text-4xl font-black text-white italic tracking-tighter">1,422</span>
            </div>
            <div className="panel-kinetic p-6 flex flex-col min-w-[180px] group border-[#ffaa00]/20 bg-[#ffaa00]/5 clipped-corner-sm">
               <span className="font-label-caps text-[11px] text-zinc-400 uppercase tracking-[0.3em] mb-1 font-bold">NEURAL_LOAD</span>
               <span className="font-headline text-4xl font-black text-[#ffaa00] italic tracking-tighter">42%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Tactical Radar Visualization */}
        <section className="panel-kinetic border-white/5 clipped-corner min-h-[400px] relative overflow-hidden flex flex-col">
           <div className="scanline-overlay absolute inset-0 opacity-10 pointer-events-none" />
           
           <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
              <div className="flex items-center gap-3">
                 <Globe size={18} className="text-[#00f5ff]" />
                 <h2 className="font-label-caps text-[11px] font-black text-white uppercase tracking-[0.3em]">{t('NEURAL_HEATMAP_SECTOR_7')}</h2>
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

           <div className="flex-1 relative flex items-center justify-center p-20 overflow-hidden min-h-[350px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,245,255,0.05)_0%,_transparent_70%)]" />
                 <div className="w-[200px] h-[200px] border border-white/5 rounded-full" />
                 <div className="w-[400px] h-[400px] border border-white/5 rounded-full" />
                 <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
                 <div className="absolute w-[600px] h-[600px] animate-radar origin-center pointer-events-none">
                    <div className="w-1/2 h-1/2 bg-gradient-to-tr from-[#00f5ff]/20 to-transparent rounded-tl-full" />
                 </div>
              </div>

              {safeTrends.slice(0, 10).map((trend, i) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                    position: 'absolute',
                    left: `${25 + (Math.sin(i * 1.5) * 20 + 20)}%`,
                    top: `${25 + (Math.cos(i * 1.5) * 20 + 20)}%`
                  }}
                  className="group cursor-pointer z-20"
                  onClick={() => setActiveSignal(trend)}
                >
                   <div className="relative">
                      <div className="w-3 h-3 bg-[#00f5ff] rounded-full animate-ping opacity-20 absolute inset-0" />
                      <div className="w-3 h-3 bg-[#00f5ff] border-2 border-white/20 rounded-full group-hover:scale-150 transition-all shadow-[0_0_15px_#00f5ff]" />
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* INTERCEPTION_GRID: Rich Content Cards */}
        <div className="space-y-6">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                 <Zap size={18} className="text-[#6bff83] animate-pulse" />
                 <h2 className="font-label-caps text-[12px] font-black text-white uppercase tracking-[0.4em]">{t('LIVE_INTERCEPT_STREAM')}</h2>
              </div>
              <div className="flex items-center gap-2">
                 <span className="font-data-mono text-[9px] text-[#6bff83] font-black tracking-widest uppercase">SCANNING</span>
                 <div className="w-1.5 h-1.5 bg-[#6bff83] rounded-full animate-pulse-led" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeTrends.map((trend, i) => (
                <motion.div
                  key={trend.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveSignal(trend)}
                  className={`panel-kinetic p-6 border-white/5 bg-white/[0.02] clipped-corner relative group transition-all cursor-pointer ${
                    activeSignal?.id === trend.id ? 'border-[#00f5ff]/50 bg-[#00f5ff]/5 shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'hover:border-white/20'
                  }`}
                >
                  <div className="scanline-overlay absolute inset-0 opacity-[0.02] pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 clipped-corner-sm">
                       <Zap size={14} className="text-[#00f5ff]" />
                       <span className="font-data-mono text-[9px] text-zinc-700 font-bold">0x{i.toString(16).padStart(2, '0').toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="font-headline text-lg font-black text-[#6bff83] italic tracking-tighter leading-none">{trend.growth_stat || '+55%'}</span>
                    </div>
                  </div>

                  <h3 className="font-headline text-[17px] font-black text-white uppercase italic mb-6 leading-tight group-hover:text-[#00f5ff] transition-colors min-h-[48px] line-clamp-2">
                    {trend.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5">
                          <Globe size={12} className="text-zinc-600" />
                          <span className="font-data-mono text-[9px] text-zinc-500 uppercase font-black">{selectedLanguage}</span>
                       </div>
                       <div className="w-[1px] h-3 bg-white/5" />
                       <div className="flex items-center gap-1.5">
                          <Monitor size={12} className="text-zinc-600" />
                          <span className="font-data-mono text-[9px] text-zinc-500 uppercase font-black">{selectedPlatform}</span>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>

           {/* Prediction & Dispatch Module */}
           <div className="mt-12">
              <div className="panel-kinetic p-8 border-[#BD00FF]/20 bg-[#BD00FF]/5 clipped-corner group relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                       <Shield size={18} className="text-[#BD00FF]" />
                       <span className="font-label-caps text-[10px] font-black text-white uppercase tracking-[0.4em]">PREDICTION_ENGINE_v4.2</span>
                    </div>
                    <p className="font-data-mono text-sm text-zinc-400 uppercase italic leading-relaxed max-w-2xl">
                      {activeSignal 
                        ? `"${activeSignal.title} shows ${activeSignal.growth_stat || '55%'} convergence probability in ${selectedCountry} sector. Select localized language and initiate production."` 
                        : `"Analyzing convergence patterns. Standby for target identification."`}
                    </p>
                 </div>
                 
                 <div className="w-full md:w-[400px] space-y-6">
                    <div className="grid grid-cols-3 gap-2">
                       {LANGUAGES.map(lang => (
                         <button
                           key={lang.id}
                           onClick={() => setSelectedLanguage(lang.id)}
                           className={`py-3 px-4 font-data-mono text-[10px] font-black uppercase tracking-widest clipped-corner-sm border transition-all ${
                             selectedLanguage === lang.id 
                             ? 'bg-[#00f5ff]/20 border-[#00f5ff] text-white shadow-[0_0_10px_rgba(0,245,255,0.2)]' 
                             : 'bg-black/40 border-white/5 text-zinc-700 hover:border-white/20'
                           }`}
                         >
                           {lang.id}
                         </button>
                       ))}
                    </div>

                    <button 
                      disabled={!activeSignal || isProcessing}
                      onClick={() => handleFeedEngine(activeSignal)}
                      className="btn-kinetic btn-kinetic-primary w-full group py-5 text-[12px] flex items-center justify-center gap-3"
                    >
                       <Zap size={18} className={isProcessing ? 'animate-pulse' : 'fill-current'} />
                       <span className="font-headline font-black italic tracking-wider">
                         {isProcessing ? 'SYNTHESIZING...' : 'FEED_THE_ENGINE'}
                       </span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
