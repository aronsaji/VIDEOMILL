import React, { useEffect, useState } from 'react';
import { 
  Zap, TrendingUp, Globe, Activity, 
  AlertCircle, Clock, ExternalLink, 
  Plus, Radar, Target, Cpu, Search,
  Filter, ArrowUpRight, Hash, Users,
  Flame, Tag
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function TrendAnalyzer() {
  const { trends, isLoading, uniqueCountries, uniqueLanguages, fetchTrends, fetchFilterOptions } = usePipelineStore();
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchTrends(
      selectedCountry === 'ALL' ? undefined : selectedCountry,
      selectedLanguage === 'ALL' ? undefined : selectedLanguage
    );
  }, [selectedCountry, selectedLanguage, fetchTrends]);

  const handleDispatch = async (trend: any) => {
    const success = await triggerProduction({
      action: 'viranode-generate',
      topic: trend.title,
      language: trend.language || 'en',
      platform: trend.platform,
      title: trend.title,
      category: trend.category,
      target_audience: trend.target_audience,
      heat_level: trend.heat_level,
      tags: trend.tags,
      source: 'TREND_RADAR'
    });

    if (success) {
      setLastDispatched(trend.id);
      setTimeout(() => setLastDispatched(null), 3000);
    }
  };

  const initiateRecon = async () => {
    const newTrends = [
      { 
        title: "AI Video Revolution: Sora vs Kling", 
        platform: "YouTube",
        growth_stat: "+125%", 
        viral_score: 98, 
        country: "USA", 
        language: "en",
        category: "Technology",
        heat_level: "NUCLEAR",
        target_audience: "18-45",
        tags: ["AI", "Sora", "Future"],
        active: true
      },
      { 
        title: "Sustainable Fashion: Zero Waste Trends", 
        platform: "TikTok",
        growth_stat: "+85%", 
        viral_score: 92, 
        country: "USA", 
        language: "en",
        category: "Lifestyle",
        heat_level: "HIGH",
        target_audience: "16-30",
        tags: ["Eco", "Fashion", "Green"],
        active: true
      },
      { 
        title: "Autonomous Agent Swarms", 
        platform: "X",
        growth_stat: "+310%", 
        viral_score: 96, 
        country: "USA", 
        language: "en",
        category: "Computing",
        heat_level: "EXTREME",
        target_audience: "25-50",
        tags: ["Agents", "Automation", "Dev"],
        active: true
      }
    ];

    const { error } = await supabase.from('trending_topics').insert(newTrends);
    if (error) {
      console.error('Error seeding trends:', error);
      alert('Error seeding trends: ' + error.message);
    } else {
      fetchTrends();
    }
  };

  const getHeatColor = (level: string) => {
    const l = level?.toUpperCase();
    if (l === 'NUCLEAR' || l === 'EXTREME') return 'text-red-500 bg-red-500/10';
    if (l === 'HIGH') return 'text-orange-500 bg-orange-500/10';
    return 'text-primary-container bg-primary-container/10';
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white font-headline-md tracking-tighter italic uppercase">Trend Radar</h1>
          <p className="text-zinc-500 mt-2 font-label-sm uppercase tracking-widest text-[10px]">Neural Intercept // Signal strength: 98%</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={initiateRecon}
             className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-300 hover:bg-white/10 transition-all"
           >
             <Radar size={14} className="animate-spin-slow" />
             Initiate Recon
           </button>
        </div>
      </header>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-primary-container">
            <Target size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Geospatial Targeting</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                selectedCountry === 'ALL' ? 'bg-primary-container text-black border-primary-container' : 'bg-white/5 text-zinc-500 border-white/5'
              }`}
            >
              Global
            </button>
            {uniqueCountries.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                  selectedCountry === c ? 'bg-primary-container text-black border-primary-container' : 'bg-white/5 text-zinc-500 border-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-[#00f5ff]">
            <Cpu size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Linguistic Decode</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                selectedLanguage === 'ALL' ? 'bg-[#00f5ff] text-black border-[#00f5ff]' : 'bg-white/5 text-zinc-500 border-white/5'
              }`}
            >
              All Signals
            </button>
            {uniqueLanguages.map(l => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${
                  selectedLanguage === l ? 'bg-[#00f5ff] text-black border-[#00f5ff]' : 'bg-white/5 text-zinc-500 border-white/5'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-surface-container-low animate-pulse rounded-3xl border border-white/5" />
          ))}
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {trends.map((trend, idx) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-8 bg-surface-container-low border border-white/5 rounded-[2rem] hover:border-primary-container/30 transition-all flex flex-col shadow-xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="px-3 py-1 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[9px] font-black uppercase tracking-widest rounded-full w-fit">
                      {trend.category || 'Viral Signal'}
                    </div>
                    <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full w-fit flex items-center gap-1.5 ${getHeatColor(trend.heat_level)}`}>
                       <Flame size={10} />
                       {trend.heat_level || 'Normal'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Viral Score</p>
                    <p className="text-2xl font-black text-white font-headline-md italic leading-none">{trend.viral_score}%</p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white font-headline-md uppercase italic tracking-tight leading-tight mb-6 group-hover:text-primary-container transition-colors min-h-[3rem]">
                  {trend.title}
                </h3>

                {/* Extended Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="flex items-center gap-3 text-zinc-500">
                      <Users size={14} className="text-zinc-700" />
                      <div className="flex flex-col">
                        <span className="text-[7px] uppercase font-black tracking-widest opacity-40">Audience</span>
                        <span className="text-[10px] font-mono text-zinc-300">{trend.target_audience || 'Universal'}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-zinc-500 text-right">
                      <div className="flex flex-col w-full">
                        <span className="text-[7px] uppercase font-black tracking-widest opacity-40">Language</span>
                        <span className="text-[10px] font-mono text-zinc-300 uppercase">{trend.language || 'EN'} / {trend.country || 'USA'}</span>
                      </div>
                      <Globe size={14} className="text-zinc-700" />
                   </div>
                </div>

                {/* Tags */}
                {trend.tags && trend.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-8">
                      {trend.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                           #{tag}
                        </span>
                      ))}
                   </div>
                )}

                <div className="mt-auto space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase font-black">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-primary-container" />
                      <span className="text-white">{trend.growth_stat || 'Volatile'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash size={14} />
                      <span>{trend.platform}</span>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.viral_score}%` }}
                      className="h-full bg-primary-container shadow-[0_0_10px_#22d3ee]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDispatch(trend)}
                      className="flex-1 py-4 bg-primary-container text-black font-headline-md text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Start Prod
                    </button>
                    <button className="p-4 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>

                {lastDispatched === trend.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary-container flex flex-col items-center justify-center z-10"
                  >
                    <Zap size={48} className="text-black mb-2 animate-bounce" />
                    <span className="text-black font-black uppercase text-xs tracking-widest italic">Dispatched</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-surface-container-low/30">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Radar size={40} className="text-zinc-800 animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">No Signals Detected</h3>
          <p className="text-zinc-600 max-w-sm mx-auto mb-10 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
            The neural intercept is silent. Initiate recon to populate the visual matrix with trending topics.
          </p>
          <button 
            onClick={initiateRecon}
            className="px-10 py-4 bg-primary-container text-black font-headline-md text-xs font-black uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition-all"
          >
            Start Recon Mode
          </button>
        </div>
      )}
    </div>
  );
}
