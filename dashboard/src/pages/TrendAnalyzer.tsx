import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { 
  Flame, Video, RefreshCw, Plus, ExternalLink, ArrowUpRight, 
  X, Monitor, Smartphone, Send, Heart, CheckCircle, Activity,
  Globe, Zap, Sparkles, Filter, Search
} from 'lucide-react';
import type { TrendingTopic } from '../types';
import { triggerProduction } from '../lib/api';

const INITIAL_SOCIAL_ACCOUNTS = [
  { id: 'acc1', platform: 'youtube', handle: '@VideoMillOfficial', icon: Monitor },
  { id: 'acc2', platform: 'tiktok', handle: '@VideoMill.no', icon: Smartphone },
  { id: 'acc3', platform: 'instagram', handle: '@videomill_daily', icon: Heart },
];

export default function TrendAnalyzer() {
  const { trends = [], isLoading, fetchInitialData, fetchTrends } = usePipelineStore();
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'youtube' | 'instagram' | 'snapchat'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedTrend, setSelectedTrend] = useState<TrendingTopic | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredTrends = trends.filter(t => {
    const matchesPlatform = platformFilter === 'all' || t.platform?.toLowerCase() === platformFilter;
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
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
      console.error('Trend produksjon feilet:', err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]"
          >
            <Activity size={14} />
            Global Intelligence
          </motion.div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Trend <span className="text-neon-cyan">Radar</span>
          </h1>
          <p className="text-gray-500 max-w-md">
            Sanntids-analyse av hva som trender på sosiale medier akkurat nå.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Søk i trender..."
              className="bg-surface/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-neon-cyan/30 outline-none w-64 backdrop-blur-md"
            />
          </div>
          <button 
            onClick={() => fetchTrends()}
            className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'tiktok', 'youtube', 'instagram', 'snapchat'].map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p as any)}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border uppercase tracking-widest ${
              platformFilter === p 
                ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTrends.map((trend, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              key={trend.id}
              className="group glass-morphism rounded-3xl p-6 border-white/5 hover:border-neon-cyan/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 px-2 py-1 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
                    <Flame size={14} className="text-neon-cyan animate-pulse" />
                    <span className="text-[10px] font-black text-neon-cyan uppercase tracking-tighter">
                      {trend.viral_score}% Viral Score
                    </span>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-gray-500 uppercase text-[10px] font-mono">
                    {trend.platform}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white group-hover:text-neon-cyan transition-colors leading-tight">
                    {trend.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {trend.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trend.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] font-mono px-2 py-1 bg-white/5 text-gray-400 rounded-md border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase">
                    <Globe size={12} />
                    <span>{trend.country || 'Global'}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTrend(trend)}
                    className="flex items-center gap-2 text-neon-cyan font-black text-xs uppercase tracking-tighter hover:gap-3 transition-all"
                  >
                    Analyze <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Production Modal */}
      <AnimatePresence>
        {selectedTrend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl glass-morphism rounded-[40px] p-10 border-white/10 relative"
            >
              <button 
                onClick={() => setSelectedTrend(null)}
                className="absolute top-8 right-8 p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs uppercase tracking-widest">
                    <Sparkles size={14} />
                    Trend Analysis Complete
                  </div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Start <span className="text-neon-cyan">Produksjon</span>
                  </h2>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500 uppercase">Valgt Trend</span>
                    <span className="text-white font-bold">{selectedTrend.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500 uppercase">Målgruppe</span>
                    <span className="text-neon-cyan">{selectedTrend.country || 'Global'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500 uppercase">Est. Viralitet</span>
                    <span className="text-green-400 font-bold">HØY ({selectedTrend.viral_score}%)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-500 font-mono leading-relaxed italic">
                    Ved å starte produksjonen vil våre agenter automatisk generere manus, tale og video basert på denne trenden.
                  </p>
                  <button 
                    disabled={isOrdering}
                    onClick={() => handleStartProduction(selectedTrend)}
                    className="w-full py-5 bg-neon-cyan text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_30px_#00f5ff] transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {isOrdering ? 'Starter Fabrikken...' : 'BEKREFT PRODUKSJON'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
