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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              TREND <span className="text-cyan-500">RADAR</span>
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            GEOSPATIAL_TREND_LOCATOR_v3.2 | LIVE_INTERCEPT_STREAM
          </p>
        </div>
      </div>

      {/* Clean Language Selector */}
      <div className="bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-md inline-flex flex-wrap gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`px-8 py-3 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              selectedLanguage === lang.code
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'text-zinc-600 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Results Matrix */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
          <div className="flex flex-col items-center gap-4 font-mono">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-[10px] text-cyan-500/50 uppercase tracking-[0.3em]">Decoding Signals...</span>
          </div>
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend) => (
            <div 
              key={trend.id}
              onClick={() => handleDispatch(trend)}
              className="group relative bg-zinc-900/20 rounded-2xl border border-white/5 p-6 hover:border-cyan-500/50 hover:bg-zinc-900/40 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-bold text-cyan-400 uppercase tracking-tighter">
                    {trend.category || 'Viral'}
                  </div>
                  <div className="text-[10px] font-black text-white/40 italic">{trend.viral_score}% MATCH</div>
                </div>

                <h3 className="text-lg font-bold text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors uppercase italic tracking-tighter">
                  {trend.title}
                </h3>

                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  <span>{trend.platform}</span>
                  <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <span>{trend.growth_stat}</span>
                </div>
              </div>

              {/* Progress Bar Decor */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-cyan-500/10 w-full">
                <div className="h-full bg-cyan-500 w-1/3 animate-[slide_3s_infinite]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-dashed border-white/10 space-y-4">
          <AlertCircle className="w-6 h-6 text-zinc-800" />
          <div className="text-center">
            <h3 className="text-zinc-700 font-black text-[10px] uppercase tracking-[0.3em]">No Signal Matrix Available</h3>
            <p className="text-zinc-800 text-[9px] font-mono mt-2 uppercase tracking-widest">Adjust filters to intercept data streams</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default TrendAnalyzer;
