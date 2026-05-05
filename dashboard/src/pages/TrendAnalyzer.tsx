import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Globe, 
  Shield, 
  Activity, 
  AlertCircle,
  LayoutGrid,
  Filter,
  Languages
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';

const COUNTRIES = [
  { id: 'GLOBAL', label: 'GLOBAL', icon: Globe },
  { id: 'NORWAY', label: 'NORWAY', icon: Shield },
  { id: 'USA', label: 'USA', icon: Activity },
];

const LANGUAGES = [
  { id: 'ALL', label: 'ALL', code: 'ALL' },
  { id: 'Norsk', label: 'Norsk (NO)', code: 'NO' },
  { id: 'English', label: 'English (EN)', code: 'EN' },
  { id: 'Tamil', label: 'Tamil (TA)', code: 'TA' },
  { id: 'Hindi', label: 'Hindi (HI)', code: 'HI' },
  { id: 'Español', label: 'Español (ES)', code: 'ES' },
];

const TrendAnalyzer = () => {
  const { trends, loading, error, fetchTrends } = usePipelineStore();
  const [selectedCountry, setSelectedCountry] = useState('NORWAY');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    fetchTrends(selectedCountry, selectedLanguage === 'ALL' ? undefined : selectedLanguage);
  }, [selectedCountry, selectedLanguage]);

  const handleDispatch = async (trend: any) => {
    const success = await triggerProduction({
      action: 'viranode-generate',
      topic: trend.title,
      language: trend.language || selectedLanguage,
      video_id: `trend-${trend.id}`,
      title: trend.title,
      visual_style: 'industrial_kinetic',
      ai_voice: trend.language === 'NO' ? 'nor_male_1' : 'eng_male_premium'
    });

    if (success) {
      setLastDispatched(trend.id);
      setTimeout(() => setLastDispatched(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Kinetic <span className="text-green-500">Radar</span>
            </h1>
          </div>
          <p className="text-zinc-400 font-mono text-sm max-w-xl">
            SYNCHRONIZING GLOBAL TREND SIGNALS. NEURAL ENGINE READY FOR DISPATCH.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Signals</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Lat: 59.9139 | Lon: 10.7522
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Country Selector */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Regional Node</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {COUNTRIES.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 border ${
                  selectedCountry === country.id
                    ? 'bg-white text-black border-white'
                    : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/20'
                }`}
              >
                <country.icon className="w-4 h-4" />
                <span className="uppercase text-sm tracking-tight">{country.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Languages className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Linguistic Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedLanguage === lang.code
                    ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20'
                    : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/10'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-black/20 rounded-3xl border border-dashed border-white/10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            <span className="text-zinc-500 font-mono text-xs animate-pulse">EXTRACTING TREND DATA...</span>
          </div>
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trends.map((trend) => (
            <div 
              key={trend.id}
              className="group relative bg-zinc-900/40 rounded-3xl border border-white/5 overflow-hidden hover:border-green-500/50 transition-all duration-500"
            >
              {/* Score Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs font-black text-white">{trend.viral_score}</span>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-colors duration-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">{trend.category}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{trend.platform} • {trend.language}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-green-400 transition-colors cursor-pointer" onClick={() => handleDispatch(trend)}>
                  {trend.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Growth</div>
                    <div className="text-sm font-black text-white">{trend.growth_stat}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Audience</div>
                    <div className="text-sm font-black text-white">{trend.target_audience}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleDispatch(trend)}
                disabled={lastDispatched === trend.id}
                className={`w-full py-4 font-black uppercase text-xs tracking-widest transition-all duration-500 border-t border-white/5 ${
                  lastDispatched === trend.id
                    ? 'bg-green-500 text-black'
                    : 'bg-black/60 text-zinc-400 group-hover:bg-green-500/10 group-hover:text-green-400'
                }`}
              >
                {lastDispatched === trend.id ? 'Neural Dispatch Sent' : 'Execute Generation'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-dashed border-white/10 space-y-4">
          <AlertCircle className="w-8 h-8 text-zinc-700" />
          <div className="text-center">
            <h3 className="text-zinc-400 font-bold uppercase tracking-widest">No Signals Found</h3>
            <p className="text-zinc-600 text-xs font-mono mt-1">TRY ADJUSTING REGIONAL OR LINGUISTIC FILTERS.</p>
          </div>
          <button 
            onClick={() => { setSelectedCountry('GLOBAL'); setSelectedLanguage('ALL'); }}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 transition-all uppercase tracking-widest"
          >
            Reset Signal Matrix
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;
