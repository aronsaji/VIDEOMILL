import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Globe, Mic2, Send, 
  TrendingUp, CheckCircle2, AlertCircle,
  Activity, Radio, Sparkles, User, 
  ChevronRight, Box, Play, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { triggerProduction } from '../lib/api';
import { useI18nStore } from '../store/i18nStore';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.74 6.74 6.738 6.738 0 0 1-6.74-6.74 6.738 6.738 0 0 1 6.74-6.74c.12 0 .24 0 .36.01v4.03a2.705 2.705 0 0 0-2.71 2.71c0 1.5 1.21 2.71 2.71 2.71s2.71-1.21 2.71-2.71V.02z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.562.218.96.478 1.382.9.422.422.682.82.9 1.382.163.422.358 1.057.412 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.054 1.17-.249 1.805-.412 2.227-.218.562-.478.96-.9 1.382-.422.422-.82.682-1.382.9-.422.163-1.057.358-2.227.412-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.071c-1.17-.054-1.805-.249-2.227-.412-.562-.218-.96-.478-1.382-.9-.422-.422-.682-.82-.9-1.382-.163-.422-.358-1.057-.412-2.227-.059-1.266-.071-1.646-.071-4.85s.012-3.584.071-4.85c.054-1.17.249-1.805.412-2.227.218-.562.478-.96.9-1.382.422-.422.82-.682 1.382-.9.422-.163 1.057-.358 2.227-.412 1.266-.059 1.646-.071 4.85-.071M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.384 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384s1.078-1.384 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126s-1.384-1.078-2.126-1.384c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
  </svg>
);

const LANGUAGES = [
  { code: 'no', label: 'Norwegian', flag: '🇳🇴', voices: [{ id: 'morten', label: 'Morten' }, { id: 'liv', label: 'Liv' }] },
  { code: 'en', label: 'English (US)', flag: '🇺🇸', voices: [{ id: 'adam', label: 'Adam' }, { id: 'emma', label: 'Emma' }] },
  { code: 'en-gb', label: 'English (UK)', flag: '🇬🇧', voices: [{ id: 'arthur', label: 'Arthur' }, { id: 'rose', label: 'Rose' }] },
  { code: 'fr', label: 'Français', flag: '🇫🇷', voices: [{ id: 'louis', label: 'Louis' }, { id: 'chloe', label: 'Chloe' }] },
  { code: 'in-hi', label: 'Hindi', flag: '🇮🇳', voices: [{ id: 'arjun', label: 'Arjun' }, { id: 'ananya', label: 'Ananya' }] },
  { code: 'in-ta', label: 'Tamil', flag: '🇮🇳', voices: [{ id: 'karthik', label: 'Karthik' }, { id: 'priya', label: 'Priya' }] },
  { code: 'es', label: 'Español', flag: '🇪🇸', voices: [{ id: 'diego', label: 'Diego' }, { id: 'sofia', label: 'Sofia' }] },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', voices: [{ id: 'hans', label: 'Hans' }, { id: 'marta', label: 'Marta' }] },
];

