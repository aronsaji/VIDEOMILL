import React, { useEffect, useState } from 'react';
import { 
  Zap, TrendingUp, Globe, Activity, 
  AlertCircle, Clock, ExternalLink, 
  Plus, Radar, Target, Cpu, Search,
  Filter, ArrowUpRight, Hash, Users,
  Flame, Tag
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { useI18nStore } from '../store/i18nStore';
import { triggerProduction } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function TrendAnalyzer() {
  const { trends, isLoading, uniqueCountries, uniqueLanguages, fetchTrends, fetchFilterOptions } = usePipelineStore();
  const { t } = useI18nStore();
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

  // Auto-seed if empty
  useEffect(() => {
    if (!isLoading && trends.length === 0 && selectedCountry === 'ALL' && selectedLanguage === 'ALL') {
      initiateRecon();
    }
  }, [isLoading, trends, selectedCountry, selectedLanguage]);

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
    } else {
      fetchTrends();
    }
  };

  const getHeatColor = (level: string) => {
    const l = level?.toUpperCase();
    if (l === 'NUCLEAR' || l === 'EXTREME') return 'text-error bg-error/10 border-error/20';
    if (l === 'HIGH') return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-primary bg-primary/10 border-primary/20';
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex justify-between items-center border-b border-outline pb-10">
        <div>
          <h1 className="text-4xl font-black text-on-surface font-headline-md tracking-tighter italic uppercase">{t('TREND_RADAR')}</h1>
          <p className="text-on-surface-variant mt-2 font-mono text-[10px] uppercase font-black tracking-widest italic opacity-60">Neural Intercept // Signal strength: 98%</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={initiateRecon}
             className="flex items-center gap-2 px-6 py-3 bg-surface border border-outline rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all font-mono"
           >
             <Radar size={14} className="animate-spin-slow" />
             Initiate Recon
           </button>
        </div>
      </header>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-surface border border-outline rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Target size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Geospatial Targeting</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                selectedCountry === 'ALL' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-on-surface-variant/30'
              }`}
            >
              Global
            </button>
            {uniqueCountries.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                  selectedCountry === c ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-on-surface-variant/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 bg-surface border border-outline rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Cpu size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Linguistic Decode</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                selectedLanguage === 'ALL' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-on-surface-variant/30'
              }`}
            >
              All Signals
            </button>
            {uniqueLanguages.map(l => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                  selectedLanguage === l ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-on-surface-variant/30'
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
            <div key={i} className="h-64 bg-surface-container animate-pulse rounded-3xl border border-outline" />
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
                className="group p-8 bg-surface border border-outline rounded-[2rem] hover:border-primary/30 transition-all flex flex-col shadow-sm hover:shadow-xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="px-3 py-1 bg-surface-container border border-outline text-on-surface-variant/60 text-[9px] font-black uppercase tracking-widest rounded-full w-fit">
                      {trend.category || 'Viral Signal'}
                    </div>
                    <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full w-fit flex items-center gap-1.5 border ${getHeatColor(trend.heat_level)}`}>
                       <Flame size={10} />
                       {trend.heat_level || 'Normal'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-on-surface-variant/40 font-black uppercase tracking-widest leading-none mb-1">Viral Score</p>
                    <p className="text-2xl font-black text-on-surface font-headline-md italic leading-none">{trend.viral_score}%</p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-on-surface font-headline-md uppercase italic tracking-tight leading-tight mb-6 group-hover:text-primary transition-colors min-h-[3rem]">
                  {trend.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="flex items-center gap-3 text-on-surface-variant/40">
                      <Users size={14} className="text-on-surface-variant/20" />
                      <div className="flex flex-col">
                        <span className="text-[7px] uppercase font-black tracking-widest opacity-60">Audience</span>
                        <span className="text-[10px] font-mono text-on-surface-variant">{trend.target_audience || 'Universal'}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-on-surface-variant/40 text-right">
                      <div className="flex flex-col w-full">
                        <span className="text-[7px] uppercase font-black tracking-widest opacity-60">Language</span>
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase">{trend.language || 'EN'} / {trend.country || 'USA'}</span>
                      </div>
                      <Globe size={14} className="text-on-surface-variant/20" />
                   </div>
                </div>

                {trend.tags && trend.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-8">
                      {trend.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest bg-surface-container px-2 py-1 rounded">
                           #{tag}
                        </span>
                      ))}
                   </div>
                )}

                <div className="mt-auto space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant uppercase font-black">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-primary" />
                      <span className="text-on-surface">{trend.growth_stat || 'Volatile'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash size={14} />
                      <span>{trend.platform}</span>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.viral_score}%` }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(8,145,178,0.2)]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDispatch(trend)}
                      className="flex-1 py-4 bg-primary text-white font-headline-md text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10"
                    >
                      <Plus size={16} />
                      {t('INITIATE_PRODUCTION')}
                    </button>
                    <button className="p-4 bg-surface-container border border-outline text-on-surface-variant/40 rounded-xl hover:bg-surface-container/80 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>

                {lastDispatched === trend.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary flex flex-col items-center justify-center z-10"
                  >
                    <Zap size={48} className="text-white mb-2 animate-bounce" />
                    <span className="text-white font-black uppercase text-xs tracking-widest italic">Dispatched</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center border-2 border-dashed border-outline rounded-[3rem] bg-surface shadow-sm">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-8">
            <Radar size={40} className="text-on-surface-variant/20 animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tight mb-4">No Signals Detected</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto mb-10 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
            The neural intercept is silent. Initiate recon to populate the visual matrix with trending topics.
          </p>
          <button 
            onClick={initiateRecon}
            className="px-10 py-4 bg-primary text-white font-headline-md text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
          >
            Start Recon Mode
          </button>
        </div>
      )}
    </div>
  );
}
