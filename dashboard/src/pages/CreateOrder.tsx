import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Globe, Mic2, Send, 
  TrendingUp, CheckCircle2, AlertCircle,
  Activity, Radio, Sparkles, User, 
  ChevronRight, Box, Play
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sendToN8n } from '../lib/api';

const LANGUAGES = [
  { code: 'no', label: 'Norwegian', flag: '🇳🇴', voices: [{ id: 'male', label: 'Morten' }, { id: 'female', label: 'Liv' }] },
  { code: 'en', label: 'English (US)', flag: '🇺🇸', voices: [{ id: 'male', label: 'Adam' }, { id: 'female', label: 'Emma' }] },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', voices: [{ id: 'male', label: 'Diego' }, { id: 'female', label: 'Sofia' }] },
  { code: 'de', label: 'German', flag: '🇩🇪', voices: [{ id: 'male', label: 'Hans' }, { id: 'female', label: 'Marta' }] },
  { code: 'fr', label: 'French', flag: '🇫🇷', voices: [{ id: 'male', label: 'Louis' }, { id: 'female', label: 'Chloe' }] },
  { code: 'in-hi', label: 'Hindi', flag: '🇮🇳', voices: [{ id: 'male', label: 'Arjun' }, { id: 'female', label: 'Ananya' }] },
];

const CHANNELS = [
  { id: 'tiktok', label: 'TikTok', icon: '📱' },
  { id: 'youtube', label: 'YT Shorts', icon: '🎬' },
  { id: 'instagram', label: 'IG Reels', icon: '📸' },
  { id: 'facebook', label: 'FB Watch', icon: '👥' },
];

