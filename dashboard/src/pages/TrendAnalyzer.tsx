import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { 
  TrendingUp, Activity, Globe, Zap, 
  Terminal, Shield, Cpu, Radar,
  Maximize2, ArrowUpRight, Search, Monitor
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';

export default function TrendAnalyzer() {
  const { t } = useI18nStore();
  const { trends = [], fetchTrends, subscribeToChanges } = usePipelineStore();
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for dual-filtering
  const [selectedLanguage, setSelectedLanguage] = useState('Norsk');
  const [selectedCountry, setSelectedCountry] = useState('NORWAY');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');

  const COUNTRIES = ['GLOBAL', 'USA', 'NORWAY', 'SPAIN', 'INDIA', 'FRANCE'];
  const RADAR_PLATFORMS = ['ALL', 'TIKTOK', 'X', 'YOUTUBE', 'INSTAGRAM'];

  // ORDERED AS REQUESTED
  const LANGUAGES = [
    { id: 'Norsk', label: 'NO', country: 'NORWAY' },
    { id: 'English', label: 'EN', country: 'USA' },
    { id: 'Tamil', label: 'TA', country: 'INDIA' },
    { id: 'Hindi', label: 'HI', country: 'INDIA' },
    { id: 'Español', label: 'ES', country: 'SPAIN' },
  ];

  useEffect(() => {
    // Fetching with strict filtering by BOTH country and language
    fetchTrends(selectedCountry, selectedLanguage);
    
    const unsubscribe = subscribeToChanges();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchTrends, subscribeToChanges, selectedCountry, selectedLanguage]);

  const safeTrends = Array.isArray(trends) ? trends : [];

  const handleFeedEngine = async (trend: any) => {
    if (!trend || isProcessing) return;
    setIsProcessing(true);
    
    try {
      const success = await triggerProduction({
        action: 'viranode-generate',
        topic: trend.title,
        title: trend.title,
        language: selectedLanguage, // Use the selected filter language
        source: 'TREND_RADAR_INTERCEPT',
        priority: 'HIGH',
        timestamp: new Date().toISOString()
      });
      
      if (success) {
        alert(`✅ PRODUCTION_QUEUED: ${trend.title} [${selectedLanguage}]`);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative border-b border-white/5 pb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-[#00f5ff] font-data-mono text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">
            <Radar size={14} className="animate-spin-slow" />
            GEOSPATIAL_TREND_LOCATOR_v3.1
          </div>
          <h1 className="font-headline text-[52px] font-[900] tracking-[-0.05em] leading-[0.8] text-white uppercase italic">
            TREND_RADAR
          </h1>
        </div>

        <div className="flex flex-wrap gap-6 relative z-10">
          {/* Dual Filter Panel */}
          <div className="flex bg-black/60 p-2 border border-white/5 clipped-corner-sm gap-2">
            <div className="flex flex-col gap-1">
              <span className="font-data-mono text-[11px] text-zinc-400 px-2 uppercase">REGION</span>
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
              <span className="font-data-mono text-[11px] text-zinc-400 px-2 uppercase">SOURCE</span>
              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-transparent text-white font-data-mono text-[10px] px-2 py-1 outline-none border-none cursor-pointer hover:text-[#BD00FF]"
              >
                {RADAR_PLATFORMS.map(p => <option key={p} value={p} className="bg-[#131314]">{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Language Selection Bar (Ordered as requested) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
           <div className="flex items-center gap-3">
              <Zap size={18} className="text-[#6bff83] animate-pulse" />
              <h2 className="font-label-caps text-[12px] font-black text-white uppercase tracking-[0.4em]">LIVE_INTERCEPT_STREAM</h2>
           </div>
           
           <div className="flex gap-2 bg-black/40 p-1.5 border border-white/5 clipped-corner-sm overflow-x-auto">
              {LANGUAGES.map(lang => (
                 <button
                   key={lang.id}
                   onClick={() => setSelectedLanguage(lang.id)}
                   className={`px-6 py-2 font-data-mono text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                     selectedLanguage === lang.id 
                     ? 'bg-[#00f5ff] text-black shadow-[0_0_15px_rgba(0,245,255,0.4)]' 
                     : 'text-zinc-600 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   {lang.id} ({lang.label})
                 </button>
              ))}
           </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {safeTrends.length > 0 ? safeTrends.map((trend, i) => (
             <motion.div
               key={trend.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               onClick={() => setActiveSignal(trend)}
               className={`panel-kinetic p-6 border-white/5 bg-white/[0.02] clipped-corner relative group transition-all cursor-pointer ${
                 activeSignal?.id === trend.id ? 'border-[#00f5ff]/50 bg-[#00f5ff]/5' : 'hover:border-white/20'
               }`}
             >
               <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 clipped-corner-sm">
                    <div className="w-1.5 h-1.5 bg-[#00f5ff] rounded-full animate-pulse" />
                    <span className="font-data-mono text-[9px] text-zinc-500 font-bold uppercase">{trend.country || selectedCountry}</span>
                 </div>
                 
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     handleFeedEngine(trend);
                   }}
                   className="p-3 bg-[#6bff83]/10 border border-[#6bff83]/30 text-[#6bff83] hover:bg-[#6bff83] hover:text-black transition-all clipped-corner-sm group/btn"
                 >
                    <Zap size={16} />
                 </button>
               </div>

               <h3 
                 onClick={(e) => {
                   e.stopPropagation();
                   handleFeedEngine(trend);
                 }}
                 className="font-headline text-[20px] font-black text-white uppercase italic mb-6 leading-tight hover:text-[#6bff83] transition-colors min-h-[56px] line-clamp-2"
               >
                 {trend.title}
               </h3>

               <div className="flex items-center justify-between pt-4 border-t border-white/5">
                 <div className="flex items-center gap-2">
                    <Globe size={12} className="text-[#00f5ff]" />
                    <span className="font-data-mono text-[9px] text-zinc-400 font-black">{trend.language || selectedLanguage}</span>
                 </div>
                 <div className="font-headline text-lg font-black text-[#6bff83] italic tracking-tighter">
                   {trend.growth_stat || '+88%'}
                 </div>
               </div>
             </motion.div>
           )) : (
             <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 opacity-30 rounded-3xl">
                <Search size={48} className="mb-4 text-zinc-600" />
                <p className="font-data-mono text-xs uppercase tracking-widest">No signals found for {selectedCountry} / {selectedLanguage}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
