import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Flame, Video, RefreshCw, Search, ArrowUpRight, 
  X, Activity, Globe, Sparkles, TrendingUp,
  BarChart3, Zap, ShieldAlert, Cpu, Radio, Terminal, Target
} from 'lucide-react';
import type { TrendingTopic } from '../types';
import { triggerProduction } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function TrendAnalyzer() {
  const { t } = useLanguage();
  const { trends = [], isLoading, fetchInitialData, fetchTrends } = usePipelineStore();
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'youtube' | 'instagram' | 'snapchat'>('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedTrend, setSelectedTrend] = useState<TrendingTopic | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Extract unique countries and languages for filters
  const countries = Array.from(new Set(trends.map(t => t.country).filter(Boolean))).sort();
  const languages = Array.from(new Set(trends.map(t => t.language).filter(Boolean))).sort();

  const filteredTrends = trends.filter(t => {
    const matchesPlatform = platformFilter === 'all' || t.platform?.toLowerCase() === platformFilter;
    const matchesCountry = countryFilter === 'all' || t.country === countryFilter;
    const matchesLanguage = languageFilter === 'all' || t.language === languageFilter;
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesCountry && matchesLanguage && matchesSearch;
  });

  const handleStartProduction = async (trend: TrendingTopic) => {
    setIsOrdering(true);
    const orderId = crypto.randomUUID();
    
    try {
      await triggerProduction({
        id: orderId,
        video_id: orderId,
        action: 'TREND_START',
        trend_id: trend.id,
        title: trend.title,
        topic: trend.tags?.[0] || trend.title,
        style_tone: '⚡ Engaging',
        target_audience: trend.country || 'Global',
        video_format: '📱 9:16 (Vertical)',
        ai_voice: 'nb-NO-PernilleNeural',
        language: trend.language || 'Norsk',
        platforms: ['tiktok', 'youtube']
      });
      setSelectedTrend(null);
    } catch (err) {
      console.error('Trend production failed:', err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-20 px-4 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-neon-cyan font-mono text-[10px] font-black uppercase tracking-[0.4em]"
          >
            <Activity size={14} className="animate-pulse" />
            Global Intelligence Stream v4.2
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Trend <span className="text-brand-1">Radar</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-16 bg-neon-cyan/50" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic">Deep Neural Analysis of Social Velocity</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex gap-4">
            <select 
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[18px] px-8 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-neon-cyan/40 text-white hover:bg-neon-cyan/10 transition-all appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all" className="bg-[#05060f]">GLOBAL_ALL_REGIONS</option>
              <option value="no" className="bg-[#05060f]">NORWAY_NORTH_SEA</option>
              <option value="us" className="bg-[#05060f]">USA_FEDERAL_NET</option>
              <option value="uk" className="bg-[#05060f]">UK_CROWN_GRID</option>
              <option value="de" className="bg-[#05060f]">GERMANY_CORE</option>
              <option value="in" className="bg-[#05060f]">INDIA_SOUTH_ASIA</option>
            </select>

            <select 
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[18px] px-8 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-neon-cyan/40 text-white hover:bg-neon-cyan/10 transition-all appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all" className="bg-[#05060f]">ALL_LANGUAGES</option>
              <option value="no" className="bg-[#05060f]">NORSK_PRIMARY</option>
              <option value="en" className="bg-[#05060f]">ENGLISH_GLOBAL</option>
              <option value="de" className="bg-[#05060f]">DEUTSCHE_LEVEL_1</option>
              <option value="hi" className="bg-[#05060f]">HINDI_REGIONAL</option>
            </select>
          </div>

          <div className="relative group min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-neon-cyan transition-colors" size={18} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Query Viral Signals..."
              className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] pl-14 pr-8 py-5 text-sm focus:border-neon-cyan/40 outline-none backdrop-blur-xl transition-all font-black italic uppercase tracking-wider text-white placeholder:text-gray-700"
            />
          </div>
          <button 
            onClick={() => fetchTrends()}
            className="p-5 bg-white/5 text-gray-500 rounded-[24px] hover:bg-neon-cyan hover:text-black transition-all border border-white/5 shadow-xl group"
          >
            <RefreshCw size={24} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Signals', value: filteredTrends.length, icon: Radio, color: 'text-brand-1' },
          { label: 'Avg Velocity', value: '84%', icon: Zap, color: 'text-brand-2' },
          { label: 'Network Load', value: 'OPTIMAL', icon: BarChart3, color: 'text-brand-1' },
          { label: 'Signal Integrity', value: '99.8%', icon: ShieldAlert, color: 'text-brand-2' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-standard"
          >
            <div className="space-y-2 relative z-10">
              <p className="text-[13px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">{stat.label}</p>
              <p className={`text-2xl font-black italic uppercase tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['all', 'tiktok', 'youtube', 'instagram', 'snapchat'].map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p as any)}
            className={`px-10 py-4 rounded-[20px] text-[10px] font-black transition-all border uppercase tracking-[0.3em] italic whitespace-nowrap ${
              platformFilter === p 
                ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                : 'bg-white/5 text-gray-600 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTrends.map((trend, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              key={trend.id}
              className="group h-full"
            >
              <div className="glass-ultra rounded-[48px] p-10 border border-white/5 hover:border-neon-cyan/40 transition-all duration-700 flex flex-col h-full relative overflow-hidden group-hover:translate-y-[-8px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-neon-cyan/5 rounded-[18px] border border-neon-cyan/10">
                    <Flame size={16} className="text-neon-cyan animate-pulse" />
                    <span className="text-[13px] font-black text-neon-cyan uppercase tracking-[0.2em] italic">
                      {trend.viral_score}% Viral Yield
                    </span>
                  </div>
                  <div className="px-5 py-2.5 bg-white/5 rounded-xl text-white/90 uppercase text-[12px] font-black border border-white/5 tracking-widest italic group-hover:bg-neon-cyan/10 transition-colors">
                    {trend.platform}
                  </div>
                </div>

                <div className="space-y-5 flex-1">
                  <h3 className="text-3xl font-black text-white group-hover:text-neon-cyan transition-colors leading-[1.05] italic uppercase tracking-tighter">
                    {trend.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-bold italic uppercase tracking-tight opacity-80">
                    {trend.description}
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 space-y-8">
                  <div className="flex flex-wrap gap-2.5">
                    {trend.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[11px] font-black px-5 py-2.5 bg-white/5 text-gray-400 rounded-[14px] border border-white/5 uppercase tracking-[0.1em] italic group-hover:border-white/10 group-hover:text-white transition-all">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[12px] font-black font-mono text-white/80 uppercase tracking-widest italic">
                      <Globe size={16} className="text-neon-cyan" />
                      <span>{trend.country || 'GLOBAL_NODE'}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedTrend(trend)}
                      className="btn-standard px-8 py-3"
                    >
                      Analyze <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Production Extraction Modal */}
      <AnimatePresence>
        {selectedTrend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl" onClick={() => setSelectedTrend(null)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-3xl glass-ultra rounded-[64px] p-12 lg:p-16 border border-white/10 relative z-10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan opacity-50" />
              
              <button 
                onClick={() => setSelectedTrend(null)}
                className="absolute top-12 right-12 p-5 bg-white/5 rounded-[24px] text-gray-600 hover:text-white hover:bg-white/10 transition-all border border-white/5 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-neon-cyan font-mono text-[11px] font-black uppercase tracking-[0.5em] italic">
                    <Terminal size={18} />
                    Extraction Protocol Initialized
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Trigger <span className="text-neon-cyan">Synthesis</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-10 bg-black/40 rounded-[40px] border border-white/5 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Target size={80} className="text-neon-cyan" />
                    </div>
                    <div className="space-y-6 relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-[0.3em]">Viral Signal</span>
                        <p className="text-lg font-black text-white italic uppercase leading-tight">{selectedTrend.title}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-[0.3em]">Origin Node</span>
                        <p className="text-lg font-black text-neon-cyan italic uppercase">{selectedTrend.country || 'GLOBAL_CORE'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 bg-white/[0.02] rounded-[40px] border border-white/5 flex flex-col justify-center gap-8 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-neon-purple/[0.02] blur-3xl" />
                     <div className="space-y-2 relative z-10">
                        <span className="text-[10px] font-black font-mono text-gray-600 uppercase tracking-[0.3em]">Probability Matrix</span>
                        <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{selectedTrend.viral_score}%</p>
                        <p className="text-[9px] font-black text-neon-green uppercase tracking-[0.4em] pt-2 italic">Yield Optimistic</p>
                     </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4 justify-center">
                     <div className="h-[1px] flex-1 bg-white/5" />
                     <p className="text-[10px] text-gray-700 font-black font-mono uppercase tracking-[0.5em] italic">Operations Core</p>
                     <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  
                  <button 
                    disabled={isOrdering}
                    onClick={() => handleStartProduction(selectedTrend)}
                    className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.4em] text-xs rounded-[32px] hover:bg-neon-cyan hover:text-white hover:shadow-[0_0_60px_rgba(0,245,255,0.3)] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 group"
                  >
                    {isOrdering ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <>
                        Commence Extraction Cycle
                        <Zap size={20} className="group-hover:fill-current transition-all" />
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-gray-600 text-center font-bold uppercase tracking-[0.2em] italic opacity-50">
                    Executing this action will consume 1 production credit and initialize automated asset synthesis.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