export default function CreateOrder() {
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [voice, setVoice] = useState(LANGUAGES[0].voices[1]);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHotTrends();
  }, []);

  const fetchHotTrends = async () => {
    const { data } = await supabase
      .from('trending_topics')
      .select('*')
      .eq('active', true)
      .order('viral_score', { ascending: false })
      .limit(5);
    setTrends(data || []);
  };

  const handleTrendClick = (trend: any) => {
    setSelectedTrend(trend);
    setTopic(trend.title);
    
    // Auto-select language based on trend if possible
    const trendLang = LANGUAGES.find(l => 
      l.label.toLowerCase() === trend.language?.toLowerCase() || 
      l.code.toLowerCase() === trend.language?.toLowerCase()
    );
    if (trendLang) {
      setLanguage(trendLang);
      setVoice(trendLang.voices[1]); // Default to female
    }
  };

  const handleLanguageChange = (langCode: string) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    if (lang) {
      setLanguage(lang);
      setVoice(lang.voices[1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      topic: topic,
      language: language.code,
      voice: voice.id,
      platform: channel.id,
      viral_score: selectedTrend?.viral_score || 85,
      category: selectedTrend?.category || 'general',
      tags: selectedTrend?.tags || []
    };

    try {
      const ok = await sendToN8n(payload);
      if (ok) {
        setSuccess(true);
        setTopic('');
        setSelectedTrend(null);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 text-primary-container font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            Neural_Dispatch_Matrix_v4.2
          </div>
          <h1 className="text-6xl font-black text-white font-headline-md tracking-tighter italic uppercase leading-none">
            Forge_<span className="text-primary-container">Order</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-surface-container-low border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
              <Activity size={18} className="text-[#6bff83] animate-pulse" />
              <div>
                <p className="text-[9px] font-mono text-zinc-700 uppercase font-black">Node_Status</p>
                <p className="text-xs font-black text-white uppercase italic">Ready for Dispatch</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Left: Configuration Form */}
        <div className="col-span-12 lg:col-span-7 space-y-10">
          <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="scanline-overlay absolute inset-0 opacity-5 pointer-events-none" />
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              {/* Topic Input */}
              <div className="space-y-4">
                <label className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest ml-6">Primary_Topic_Input</label>
                <div className="relative group/input">
                  <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-container opacity-20 group-focus-within/input:opacity-100 transition-opacity" size={20} />
                  <input 
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ENTER PRODUCTION SUBJECT..."
                    className="w-full bg-black border border-white/5 rounded-3xl py-8 pl-16 pr-8 text-lg text-white font-headline-md italic font-black uppercase tracking-tight focus:outline-none focus:border-primary-container/50 transition-all placeholder:text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Language Selection */}
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest ml-4 flex items-center gap-2">
                    <Globe size={12} /> Neural_Language
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`p-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          language.code === lang.code 
                            ? 'bg-primary-container text-black border-primary-container shadow-lg' 
                            : 'bg-black/40 border-white/5 text-zinc-600 hover:border-white/20'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Selection */}
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest ml-4 flex items-center gap-2">
                    <Mic2 size={12} /> Vocal_Identity
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {language.voices.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVoice(v)}
                        className={`p-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-between px-6 ${
                          voice.id === v.id 
                            ? 'bg-white text-black border-white shadow-lg' 
                            : 'bg-black/40 border-white/5 text-zinc-600 hover:border-white/20'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <User size={14} />
                          {v.label}
                        </span>
                        <span className="opacity-40 italic">{v.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Channel Selection */}
              <div className="space-y-4">
                <label className="font-mono text-[10px] text-zinc-700 uppercase font-black tracking-widest ml-6">Target_Channel_Matrix</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {CHANNELS.map(ch => (
                     <button
                       key={ch.id}
                       type="button"
                       onClick={() => setChannel(ch)}
                       className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                         channel.id === ch.id 
                           ? 'bg-primary-container/10 border-primary-container shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                           : 'bg-black/40 border-white/5 hover:border-white/20'
                       }`}
                     >
                       <span className="text-2xl">{ch.icon}</span>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${channel.id === ch.id ? 'text-primary-container' : 'text-zinc-700'}`}>
                         {ch.label}
                       </span>
                     </button>
                   ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !topic}
                className={`w-full py-8 rounded-[2rem] font-black text-sm uppercase italic tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${
                  isSubmitting ? 'bg-zinc-900 text-zinc-700' : 'bg-primary-container text-black hover:brightness-110'
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {isSubmitting ? (
                  <>
                    <Activity size={20} className="animate-spin" />
                    Dispatching_Order...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Execute_Production_Sequence
                  </>
                )}
              </button>
            </form>
          </section>

          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#6bff83]/10 border border-[#6bff83]/20 p-8 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-[#6bff83]/5"
              >
                 <div className="w-12 h-12 bg-[#6bff83] rounded-full flex items-center justify-center shadow-[0_0_20px_#6bff83]">
                    <CheckCircle2 size={24} className="text-black" />
                 </div>
                 <div>
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-xl">Order_Successful</h3>
                    <p className="font-mono text-[10px] text-[#6bff83] uppercase font-black tracking-widest mt-1">Production node has acknowledged the request.</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Hot Trends */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
           <section className="bg-surface-container-low border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                 <TrendingUp size={20} className="text-primary-container" />
                 <h3 className="text-xs font-black text-white uppercase italic tracking-[0.2em]">Live_Trend_Pulse</h3>
               </div>
               <span className="font-mono text-[9px] text-zinc-900 uppercase font-black tracking-widest">TOP_5_HOT</span>
             </div>

             <div className="space-y-4">
                {trends.map((trend, i) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleTrendClick(trend)}
                    className={`p-6 rounded-[2rem] border cursor-pointer transition-all group relative overflow-hidden ${
                      selectedTrend?.id === trend.id 
                        ? 'bg-primary-container/10 border-primary-container shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                        : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-black/60 rounded text-[8px] font-black text-primary-container uppercase tracking-widest font-mono">
                               {trend.platform}
                             </span>
                             <span className="text-[9px] text-zinc-700 font-black uppercase font-mono">{trend.country}</span>
                          </div>
                          <h4 className={`text-lg font-black uppercase italic tracking-tighter leading-none group-hover:text-primary-container transition-colors truncate ${
                            selectedTrend?.id === trend.id ? 'text-primary-container' : 'text-white'
                          }`}>
                            {trend.title}
                          </h4>
                       </div>
                       <div className="text-right">
                          <p className="text-[14px] font-black text-[#6bff83] font-mono leading-none">+{trend.viral_score}%</p>
                          <p className="text-[8px] text-zinc-800 font-black uppercase mt-1">Growth</p>
                       </div>
                    </div>

                    {selectedTrend?.id === trend.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-container" />
                    )}
                  </motion.div>
                ))}

                {trends.length === 0 && (
                  <div className="py-20 text-center opacity-20">
                    <Box size={48} className="mx-auto text-zinc-700 mb-4" />
                    <p className="font-mono text-[10px] text-zinc-700 uppercase font-black">Syncing_Historical_Clusters...</p>
                  </div>
                )}
             </div>

             <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded-3xl">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-mono font-black text-zinc-700 uppercase tracking-widest">
                  <Play size={12} /> Preview_Metadata
                </div>
                {selectedTrend ? (
                  <div className="space-y-2">
                    <p className="text-xs text-white font-black italic uppercase leading-relaxed line-clamp-3">
                      {selectedTrend.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedTrend.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[9px] text-zinc-500 font-mono font-black uppercase">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-800 font-mono italic uppercase">Select a trend to inject neural metadata.</p>
                )}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
