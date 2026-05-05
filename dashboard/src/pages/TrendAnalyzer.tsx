import React, { useEffect, useState } from 'react';
import { 
  Zap, TrendingUp, Globe, Activity, 
  AlertCircle, Clock, ExternalLink, 
  Plus, Radar, Target, Cpu, Search,
  Filter, ArrowUpRight, Hash, Users,
  Flame, Tag, Check, X
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { useI18nStore } from '../store/i18nStore';
import { triggerProduction } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function TrendAnalyzer() {
  const { trends, isLoading, fetchTrends, fetchFilterOptions, uniqueCountries, uniqueLanguages } = usePipelineStore();
  const { t } = useI18nStore();
  
  // Multiple selection states
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['ALL']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['ALL']);
  
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchTrends(
      selectedCountries,
      selectedLanguages
    );
  }, [selectedCountries, selectedLanguages, fetchTrends]);

  // Auto-seed if empty
  useEffect(() => {
    if (!isLoading && trends.length === 0 && selectedCountries.includes('ALL') && selectedLanguages.includes('ALL')) {
      initiateRecon();
    }
  }, [isLoading, trends, selectedCountries, selectedLanguages]);

  const toggleCountry = (country: string) => {
    if (country === 'ALL') {
      setSelectedCountries(['ALL']);
      return;
    }

    setSelectedCountries(prev => {
      const filtered = prev.filter(c => c !== 'ALL');
      if (filtered.includes(country)) {
        const next = filtered.filter(c => c !== country);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...filtered, country];
      }
    });
  };

  const toggleLanguage = (lang: string) => {
    if (lang === 'ALL') {
      setSelectedLanguages(['ALL']);
      return;
    }

    setSelectedLanguages(prev => {
      const filtered = prev.filter(l => l !== 'ALL');
      if (filtered.includes(lang)) {
        const next = filtered.filter(l => l !== lang);
        return next.length === 0 ? ['ALL'] : next;
      } else {
        return [...filtered, lang];
      }
    });
  };

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
        title: "La Cuisine Française: Top 5 Classics", 
        platform: "TikTok",
        growth_stat: "+142% SEASON_SPIKE", 
        viral_score: 95, 
        country: "France", 
        language: "fr",
        category: "Cuisine",
        heat_level: "HIGH",
        target_audience: "Foodies (France)",
        tags: ["la cuisine française", "france", "cuisine"],
        active: true
      },
      { 
        title: "AI Video Revolution: Sora vs Kling", 
        platform: "YouTube",
        growth_stat: "+125% GLOBAL_GAIN", 
        viral_score: 98, 
        country: "Global", 
        language: "en",
        category: "Technology",
        heat_level: "NUCLEAR",
        target_audience: "Tech Enthusiasts",
        tags: ["AI", "Sora", "Future"],
        active: true
      },
      { 
        title: "Norsk Friluftsliv: Vinterguide", 
        platform: "Instagram",
        growth_stat: "+88% LOCAL_TREND", 
        viral_score: 89, 
        country: "Norway", 
        language: "no",
        category: "Lifestyle",
        heat_level: "NORMAL",
        target_audience: "Nature Lovers",
        tags: ["norge", "friluftsliv", "vinter"],
        active: true
      },
      { 
        title: "Bollywood Beats: Tamil Remix", 
        platform: "YouTube",
        growth_stat: "+310% HYPER_GROWTH", 
        viral_score: 99, 
        country: "India", 
        language: "ta",
        category: "Music",
        heat_level: "EXTREME",
        target_audience: "Gen-Z India",
        tags: ["india", "tamil", "remix"],
        active: true
      },
      { 
        title: "Hindi Web-Series: The New Era", 
        platform: "Facebook",
        growth_stat: "+22% INCREASE_SEASON", 
        viral_score: 91, 
        country: "India", 
        language: "hi",
        category: "Entertainment",
        heat_level: "HIGH",
        target_audience: "Hindi Viewers",
        tags: ["india", "hindi", "webseries"],
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
    if (l === 'HIGH') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-primary bg-primary/10 border-primary/20';
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex justify-between items-center border-b border-outline pb-10">
        <div>
          <h1 className="text-5xl font-black text-[#1E3A8A] font-headline-md tracking-tighter italic uppercase leading-none">{t('TREND_RADAR')}</h1>
          <p className="text-on-surface-variant mt-3 font-mono text-[11px] uppercase font-black tracking-widest italic opacity-60">Neural Intercept // Multi-Sector Analysis Active</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={initiateRecon}
             className="flex items-center gap-3 px-8 py-4 bg-surface border border-outline rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#1E3A8A] hover:bg-surface-container transition-all font-mono shadow-sm"
           >
             <Radar size={16} className="animate-spin-slow text-[#4169E1]" />
             Initiate Recon
           </button>
        </div>
      </header>

      {/* Filter Matrix - Multi-Select Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-surface border border-outline rounded-[2.5rem] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#4169E1]">
              <Target size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Geospatial Targeting</span>
            </div>
            <span className="font-mono text-[9px] font-black uppercase text-on-surface-variant/40">Multi_Select Enabled</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleCountry('ALL')}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 ${
                selectedCountries.includes('ALL') ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-lg shadow-[#4169E1]/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-[#4169E1] hover:text-[#4169E1]'
              }`}
            >
              {selectedCountries.includes('ALL') && <Check size={12} />}
              Global
            </button>
            {['USA', 'Norway', 'India', 'France', 'UK'].map(c => (
              <button
                key={c}
                onClick={() => toggleCountry(c)}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 ${
                  selectedCountries.includes(c) ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-lg shadow-[#4169E1]/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-[#4169E1] hover:text-[#4169E1]'
                }`}
              >
                {selectedCountries.includes(c) && <Check size={12} />}
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 bg-surface border border-outline rounded-[2.5rem] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#4169E1]">
              <Cpu size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Linguistic Decode</span>
            </div>
            <span className="font-mono text-[9px] font-black uppercase text-on-surface-variant/40">Multi_Select Enabled</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleLanguage('ALL')}
              className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 ${
                selectedLanguages.includes('ALL') ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-lg shadow-[#4169E1]/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-[#4169E1] hover:text-[#4169E1]'
              }`}
            >
              {selectedLanguages.includes('ALL') && <Check size={12} />}
              All Signals
            </button>
            {['en', 'no', 'ta', 'hi', 'fr'].map(l => (
              <button
                key={l}
                onClick={() => toggleLanguage(l)}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border flex items-center gap-2 ${
                  selectedLanguages.includes(l) ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-lg shadow-[#4169E1]/20' : 'bg-surface-container text-on-surface-variant border-outline hover:border-[#4169E1] hover:text-[#4169E1]'
                }`}
              >
                {selectedLanguages.includes(l) && <Check size={12} />}
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-surface-container/50 animate-pulse rounded-[2.5rem] border border-outline" />
          ))}
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {trends.map((trend, idx) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-10 bg-surface border border-outline rounded-[3rem] hover:border-[#4169E1]/40 transition-all flex flex-col shadow-sm hover:shadow-2xl relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-3">
                    <div className="px-4 py-1.5 bg-surface-container border border-outline text-on-surface-variant text-[10px] font-black uppercase tracking-widest rounded-full w-fit">
                      {trend.category || 'Viral Signal'}
                    </div>
                    <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full w-fit flex items-center gap-2 border ${getHeatColor(trend.heat_level)}`}>
                       <Flame size={12} />
                       {trend.heat_level || 'Normal'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest leading-none mb-2 opacity-60">Viral Score</p>
                    <p className="text-4xl font-black text-[#1E3A8A] font-headline-md italic leading-none">{trend.viral_score}%</p>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-[#1E3A8A] font-headline-md uppercase italic tracking-tighter leading-tight mb-8 group-hover:text-[#4169E1] transition-colors min-h-[4rem]">
                  {trend.title}
                </h3>

                <div className="grid grid-cols-1 gap-6 mb-10">
                   <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="p-3 bg-surface-container border border-outline rounded-2xl text-[#4169E1]">
                        <Users size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-1">Audience Segment</span>
                        <span className="text-[13px] font-mono text-[#1E3A8A] font-black uppercase italic">{trend.target_audience || 'Universal'}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="p-3 bg-surface-container border border-outline rounded-2xl text-[#4169E1]">
                        <Globe size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-1">Language / Geo</span>
                        <span className="text-[13px] font-mono text-[#1E3A8A] font-black uppercase italic">{trend.language || 'EN'} / {trend.country || 'USA'}</span>
                      </div>
                   </div>
                </div>

                {trend.tags && trend.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-10">
                      {trend.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[11px] font-black text-[#4169E1] uppercase tracking-widest bg-[#4169E1]/5 px-3 py-1.5 rounded-xl border border-[#4169E1]/20 italic">
                           #{tag}
                        </span>
                      ))}
                   </div>
                )}

                <div className="mt-auto space-y-8">
                  <div className="flex justify-between items-center text-[12px] font-mono text-on-surface-variant uppercase font-black">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={18} className="text-success animate-bounce" />
                      <span className="text-success font-black italic">{trend.growth_stat || 'Volatile'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#4169E1]">
                      <Hash size={18} />
                      <span className="font-black italic">{trend.platform}</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-surface-container border border-outline rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.viral_score}%` }}
                      className="h-full bg-[#4169E1] shadow-[0_0_15px_rgba(65,105,225,0.4)]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleDispatch(trend)}
                      className="flex-1 py-6 bg-[#4169E1] text-white font-headline-md text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl shadow-[#4169E1]/20"
                    >
                      <Plus size={20} />
                      {t('INITIATE_PRODUCTION')}
                    </button>
                    <button className="p-6 bg-surface-container border border-outline text-on-surface-variant rounded-2xl hover:bg-surface transition-all shadow-sm">
                      <ExternalLink size={24} />
                    </button>
                  </div>
                </div>

                {lastDispatched === trend.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#4169E1]/95 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
                  >
                    <Zap size={64} className="text-white mb-4 animate-bounce" />
                    <span className="text-white font-black uppercase text-xl tracking-[0.3em] italic">Dispatched</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center border-2 border-dashed border-outline rounded-[4rem] bg-surface shadow-sm">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-10 border border-outline shadow-inner">
            <Radar size={48} className="text-[#4169E1] animate-spin-slow" />
          </div>
          <h3 className="text-3xl font-black text-[#1E3A8A] uppercase italic tracking-tighter mb-6">No Signals Detected</h3>
          <p className="text-on-surface-variant max-w-md mx-auto mb-12 font-mono text-xs uppercase tracking-widest leading-relaxed font-black italic opacity-40">
            The neural intercept is silent. Initiate recon to populate the visual matrix with trending topics for France, India, and Norway.
          </p>
          <button 
            onClick={initiateRecon}
            className="px-12 py-6 bg-[#4169E1] text-white font-headline-md text-base font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[#4169E1]/30 hover:brightness-110 transition-all active:scale-95 italic"
          >
            Start Recon Mode
          </button>
        </div>
      )}
    </div>
  );
}
