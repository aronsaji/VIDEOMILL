import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Video, Languages, Mic, Wand2, 
  Settings2, Smartphone, Send, Globe, Check,
  AlertTriangle, Play, Users, MessageSquare, RefreshCw, Cpu, Zap, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { triggerProduction } from '../lib/api';

const VOICE_MAP: Record<string, Record<string, string>> = {
  'Norsk': {
    'Female': 'nb-NO-PernilleNeural',
    'Male': 'nb-NO-FinnNeural'
  },
  'English': {
    'Female': 'en-US-AvaMultilingualNeural',
    'Male': 'en-US-AndrewMultilingualNeural'
  },
  'Tamil': {
    'Female': 'ta-IN-PallaviNeural',
    'Male': 'ta-IN-ValluvarNeural'
  }
};

const ADDITIONAL_VOICES = [
  { id: 'en-US-AvaMultilingualNeural', label: 'Ava (Smooth Female)', lang: 'EN' },
  { id: 'en-US-AndrewMultilingualNeural', label: 'Andrew (Deep Male)', lang: 'EN' },
  { id: 'nb-NO-PernilleNeural', label: 'Pernille (Soft Norsk)', lang: 'NO' },
  { id: 'nb-NO-FinnNeural', label: 'Finn (Strong Norsk)', lang: 'NO' },
  { id: 'ta-IN-PallaviNeural', label: 'Pallavi (Tamil Female)', lang: 'TA' },
];

import { useNavigate } from 'react-router-dom';
import { triggerProduction } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function Factory() {
  const { language: globalLang, t } = useLanguage();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [language, setLanguage] = useState(globalLang === 'no' ? 'Norsk' : 'English');
  const [instructions, setInstructions] = useState('');
  const [isProducing, setIsProducing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog Mode State
  const [isDialogMode, setIsDialogMode] = useState(false);
  const [secondaryVoice, setSecondaryVoice] = useState('nb-NO-FinnNeural');

  const handleStartProduction = async () => {
    if (!topic) return;
    setIsProducing(true);
    setError(null);

    const primaryVoice = VOICE_MAP[language]?.[gender] || 'nb-NO-PernilleNeural';
    const orderId = crypto.randomUUID();

    try {
      const success = await triggerProduction({
        id: orderId,
        video_id: orderId,
        action: 'MANUAL_START',
        title: topic,
        topic: topic,
        style_tone: isDialogMode ? '🎭 Dialogue / Movie' : '⚡ Engaging',
        target_audience: 'Global',
        video_format: '📱 9:16 (Vertical)',
        ai_voice: primaryVoice,
        secondary_voice: isDialogMode ? secondaryVoice : null,
        is_dialog: isDialogMode,
        platforms: ['tiktok', 'youtube'],
        language,
        custom_instructions: instructions
      });

      if (success) {
        navigate('/orders?status=started');
      } else {
        setError('Connection to n8n node failed. Verify server integrity.');
        setIsProducing(false);
      }
    } catch (err) {
      setError('An unexpected neural error occurred. Re-synchronize and try again.');
      setIsProducing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-cyan font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <Cpu size={14} className="text-neon-cyan animate-spin-slow" />
            Neural Synthesis Core
          </motion.div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            {t('factory.title')}
          </h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed italic uppercase tracking-tight text-xs">
            {t('factory.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-6 p-4 glass-ultra rounded-[24px] border border-white/5">
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] font-black text-neon-cyan italic">V{i}</span>
                </div>
              ))}
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Production Load</span>
              <div className="flex items-center gap-2">
                 <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '65%'] }}
                      transition={{ duration: 2 }}
                      className="h-full bg-neon-cyan shadow-[0_0_8px_#00f5ff]"
                    />
                 </div>
                 <span className="text-[10px] font-mono text-neon-cyan">65%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Configuration Engine */}
        <div className="lg:col-span-8 space-y-10">
          <div className="glass-ultra rounded-[48px] p-12 border border-white/5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">Production Title / Topic</label>
                <span className="text-[8px] font-mono text-neon-cyan/50 uppercase tracking-widest italic">ID: {crypto.randomUUID().slice(0, 8)}</span>
              </div>
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-6 text-white focus:border-neon-cyan/40 outline-none transition-all font-black text-xl italic uppercase tracking-tight"
                placeholder="Eks: The Mystery of the Abyssal Void..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Behavioral Logic & Interaction</label>
              <div 
                onClick={() => setIsDialogMode(!isDialogMode)}
                className={`p-8 rounded-[32px] border cursor-pointer transition-all duration-500 flex items-center justify-between group overflow-hidden relative ${isDialogMode ? 'bg-neon-cyan/5 border-neon-cyan/30 shadow-[inset_0_0_20px_rgba(0,245,255,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${isDialogMode ? 'bg-neon-cyan text-black shadow-[0_0_20px_#00f5ff]' : 'bg-white/5 text-gray-600'}`}>
                    <Users size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Dialog Mode</h3>
                    <p className="text-[10px] text-gray-500 font-mono font-medium uppercase tracking-widest">Multi-agent conversational synthesis active.</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors duration-500 z-10 ${isDialogMode ? 'bg-neon-cyan' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: isDialogMode ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </div>
                {isDialogMode && (
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                     <Layers size={120} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">Neural Programming / Instructions</label>
                <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest italic">Optional_Parameters</span>
              </div>
              <textarea 
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={5}
                className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] px-8 py-6 text-white focus:border-neon-cyan/40 outline-none transition-all leading-relaxed font-medium italic"
                placeholder={isDialogMode ? "Define character dynamics. Eks: 'Agent A: Aggressive, Agent B: Logical...'" : "Inject specific narrative constraints or stylistic markers..."}
              />
            </div>
          </div>
        </div>

        {/* Tactical Parameters Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-ultra rounded-[48px] p-10 border border-white/5 space-y-10 sticky top-10">
            {/* Primary Voice Identity */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Mic size={14} className="text-neon-cyan" />
                 Primary Voice Core
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['Female', 'Male'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g as any)}
                    className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${gender === g ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)]' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:text-white'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Voice Synthesis (Dialog Mode Only) */}
            <AnimatePresence>
              {isDialogMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <h3 className="text-[10px] font-black font-mono text-neon-cyan uppercase tracking-[0.4em] flex items-center gap-2">
                     <Layers size={14} />
                     Secondary Neural Link
                  </h3>
                  <div className="relative">
                    <select 
                      value={secondaryVoice}
                      onChange={(e) => setSecondaryVoice(e.target.value)}
                      className="w-full bg-white/5 border border-neon-cyan/20 rounded-2xl px-6 py-4 text-[10px] font-black text-white outline-none appearance-none cursor-pointer uppercase tracking-widest italic"
                    >
                      {ADDITIONAL_VOICES.map(v => (
                        <option key={v.id} value={v.id} className="bg-[#0a0a0a] text-white">
                          [{v.lang}] {v.label.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon-cyan">
                       <Settings2 size={16} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h3 className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Globe size={14} />
                 Linguistic sector
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(VOICE_MAP).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${language === lang ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-transparent border-white/5 text-gray-600 hover:text-white hover:border-white/10'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-[10px] font-black uppercase tracking-widest italic"
              >
                <AlertTriangle size={20} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleStartProduction}
              disabled={!topic || isProducing}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-[24px] hover:bg-neon-cyan hover:text-white transition-all shadow-xl hover:shadow-neon-cyan/20 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 group"
            >
              {isProducing ? (
                <>
                  <RefreshCw className="animate-spin" size={22} />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Zap size={20} className="group-hover:animate-pulse" />
                  Initiate Production
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
