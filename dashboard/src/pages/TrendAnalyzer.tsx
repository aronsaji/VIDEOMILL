import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Globe, 
  Shield, 
  Activity, 
  AlertCircle,
  Filter,
  Languages
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';

const LANGUAGES = [
  { id: 'ALL', label: 'ALL', code: 'ALL' },
  { id: 'NO', label: 'NORSK', code: 'NO' },
  { id: 'EN', label: 'ENGLISH', code: 'EN' },
  { id: 'TA', label: 'TAMIL', code: 'TA' },
  { id: 'HI', label: 'HINDI', code: 'HI' },
  { id: 'ES', label: 'ESPAÑOL', code: 'ES' },
];

const TrendAnalyzer = () => {
  const { trends, loading, error, fetchTrends } = usePipelineStore();
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('NORWAY');
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    // If ALL is selected, we pass undefined to fetchTrends to show everything
    fetchTrends(selectedCountry, selectedLanguage === 'ALL' ? undefined : selectedLanguage);
  }, [selectedCountry, selectedLanguage]);

  const handleDispatch = async (trend: any) => {
    const success = await triggerProduction({
      action: 'viranode-generate',
      topic: trend.title,
      language: trend.language || selectedLanguage,
      video_id: `trend-${trend.id}`,
      title: trend.title,
      visual_style: 'kinetic_industrial',
      ai_voice: trend.language === 'NO' ? 'nor_male_1' : 'eng_male_premium'
    });

    if (success) {
      setLastDispatched(trend.id);
      setTimeout(() => setLastDispatched(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header - Industrial Style */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Geospatial_Trend_Locator_v3.2</span>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
          Trend <span className="text-green-500 text-outline">Radar</span>
        </h1>
      </div>

      {/* Language Tabs - Midnight Style */}
      <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5 w-fit">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              selectedLanguage === lang.code
                ? 'bg-green-500 text-black'
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5 border-dashed">
          <div className="w-6 h-6 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Scanning Frequencies...</span>
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend) => (
            <div 
              key={trend.id}
              onClick={() => handleDispatch(trend)}
              className="group bg-zinc-900/30 border border-white/5 rounded-xl p-5 hover:border-green-500/30 hover:bg-zinc-900/60 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-[9px] font-black text-green-500 uppercase px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20">
                  {trend.category || 'Viral'}
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                  {trend.viral_score}% Match
                </div>
              </div>

              <h3 className="text-white font-bold text-lg leading-tight mb-4 group-hover:text-green-400 transition-colors uppercase italic">
                {trend.title}
              </h3>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">{trend.platform}</div>
                <div className="text-[10px] font-bold text-white">{trend.growth_stat}</div>
              </div>

              {/* Status Indicator */}
              {lastDispatched === trend.id && (
                <div className="absolute inset-0 bg-green-500/90 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-black font-black uppercase text-xs tracking-widest">Neural Dispatch Sent</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-white/5 border-dashed space-y-4">
          <AlertCircle className="w-5 h-5 text-zinc-800" />
          <div className="text-center">
            <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">No Signals Detected</h3>
            <p className="text-zinc-700 text-[9px] font-mono mt-1">Adjust regional matrix or linguistic filters.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;