const CHANNELS = [
  { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
  { id: 'youtube', label: 'YouTube', icon: YouTubeIcon },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
];

export default function CreateOrder() {
  const { t } = useI18nStore();
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [selectedVoices, setSelectedVoices] = useState<string[]>([LANGUAGES[0].voices[1].id]);
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
    
    const trendLang = LANGUAGES.find(l => 
      l.label.toLowerCase() === trend.language?.toLowerCase() || 
      l.code.toLowerCase() === trend.language?.toLowerCase()
    );
    if (trendLang) {
      setLanguage(trendLang);
      setSelectedVoices([trendLang.voices[1].id]);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    if (lang) {
      setLanguage(lang);
      setSelectedVoices([lang.voices[1].id]);
    }
  };

  const toggleVoice = (voiceId: string) => {
    setSelectedVoices(prev => 
      prev.includes(voiceId) 
        ? prev.filter(id => id !== voiceId) 
        : [...prev, voiceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVoices.length === 0) return;
    
    setIsSubmitting(true);
    
    const payload = {
      action: 'viranode-generate',
      topic: topic,
      language: language.code,
      voices: selectedVoices,
      platform: channel.id,
      viral_score: selectedTrend?.viral_score || 85,
      category: selectedTrend?.category || 'general',
      tags: selectedTrend?.tags || [],
      source: 'FORGE_ORDER'
    };

    try {
      const ok = await triggerProduction(payload);
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
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-outline pb-10">
        <div>
          <div className="flex items-center gap-3 text-[#4169E1] font-mono text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">
            <Radio size={14} className="animate-pulse" />
            Neural_Dispatch_Matrix_v4.2
          </div>
          <h1 className="text-6xl font-black text-[#1E3A8A] font-headline-md tracking-tighter italic uppercase leading-none">
            Forge_<span className="text-[#4169E1]">Order</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-surface border border-outline px-8 py-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <Activity size={20} className="text-success animate-pulse" />
              <div>
                <p className="text-[9px] font-mono text-on-surface-variant uppercase font-black tracking-widest opacity-40">Node_Status</p>
                <p className="text-xs font-black text-[#1E3A8A] uppercase italic">Ready for Dispatch</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-7 space-y-12">
          <section className="bg-surface border border-outline p-12 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="space-y-6">
                <label className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest ml-6 opacity-40">Primary_Topic_Input</label>
                <div className="relative group/input">
                  <Sparkles className="absolute left-8 top-1/2 -translate-y-1/2 text-[#4169E1] opacity-20 group-focus-within/input:opacity-100 transition-opacity" size={24} />
                  <input 
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="ENTER PRODUCTION SUBJECT..."
                    className="w-full bg-surface-container border border-outline rounded-[2rem] py-10 pl-20 pr-10 text-xl text-[#1E3A8A] font-headline-md italic font-black uppercase tracking-tight focus:outline-none focus:border-[#4169E1]/50 transition-all placeholder:text-[#1E3A8A]/10 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest ml-4 flex items-center gap-2 opacity-40">
                    <Globe size={14} className="text-[#4169E1]" /> Neural_Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`p-5 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                          language.code === lang.code 
                            ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-xl shadow-[#4169E1]/20 scale-[1.02]' 
                            : 'bg-surface-container border-outline text-on-surface-variant hover:border-[#4169E1]/30 hover:text-[#4169E1]'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest ml-4 flex items-center gap-2 opacity-40">
                    <Mic2 size={14} className="text-[#4169E1]" /> Vocal_Identity (Multi-Select)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {language.voices.map(v => {
                      const isSelected = selectedVoices.includes(v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => toggleVoice(v.id)}
                          className={`p-5 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-between px-8 ${
                            isSelected 
                              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xl shadow-[#1E3A8A]/20' 
                              : 'bg-surface-container border-outline text-on-surface-variant hover:border-[#4169E1]/30 hover:text-[#4169E1]'
                          }`}
                        >
                          <span className="flex items-center gap-4">
                            <User size={16} className={isSelected ? 'text-[#4169E1]' : 'opacity-20'} />
                            {v.label}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#4169E1] border-white' : 'border-outline'}`}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="font-mono text-[11px] text-on-surface-variant font-black uppercase tracking-widest ml-6 opacity-40">Target_Channel_Matrix</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {CHANNELS.map(ch => (
                     <button
                       key={ch.id}
                       type="button"
                       onClick={() => setChannel(ch)}
                       className={`p-8 rounded-[2rem] border transition-all flex flex-col items-center gap-5 group/ch ${
                         channel.id === ch.id 
                           ? 'bg-[#4169E1]/10 border-[#4169E1] shadow-lg text-[#4169E1] scale-[1.05]' 
                           : 'bg-surface-container border-outline text-on-surface-variant hover:border-[#4169E1]/30 hover:text-[#4169E1]'
                       }`}
                     >
                       <div className={`transition-transform group-hover/ch:scale-110 duration-500`}>
                          <ch.icon />
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest italic`}>
                         {ch.label}
                       </span>
                     </button>
                   ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !topic || selectedVoices.length === 0}
                className={`w-full py-10 rounded-[2.5rem] font-black text-base uppercase italic tracking-[0.5em] transition-all flex items-center justify-center gap-6 shadow-2xl relative overflow-hidden group ${
                  isSubmitting ? 'bg-surface-container text-on-surface-variant/20' : 'bg-[#4169E1] text-white hover:brightness-110 shadow-[#4169E1]/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Activity size={24} className="animate-spin" />
                    Dispatching_Order...
                  </>
                ) : (
                  <>
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {t('INITIATE_PRODUCTION')}
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
                className="bg-success/5 border border-success/20 p-10 rounded-[3rem] flex items-center gap-8 shadow-sm"
              >
                 <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center shadow-2xl shadow-success/30">
                    <CheckCircle2 size={32} className="text-white" />
                 </div>
                 <div>
                    <h3 className="text-[#1E3A8A] font-black uppercase italic tracking-tighter text-2xl">Order_Successful</h3>
                    <p className="font-mono text-[11px] text-success uppercase font-black tracking-widest mt-2 italic opacity-60">Production node has acknowledged the request.</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-10">
           <section className="bg-surface border border-outline p-12 rounded-[3.5rem] shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <TrendingUp size={24} className="text-[#4169E1]" />
                  <h3 className="text-sm font-black text-[#1E3A8A] uppercase italic tracking-[0.3em]">Live_Trend_Pulse</h3>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-black tracking-widest opacity-40">TOP_5_HOT</span>
             </div>

             <div className="space-y-5">
                {trends.map((trend, i) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleTrendClick(trend)}
                    className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all group relative overflow-hidden ${
                      selectedTrend?.id === trend.id 
                        ? 'bg-[#4169E1]/5 border-[#4169E1] shadow-lg' 
                        : 'bg-surface-container border-outline hover:border-[#4169E1]/30'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex-1 min-w-0 mr-6">
                          <div className="flex items-center gap-3 mb-3">
                             <span className="px-3 py-1 bg-surface border border-outline rounded-lg text-[9px] font-black text-[#4169E1] uppercase tracking-widest font-mono shadow-sm">
                               {trend.platform}
                             </span>
                             <span className="text-[10px] text-on-surface-variant font-black uppercase font-mono italic opacity-40">{trend.country}</span>
                          </div>
                          <h4 className={`text-xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-[#4169E1] transition-colors line-clamp-2 ${
                            selectedTrend?.id === trend.id ? 'text-[#4169E1]' : 'text-[#1E3A8A]'
                          }`}>
                            {trend.title}
                          </h4>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-success font-mono leading-none">+{trend.viral_score}%</p>
                          <p className="text-[10px] text-on-surface-variant font-black uppercase mt-2 tracking-widest italic opacity-40">Growth</p>
                       </div>
                    </div>

                    {selectedTrend?.id === trend.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#4169E1]" />
                    )}
                  </motion.div>
                ))}

                {trends.length === 0 && (
                  <div className="py-24 text-center opacity-10">
                    <Box size={64} className="mx-auto text-on-surface-variant/20 mb-6" />
                    <p className="font-mono text-[11px] text-on-surface-variant/20 uppercase font-black tracking-[0.5em] italic">Syncing_Historical_Clusters...</p>
                  </div>
                )}
             </div>

             <div className="mt-10 p-8 bg-surface-container border border-outline rounded-[2rem] shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4169E1]/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 mb-6 text-[11px] font-mono font-black text-[#4169E1] uppercase tracking-widest italic">
                  <Play size={14} /> Preview_Metadata
                </div>
                {selectedTrend ? (
                  <div className="space-y-4 relative z-10">
                    <p className="text-sm text-[#1E3A8A] font-black italic uppercase leading-relaxed line-clamp-4">
                      {selectedTrend.title}
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-6">
                      {selectedTrend.tags?.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="px-4 py-2 bg-surface border border-outline rounded-xl text-[10px] text-[#4169E1] font-mono font-black uppercase italic shadow-sm">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-on-surface-variant font-mono italic uppercase opacity-30">Select a trend to inject neural metadata into the matrix.</p>
                )}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
