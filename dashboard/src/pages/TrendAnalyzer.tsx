import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Globe, 
  Activity, 
  AlertCircle,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';

const TrendAnalyzer = () => {
  const { trends, isLoading, uniqueCountries, uniqueLanguages, fetchTrends, fetchFilterOptions } = usePipelineStore();
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [lastDispatched, setLastDispatched] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchTrends(
      selectedCountry === 'ALL' ? undefined : selectedCountry,
      selectedLanguage === 'ALL' ? undefined : selectedLanguage
    );
  }, [selectedCountry, selectedLanguage]);

  const handleDispatch = async (trend: any) => {
    const success = await triggerProduction({
      action: 'viranode-generate',
      topic: trend.title,
      language: trend.language || selectedLanguage,
      video_id: `trend-${trend.id}`,
      title: trend.title,
      visual_style: 'kinetic_industrial',
      ai_voice: trend.language === 'no' ? 'nor_male_1' : 'eng_male_premium'
    });

    if (success) {
      setLastDispatched(trend.id);
      setTimeout(() => setLastDispatched(null), 3000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span className="font-label-sm text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Geospatial Trend Locator v3.2</span>
          </div>
          <h1 className="font-headline-lg text-4xl font-black text-white tracking-tighter uppercase italic">
            Trend <span className="text-[#22D3EE]">Radar</span>
          </h1>
        </div>
        <button 
          onClick={async () => {
            const { supabase } = await import('../lib/supabase');
            const newTrends = [
              { title: "AI Video Revolution: Sora vs Kling", topic: "AI_VIDEO", growth_stat: "95% INCREASE", viral_score: 98, country: "GLOBAL", language: "english" },
              { title: "NVIDIA Blackwell: Future of Compute", topic: "GPU_TECH", growth_stat: "120% INCREASE", viral_score: 95, country: "GLOBAL", language: "english" },
              { title: "SpaceX Starship: Mars Mission Prep", topic: "SPACE_X", growth_stat: "85% INCREASE", viral_score: 92, country: "GLOBAL", language: "english" },
              { title: "Sustainable Tech: Green Energy 2026", topic: "GREEN_TECH", growth_stat: "40% INCREASE", viral_score: 88, country: "GLOBAL", language: "english" },
              { title: "Neural Interfaces: Link to the Mind", topic: "NEURALINK", growth_stat: "INCREASING", viral_score: 85, country: "GLOBAL", language: "english" }
            ];
            await supabase.from('trending_topics').insert(newTrends);
            window.location.reload();
          }}
          className="px-6 py-3 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] font-headline-md text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#22D3EE] hover:text-black transition-all flex items-center gap-2"
        >
          <Zap size={14} />
          Emergency Recon
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#0A0A0A] border border-white/5 p-8 rounded-xl">
        <div className="space-y-4">
          <label className="font-headline-md text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} /> Target Region
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded transition-all ${
                selectedCountry === 'ALL'
                  ? 'bg-[#22D3EE] text-black border-[#22D3EE]'
                  : 'text-zinc-500 border-white/10 hover:border-white/30'
              }`}
            >
              GLOBAL
            </button>
            {uniqueCountries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded transition-all ${
                  selectedCountry === c
                    ? 'bg-[#22D3EE] text-black border-[#22D3EE]'
                    : 'text-zinc-500 border-white/10 hover:border-white/30'
                }`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="font-headline-md text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={12} /> Signal Language
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage('ALL')}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded transition-all ${
                selectedLanguage === 'ALL'
                  ? 'bg-[#22D3EE] text-black border-[#22D3EE]'
                  : 'text-zinc-500 border-white/10 hover:border-white/30'
              }`}
            >
              ALL SIGNALS
            </button>
            {uniqueLanguages.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded transition-all ${
                  selectedLanguage === l
                    ? 'bg-[#22D3EE] text-black border-[#22D3EE]'
                    : 'text-zinc-500 border-white/10 hover:border-white/30'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-lg border border-white/5" />
          ))}
        </div>
      ) : trends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...trends]
            .sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0))
            .map((trend) => (
            <div 
              key={trend.id}
              className="bg-[#0A0A0A] border border-white/5 p-8 rounded-lg relative overflow-hidden group hover:border-[#22D3EE]/50 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[9px] font-black uppercase tracking-widest rounded">
                  {trend.category || 'Viral Signal'}
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-label-sm text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Viral Score</span>
                  <span className="font-headline-lg text-xl font-black text-white">{trend.viral_score}%</span>
                </div>
              </div>

              <h3 className="font-headline-md text-xl font-black text-white uppercase italic tracking-tight mb-8 group-hover:text-[#22D3EE] transition-colors line-clamp-2 min-h-[3.5rem]">
                {trend.title}
              </h3>

              <div className="space-y-6 mt-auto">
                <div className="flex items-center justify-between font-label-sm text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-[#22D3EE]" />
                    <span>{trend.growth_stat || 'High Growth'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>2h ago</span>
                  </div>
                </div>

                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#22D3EE] transition-all duration-1000 ease-out shadow-[0_0_10px_#22D3EE]"
                    style={{ width: `${trend.viral_score}%` }}
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleDispatch(trend)}
                    className="flex-1 py-4 bg-[#22D3EE] text-black font-headline-md text-[10px] font-black uppercase tracking-widest rounded hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    Create Video
                  </button>
                  <button className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded flex items-center justify-center hover:bg-white/10 transition-all">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              {lastDispatched === trend.id && (
                <div className="absolute inset-0 bg-[#22D3EE] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <Zap size={48} className="text-black mb-4 animate-bounce" />
                  <span className="text-black font-black uppercase text-xs tracking-[0.3em]">Signal Dispatched</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-2xl">
          <Radar size={48} className="text-zinc-800 mb-8 animate-pulse" />
          <h3 className="font-headline-md text-xl font-black text-white mb-4 uppercase italic">No Signals Detected</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-10 font-body-md uppercase text-xs tracking-widest leading-loose">
            The neural intercept is silent. Use the Emergency Recon module above to initialize historical data.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendAnalyzer;
