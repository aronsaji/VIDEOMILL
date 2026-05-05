import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Search, Globe, MessageSquare, 
  ArrowUpRight, BarChart3, Clock, Zap,
  Activity, Filter, Languages, Target, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { supabase } from '../lib/supabase';
import { useI18nStore } from '../store/i18nStore';

export default function TrendAnalyzer() {
  const { t } = useI18nStore();
  const { trends, fetchTrends, generateFromTrend } = usePipelineStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchTrends(selectedCountries, selectedLanguages);
  }, [selectedCountries, selectedLanguages]);

  const toggleCountry = (id: string) => {
    setSelectedCountries(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (id: string) => {
    setSelectedLanguages(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const countries = [
    { id: 'US', name: 'USA', flag: '🇺🇸' },
    { id: 'NO', name: 'Norge', flag: '🇳🇴' },
    { id: 'IN-TA', name: 'India (Tamil)', flag: '🇮🇳' },
    { id: 'IN-HI', name: 'India (Hindi)', flag: '🇮🇳' },
    { id: 'FR', name: 'Frankrike', flag: '🇫🇷' },
    { id: 'UK', name: 'UK', flag: '🇬🇧' },
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'no', name: 'Norsk' },
    { id: 'ta', name: 'Tamil' },
    { id: 'hi', name: 'Hindi' },
    { id: 'fr', name: 'Français' },
  ];

  const filteredTrends = (trends || []).filter(trend => 
    trend.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trend.hashtags?.some((h: string) => h.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGenerate = async (trend: any) => {
    setIsGenerating(trend.id);
    try {
      await generateFromTrend(trend);
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-[#424843] pb-10">
        <div>
          <div className="flex items-center gap-4 text-[#b1cdb7] font-label-sm text-[11px] font-bold uppercase tracking-[0.4em] mb-4 italic">
            <Activity size={18} className="animate-pulse" />
            GLOBAL_NEURAL_MONITOR_v4
          </div>
          <h1 className="font-headline-lg text-[#e4e2e0] uppercase italic tracking-tighter leading-none">
            {t('TREND_RADAR')}
          </h1>
        </div>
        <div className="flex gap-6 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8c928c] group-focus-within:text-[#b1cdb7] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Intercept trends..."
              className="w-full bg-[#1b1c1a] border border-[#424843] py-5 pl-16 pr-8 rounded-soft-lg text-[13px] text-[#e4e2e0] focus:ring-1 focus:ring-[#b1cdb7]/30 focus:border-[#b1cdb7] outline-none font-label-sm placeholder:text-[#8c928c]/20 transition-all font-bold tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Intelligence Controls - Panel System */}
        <aside className="lg:col-span-3 space-y-10">
          <section className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#b1cdb7]/5 blur-[40px] rounded-full" />
            
            <div className="space-y-8 relative z-10">
               <div className="flex items-center gap-4 text-[#b1cdb7]">
                  <Globe size={22} />
                  <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] italic">Geospatial_Targeting</h3>
               </div>
               <div className="flex flex-col gap-3">
                  {countries.map(country => (
                    <button
                      key={country.id}
                      onClick={() => toggleCountry(country.id)}
                      className={`flex items-center justify-between p-4 rounded-soft border transition-all font-label-sm group/btn ${
                        selectedCountries.includes(country.id)
                          ? 'bg-[#2d4535] border-[#b1cdb7]/30 text-[#b1cdb7]'
                          : 'bg-[#131412] border-[#424843] text-[#8c928c] hover:border-[#b1cdb7]/40'
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span className="grayscale opacity-60 group-hover/btn:grayscale-0 group-hover/btn:opacity-100 transition-all text-lg">{country.flag}</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest">{country.name}</span>
                      </span>
                      {selectedCountries.includes(country.id) && <div className="w-1.5 h-1.5 rounded-full bg-[#b1cdb7] shadow-[0_0_8px_#b1cdb7]" />}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-8 relative z-10 pt-10 border-t border-[#424843]">
               <div className="flex items-center gap-4 text-[#bec9bf]">
                  <Languages size={22} />
                  <h3 className="font-label-sm text-[12px] font-bold uppercase tracking-[0.2em] italic">Linguistic_Decode</h3>
               </div>
               <div className="flex flex-col gap-3">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`flex items-center justify-between p-4 rounded-soft border transition-all font-label-sm group/btn ${
                        selectedLanguages.includes(lang.id)
                          ? 'bg-[#414c44] border-[#bec9bf]/30 text-[#bec9bf]'
                          : 'bg-[#131412] border-[#424843] text-[#8c928c] hover:border-[#bec9bf]/40'
                      }`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-widest">{lang.name}</span>
                      {selectedLanguages.includes(lang.id) && <div className="w-1.5 h-1.5 rounded-full bg-[#bec9bf] shadow-[0_0_8px_#bec9bf]" />}
                    </button>
                  ))}
               </div>
            </div>
          </section>

          <div className="p-8 bg-[#b1cdb7]/5 border border-[#b1cdb7]/10 rounded-soft-xl">
             <div className="flex items-center gap-4 mb-4">
                <Target size={18} className="text-[#b1cdb7]" />
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-widest text-[#b1cdb7] italic">Neural_Focus</span>
             </div>
             <p className="font-body-md text-[13px] text-[#8c928c] leading-relaxed italic">
               Currently monitoring <span className="text-[#b1cdb7] font-bold">{selectedCountries.length}</span> sectors with <span className="text-[#b1cdb7] font-bold">{selectedLanguages.length}</span> linguistic interceptors active.
             </p>
          </div>
        </aside>

        {/* Trend Feed */}
        <div className="lg:col-span-9 space-y-10">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
               <h2 className="text-2xl font-bold text-[#e4e2e0] font-headline-md italic uppercase tracking-tighter">Live_Signal_Feed</h2>
               <div className="px-4 py-1.5 bg-[#1b1c1a] border border-[#424843] rounded-soft-sm font-label-sm text-[10px] text-[#b1cdb7] font-bold uppercase italic tracking-widest">
                 {filteredTrends.length} Clusters Found
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTrends.map((trend, i) => (
                <motion.div
                  key={trend.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#1b1c1a] border border-[#424843] p-10 rounded-soft-xl space-y-8 group hover:border-[#b1cdb7]/40 transition-all shadow-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="p-3 bg-[#b1cdb7]/10 border border-[#b1cdb7]/20 rounded-soft text-[#b1cdb7]">
                      <TrendingUp size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="font-label-sm text-[10px] text-[#b1cdb7] font-bold uppercase tracking-[0.2em] italic">Impact_Score</span>
                       <span className="text-2xl font-bold text-[#e4e2e0] font-headline-md italic">{trend.score || '92.4'}</span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-bold text-[#e4e2e0] uppercase italic tracking-tight group-hover:text-[#b1cdb7] transition-colors leading-tight">
                      {trend.topic}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {trend.hashtags?.map((tag: string) => (
                        <span key={tag} className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic opacity-60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[#424843] flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(j => (
                          <div key={j} className="w-8 h-8 rounded-full bg-[#131412] border-2 border-[#1b1c1a] flex items-center justify-center overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trend.topic}-${j}`} alt="" className="w-full h-full object-cover opacity-60" />
                          </div>
                        ))}
                      </div>
                      <span className="font-label-sm text-[10px] text-[#8c928c] uppercase font-bold italic">Cluster_Active</span>
                    </div>
                    <button 
                      onClick={() => handleGenerate(trend)}
                      disabled={isGenerating === trend.id}
                      className={`flex items-center gap-4 px-6 py-4 rounded-soft-lg font-label-sm text-[11px] font-bold uppercase tracking-widest transition-all italic ${
                        isGenerating === trend.id
                          ? 'bg-[#1b1c1a] border border-[#424843] text-[#8c928c] cursor-not-allowed'
                          : 'bg-[#2d4535] text-[#b1cdb7] border border-[#b1cdb7]/20 hover:bg-[#b1cdb7] hover:text-[#1d3526]'
                      }`}
                    >
                      {isGenerating === trend.id ? (
                        <>In_Production <Activity size={14} className="animate-spin" /></>
                      ) : (
                        <>Forge_Order <ArrowUpRight size={14} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
