import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Video, Languages, Mic, Wand2, 
  Settings2, Smartphone, Send, Globe, Check,
  AlertTriangle, Play, Users, MessageSquare
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

export default function Factory() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [language, setLanguage] = useState('Norsk');
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
        setError('Kunne ikke koble til n8n. Sjekk at serveren kjører.');
        setIsProducing(false);
      }
    } catch (err) {
      setError('En uventet feil oppstod. Vennligst prøv igjen.');
      setIsProducing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]"
        >
          <Wand2 size={14} />
          Creative Studio
        </motion.div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          The <span className="text-neon-cyan">Factory</span>
        </h1>
        <p className="text-gray-500 max-w-md">Konseptualiser og start din neste virale suksess her.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-morphism rounded-[40px] p-10 border-white/5 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Video Tema / Tema</label>
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-neon-cyan/50 outline-none transition-all font-bold text-xl placeholder:text-gray-700"
                placeholder="Eks: Mysteriet om de forsvunne skipene..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Karakter & Dialog Modus</label>
              <div 
                onClick={() => setIsDialogMode(!isDialogMode)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isDialogMode ? 'bg-neon-cyan/5 border-neon-cyan/30' : 'bg-black/20 border-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isDialogMode ? 'bg-neon-cyan text-black' : 'bg-white/5 text-gray-500'}`}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase italic">Dialog Modus</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Lag filmer med flere karakterer som snakker sammen.</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isDialogMode ? 'bg-neon-cyan' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: isDialogMode ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Skreddersydde Instruksjoner</label>
              <textarea 
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-cyan/50 outline-none transition-all leading-relaxed placeholder:text-gray-700"
                placeholder={isDialogMode ? "Beskriv dialogen. Eks: 'Kongen er sint, Rådgiveren er rolig...'" : "Legg til spesielle ønsker for manus eller stil..."}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="glass-morphism rounded-[32px] p-8 border-white/5 space-y-8">
            {/* Primary Voice */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Hovedstemme</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Female', 'Male'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g as any)}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${gender === g ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'bg-white/5 text-gray-500 border-white/5'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Voice (Only in Dialog Mode) */}
            <AnimatePresence>
              {isDialogMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <h3 className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.2em]">Stemme Karakter 2</h3>
                  <select 
                    value={secondaryVoice}
                    onChange={(e) => setSecondaryVoice(e.target.value)}
                    className="w-full bg-black/40 border border-neon-cyan/20 rounded-xl px-4 py-3 text-xs text-white outline-none"
                  >
                    {ADDITIONAL_VOICES.map(v => (
                      <option key={v.id} value={v.id} className="bg-surface text-white">
                        [{v.lang}] {v.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Produksjonsspråk</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(VOICE_MAP).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${language === lang ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-gray-600'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold"
              >
                <AlertTriangle size={16} />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleStartProduction}
              disabled={!topic || isProducing}
              className="w-full py-5 bg-neon-cyan text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_30px_#00f5ff] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
            >
              {isProducing ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Starter Fabrikken...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Start Produksjon
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import added for completeness
import { RefreshCw } from 'lucide-react';
