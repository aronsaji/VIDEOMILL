import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Flame, Video, RefreshCw, Search, ArrowUpRight, 
  X, Activity, Globe, Sparkles, TrendingUp,
  BarChart3, Zap, ShieldAlert, Cpu, Radio, Terminal, Target,
  Filter, ChevronRight, Play
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

  const glassStyle = {
    background: 'rgba(31, 31, 35, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
  };

  // Top 3 trends for hot concepts
  const hotConcepts = filteredTrends.slice(0, 3);
  // Pulse wave heights (simulated from trends data)
  const pulseHeights = [40, 60, 85, 100, 70, 50, 30, 45, 65, 90, 75, 40];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 px-4 lg:px-0">
      {/* Hero Header */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Data Stream</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-3xl font-semibold text-white uppercase tracking-tight">TREND RADAR</h2>
            <p className="text-base text-zinc-400 max-w-xl mt-1">
              Real-time social media analysis across global neural networks. Instant content synthesis available for all detected clusters.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchTrends()}
              className="bg-zinc-900 border border-zinc-700 px-3 py-1 rounded hover:border-violet-500 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="text-xs font-bold uppercase tracking-widest">Sync</span>
            </button>
          </div>
        </div>
      </section>

      {/* Radar Visualization + Pulse Wave */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* Radar Display */}
        <div
          className="xl:col-span-8 rounded-xl overflow-hidden relative min-h-[500px] p-4 flex items-center justify-center"
          style={{
            ...glassStyle,
            backgroundImage: 'radial-gradient(circle, rgba(53,52,54,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          {/* Scanline */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, rgba(139,92,246,0.02) 50%)',
              backgroundSize: '100% 4px',
            }}
          />

          {/* Radar Circles */}
          <div className="relative w-full max-w-[450px] aspect-square rounded-full border border-zinc-800 flex items-center justify-center">
            <div className="absolute w-[80%] h-[80%] border border-zinc-800 rounded-full"></div>
            <div className="absolute w-[60%] h-[60%] border border-zinc-800 rounded-full"></div>
            <div className="absolute w-[40%] h-[40%] border border-zinc-800 rounded-full"></div>
            <div className="absolute w-[20%] h-[20%] border border-zinc-800 rounded-full"></div>

            {/* Radar Sweep Line */}
            <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent to-violet-500 origin-left -rotate-45"></div>

            {/* Dynamic Trend Nodes */}
            {filteredTrends.slice(0, 5).map((trend, i) => {
              const positions = [
                { top: '20%', right: '30%' },
                { bottom: '25%', left: '20%' },
                { top: '60%', right: '15%' },
                { top: '35%', left: '25%' },
                { bottom: '40%', right: '25%' },
              ];
              const sizes = ['w-3 h-3', 'w-2 h-2', 'w-4 h-4', 'w-2 h-2', 'w-3 h-3'];
              const colors = ['bg-violet-500', 'bg-emerald-400', 'bg-violet-400', 'bg-violet-500', 'bg-emerald-400'];
              const shadows = [
                'shadow-[0_0_12px_rgba(139,92,246,0.6)]',
                'shadow-[0_0_10px_rgba(52,211,153,0.6)]',
                'shadow-[0_0_15px_rgba(139,92,246,0.6)]',
                'shadow-[0_0_10px_rgba(139,92,246,0.6)]',
                'shadow-[0_0_10px_rgba(52,211,153,0.6)]',
              ];
              return (
                <div
                  key={trend.id}
                  className="absolute group cursor-pointer"
                  style={positions[i]}
                >
                  <div className={`${sizes[i]} ${colors[i]} rounded-full ${shadows[i]} animate-pulse`}></div>
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    style={glassStyle}
                  >
                    <span className="text-xs font-mono text-white">#{trend.tags?.[0] || trend.title?.slice(0, 15)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Radar Stats Overlays */}
          <div className="absolute top-6 left-6 flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Signal strength</span>
            <div className="flex gap-[2px]">
              <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <div className="w-1 h-3 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <div className="w-1 h-3 bg-zinc-800"></div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Tracking {filteredTrends.length} nodes</p>
            <p className="text-xl font-['Space_Grotesk'] font-medium text-white">ACTIVE_RADAR.v4</p>
          </div>
        </div>

        {/* Pulse Wave + Hot Concepts */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Pulse Metric */}
          <div className="p-4 rounded-xl" style={glassStyle}>
            <h3 className="text-xs font-bold text-violet-400 mb-4 uppercase tracking-widest">Social Pulse Wave</h3>
            <div className="h-32 w-full relative flex items-end gap-[2px]">
              {pulseHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all"
                  style={{
                    height: `${h}%`,
                    background: h >= 90 ? '#8B5CF6' : `rgba(139, 92, 246, ${0.15 + (h / 200)})`,
                    boxShadow: h >= 90 ? '0 0 10px rgba(139,92,246,0.3)' : 'none',
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-zinc-500 font-mono">
              <span>00:00:00</span>
              <span>PEAK DETECTED</span>
              <span>LIVE_SYNC</span>
            </div>
          </div>

          {/* Hot Concepts List */}
          <div className="p-4 rounded-xl flex-1" style={glassStyle}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Hot Concepts</h3>
              <span className="text-xs text-emerald-400 font-mono">+24% VELOCITY</span>
            </div>
            <div className="space-y-3">
              {hotConcepts.length > 0 ? hotConcepts.map((trend) => (
                <div
                  key={trend.id}
                  onClick={() => setSelectedTrend(trend)}
                  className="flex items-center justify-between p-3 border border-zinc-800 rounded bg-zinc-900/50 group hover:border-violet-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-violet-400" />
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{trend.title?.slice(0, 25)}</p>
                      <p className="text-[10px] text-zinc-500">{trend.viral_score}% Viral Score</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600 group-hover:text-violet-400 transition-colors" />
                </div>
              )) : (
                <div className="text-center py-8 text-zinc-600 text-xs uppercase tracking-widest">
                  No trends detected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bento Trend Analysis */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl flex flex-col justify-between h-64 relative group overflow-hidden p-4" style={glassStyle}>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Visual Style</span>
            <h4 className="text-xl font-['Space_Grotesk'] font-medium text-white uppercase mt-1">Brutalism x Neon</h4>
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <p className="text-xs text-zinc-500 font-mono">ADOPTION RATE: 78%</p>
            <button className="bg-violet-500 text-white p-2 rounded flex items-center justify-center hover:bg-violet-600 transition-colors">
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="rounded-xl flex flex-col justify-between h-64 relative group overflow-hidden p-4" style={glassStyle}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Audio Signature</span>
            <h4 className="text-xl font-['Space_Grotesk'] font-medium text-white uppercase mt-1">Industrial Ambient</h4>
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <p className="text-xs text-zinc-500 font-mono">TRENDING_REVERB: HIGH</p>
            <button className="bg-violet-500 text-white p-2 rounded flex items-center justify-center hover:bg-violet-600 transition-colors">
              <Play size={14} />
            </button>
          </div>
        </div>

        <div className="rounded-xl flex flex-col justify-between h-64 p-4" style={{ ...glassStyle, borderColor: 'rgba(139,92,246,0.3)' }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Quick Synthesis</span>
              <h4 className="text-xl font-['Space_Grotesk'] font-medium text-white uppercase mt-1">Deploy Content</h4>
            </div>
            <Sparkles size={20} className="text-violet-500 animate-pulse" />
          </div>
          <p className="text-sm text-zinc-400">Instantly generate a 15s series based on the top 3 detected trends.</p>
          <button className="w-full bg-violet-500 hover:bg-violet-600 text-white font-['Space_Grotesk'] font-bold uppercase tracking-widest py-3 rounded shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-colors">
            Launch Video Factory
          </button>
        </div>
      </section>

      {/* Production Extraction Modal */}
      <AnimatePresence>
        {selectedTrend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedTrend(null)} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="w-full max-w-3xl relative z-10 overflow-hidden rounded-xl p-10 lg:p-16"
              style={glassStyle}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-violet-500/50" />
              
              <button 
                onClick={() => setSelectedTrend(null)}
                className="absolute top-6 right-6 p-3 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700 group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-violet-400 font-mono text-xs font-bold uppercase tracking-widest">
                    <Terminal size={16} />
                    Extraction Protocol Initialized
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white uppercase tracking-tighter leading-none">
                    Trigger <span className="text-violet-400">Synthesis</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-6 relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold font-mono text-zinc-500 uppercase tracking-widest">Viral Signal</span>
                        <p className="text-lg font-bold text-white uppercase leading-tight">{selectedTrend.title}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold font-mono text-zinc-500 uppercase tracking-widest">Origin Node</span>
                        <p className="text-lg font-bold text-violet-400 uppercase">{selectedTrend.country || 'GLOBAL_CORE'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-900/30 rounded-xl border border-zinc-800 flex flex-col justify-center gap-4 text-center">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold font-mono text-zinc-500 uppercase tracking-widest">Probability Matrix</span>
                      <p className="text-5xl font-black text-white tracking-tighter leading-none">{selectedTrend.viral_score}%</p>
                      <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest pt-2">Yield Optimistic</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <p className="text-[10px] text-zinc-600 font-bold font-mono uppercase tracking-widest">Operations Core</p>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  
                  <button 
                    disabled={isOrdering}
                    onClick={() => handleStartProduction(selectedTrend)}
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white font-['Space_Grotesk'] font-bold uppercase tracking-widest py-5 rounded shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isOrdering ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <>
                        Commence Extraction Cycle
                        <Zap size={20} />
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest opacity-50">
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
