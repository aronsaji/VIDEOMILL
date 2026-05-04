import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, User, Users, Sparkles, Wand2, ArrowRight, ShieldCheck } from 'lucide-react';
import { triggerProduction } from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

const VOICE_MAP: Record<string, Record<string, string>> = {
  'Norsk': { 'Mann': 'nb-NO-FinnNeural', 'Dame': 'nb-NO-PernilleNeural' },
  'Engelsk': { 'Mann': 'en-US-AndrewNeural', 'Dame': 'en-US-AvaNeural' },
  'Svensk': { 'Mann': 'sv-SE-MattiasNeural', 'Dame': 'sv-SE-SofieNeural' },
  'Tamil': { 'Mann': 'ta-IN-ValluvarNeural', 'Dame': 'ta-IN-PallaviNeural' },
  'Hindi': { 'Mann': 'hi-IN-MadhurNeural', 'Dame': 'hi-IN-SwararaNeural' },
};

const LANGUAGES = [
  { name: 'Norsk', flag: '🇳🇴' },
  { name: 'Engelsk', flag: '🇬🇧' },
  { name: 'Svensk', flag: '🇸🇪' },
  { name: 'Tamil', flag: '🇮🇳' },
  { name: 'Hindi', flag: '🇮🇳' },
];

export default function Factory() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTopic = new URLSearchParams(location.search).get('topic') || '';

  const [topic, setTopic] = useState(initialTopic);
  const [gender, setGender] = useState<'Mann' | 'Dame'>('Dame');
  const [language, setLanguage] = useState('Norsk');
  const [instructions, setInstructions] = useState('');
  const [isProducing, setIsProducing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartProduction = async () => {
    if (!topic) return;
    setIsProducing(true);
    setError(null);

    const selectedVoice = VOICE_MAP[language]?.[gender] || 'nb-NO-PernilleNeural';
    const orderId = crypto.randomUUID();

    try {
      const success = await triggerProduction({
        id: orderId,
        video_id: orderId,
        action: 'MANUAL_START',
        title: topic,
        topic: topic,
        style_tone: '⚡ Engaging',
        target_audience: 'Global',
        video_format: '📱 9:16 (Vertical)',
        ai_voice: selectedVoice,
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
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono uppercase tracking-widest"
        >
          <Zap size={14} />
          AI Production Factory v14.5
        </motion.div>
        <h1 className="text-5xl font-black text-white tracking-tight">Hva skal vi skape i dag?</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Skriv inn et tema eller en idé, så tar vår AI seg av resten – fra manus og tale til klipping og musikk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        {/* Main Input Area */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-morphism rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl"
          >
            {/* Decorative background glow inside the card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-cyan/5 rounded-full blur-[60px] group-hover:bg-neon-cyan/10 transition-all duration-700" />
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="text-xs font-mono text-neon-cyan uppercase tracking-[0.2em] flex items-center gap-3">
                  <Sparkles size={14} />
                  Video-tema eller Overskrift
                </label>
                <input 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Hva vil du at AI-en skal skape?"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-6 text-2xl text-white placeholder:text-gray-700 focus:border-neon-cyan/30 focus:bg-black/60 transition-all outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">Spesielle instrukser</label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="F.eks: 'Gjør stemmen ekstra entusiastisk og bruk mye energi'..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder:text-gray-700 focus:border-neon-cyan/30 focus:bg-black/60 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between p-6 glass-morphism rounded-3xl border-neon-cyan/10">
            <div className="flex items-center gap-4 text-neon-cyan/60 text-xs font-mono tracking-widest uppercase">
              <ShieldCheck size={20} className="text-neon-cyan" />
              <span>Full automatisering: Manus • Stemme • Klipping • Musikk</span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-morphism rounded-[2rem] p-8 space-y-10"
          >
            <div className="space-y-6">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Stemme-Karakter</label>
              <div className="grid grid-cols-2 gap-3">
                {['Dame', 'Mann'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as any)}
                    className={`flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border transition-all duration-500 ${
                      gender === g 
                        ? 'bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                        : 'bg-black/20 border-white/5 text-gray-600 hover:border-white/10'
                    }`}
                  >
                    {g === 'Dame' ? <User size={24} /> : <Users size={24} />}
                    <span className="text-xs font-black uppercase tracking-widest">{g}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Målspråk</label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => setLanguage(lang.name)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      language === lang.name 
                        ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan'
                        : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-xs font-bold">{lang.name}</span>
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
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all shadow-2xl ${
                !topic || isProducing
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-neon-cyan text-black hover:scale-[1.02] active:scale-95 shadow-neon-cyan/20'
              }`}
            >
              {isProducing ? (
                <>
                  <Zap size={20} className="animate-spin" />
                  STARTER...
                </>
              ) : (
                <>
                  <Wand2 size={20} />
                  START FABRIKKEN
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
