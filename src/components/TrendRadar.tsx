import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp, Clock, ExternalLink, Sparkles, Zap, Target, Filter } from 'lucide-react';
import { Trend } from '../lib/types';
import { useTrends } from '../lib/hooks/uselivedata';
import { useLanguage } from '../contexts/languageContext';
import GlassCard from './GlassCard';

interface TrendRadarProps {
  onSelectTrend?: (trend: Trend) => void;
}

const getHeatColor = (heat: string | undefined) => {
  switch (heat) {
    case 'fire': return { bg: 'bg-violet-500', text: 'text-white', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.5)]' };
    case 'hot': return { bg: 'bg-amber-500', text: 'white', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' };
    case 'rising': return { bg: 'bg-teal-500', text: 'white', glow: 'shadow-[0_0_20px_rgba(20,184,166,0.4)]' };
    case 'high': return { bg: 'bg-violet-500', text: 'white', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]' };
    case 'medium': return { bg: 'bg-blue-500', text: 'white', glow: '' };
    default: return { bg: 'bg-white/20', text: 'white/60', glow: '' };
  }
};

export default function TrendRadar({ onSelectTrend }: TrendRadarProps) {
  const { t } = useLanguage();
  const { data: trends, loading, refresh } = useTrends();
  const [filter, setFilter] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  const filteredTrends = useMemo(() => {
    if (filter === 'all') return trends;
    return trends.filter(tr => tr.platform?.toLowerCase().includes(filter));
  }, [trends, filter]);

  const platforms = ['all', ...new Set(trends.map(tr => tr.platform?.toLowerCase()).filter(Boolean))];

  const handleSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    onSelectTrend?.(trend);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={16} className="text-white/40" />
        {platforms.map(platform => (
          <button
            key={platform}
            onClick={() => setFilter(platform)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === platform
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {platform === 'all' ? 'All' : platform}
          </button>
        ))}
      </div>

      {/* Radar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTrends.map((trend, index) => {
            const colors = getHeatColor(trend.heat_level);
            const isSelected = selectedTrend?.id === trend.id;
            
            return (
              <motion.button
                key={trend.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => handleSelect(trend)}
                className={`relative p-4 rounded-2xl text-left transition-all duration-300 ${
                  isSelected
                    ? 'bg-violet-500/20 border-2 border-violet-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/10'
                } ${colors.glow}`}
              >
                {/* Viral Score Badge */}
                <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.glow}`}>
                  <span className={`text-xs font-bold ${colors.text}`}>{trend.viral_score ?? '—'}</span>
                </div>

                {/* Heat Level */}
                {trend.heat_level && (
                  <div className={`absolute -top-2 -left-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${colors.bg} ${colors.text}`}>
                    <Flame size={10} />
                    {trend.heat_level}
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white pr-12">{trend.title}</h3>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-white/40 uppercase">
                      {trend.platform || 'unknown'}
                    </span>
                    {(trend.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 text-white/60 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1 text-white/40">
                      <TrendingUp size={12} />
                      <span className="text-[10px]">viral</span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-lg bg-teal-500/20"
                    >
                      <Sparkles size={14} className="text-teal-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Selection Glow */}
                {isSelected && (
                  <motion.div
                    layoutId="selectionGlow"
                    className="absolute inset-0 rounded-2xl border-2 border-violet-500/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTrends.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Target size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40">No trends found</p>
          <button onClick={refresh} className="mt-4 btn-violet">
            Refresh
          </button>
        </GlassCard>
      )}
    </div>
  );
}