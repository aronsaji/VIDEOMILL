import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, Check, Volume2, Mic, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

interface Voice {
  id: string;
  name: string;
  type: string;
  language: string;
  edge_voice: string;
  gender: 'male' | 'female' | 'neutral';
}

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  enableCloning?: boolean;
}

const DEFAULT_VOICES: Voice[] = [
  { id: 'def1', name: 'Neural Adam', type: 'Professional', language: 'en', edge_voice: 'en-US-AndrewNeural', gender: 'male' },
  { id: 'def2', name: 'Neural Pernille', type: 'Natural', language: 'nb-NO', edge_voice: 'nb-NO-PernilleNeural', gender: 'female' },
  { id: 'def3', name: 'Neural Finn', type: 'Professional', language: 'nb-NO', edge_voice: 'nb-NO-FinnNeural', gender: 'male' },
  { id: 'def4', name: 'Neural Emma', type: 'Sweet', language: 'en', edge_voice: 'en-US-EmmaNeural', gender: 'female' },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ value, onChange, enableCloning }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [voices, setVoices] = useState<Voice[]>(DEFAULT_VOICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force browser to load voices early
    window.speechSynthesis.getVoices();
    
    const fetchVoices = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Henter stemmer fra Supabase...');
        const { data, error: dbError } = await supabase
          .from('voices')
          .select('id, voice_name, edge_voice, language')
          .order('voice_name');
        
        if (dbError) throw dbError;
        
        if (data && data.length > 0) {
          const mappedVoices: Voice[] = data.map(v => ({
            id: v.id,
            name: v.voice_name,
            type: 'Neural',
            language: v.language,
            edge_voice: v.edge_voice,
            gender: (v.voice_name.toLowerCase().includes('pernille') || v.voice_name.toLowerCase().includes('emma') ? 'female' : 'male')
          }));
          setVoices(mappedVoices);
          console.log(`Suksess: Hentet ${mappedVoices.length} stemmer.`);
        } else {
          console.warn('Ingen stemmer i tabellen, bruker standard.');
          setVoices(DEFAULT_VOICES);
        }
      } catch (err: any) {
        console.error('Supabase feil:', err);
        setError(err.message);
        setVoices(DEFAULT_VOICES);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.speechSynthesis.cancel();
    };
  }, []);

  const filteredVoices = voices.filter(voice => 
    voice.name.toLowerCase().includes(search.toLowerCase()) || 
    voice.language.toLowerCase().includes(search.toLowerCase()) ||
    voice.edge_voice.toLowerCase().includes(search.toLowerCase())
  );

  const selectedVoice = voices.find(v => v.name === value);

  const togglePreview = (e: React.MouseEvent, voice: Voice) => {
    e.stopPropagation();
    
    if (playingId === voice.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    // Stop any current speaking
    window.speechSynthesis.cancel();

    const text = voice.language.startsWith('no') || voice.language.startsWith('nb')
      ? `Hei! Jeg heter ${voice.name}, og jeg er din nevrale stemme for denne produksjonen.`
      : `Hi! My name is ${voice.name}, and I am your neural voice for this video production.`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the absolute best natural/google/neural voice available in the browser
    const browserVoices = window.speechSynthesis.getVoices();
    
    const normalizeLang = (l: string) => {
      const code = l.toLowerCase().split('-')[0];
      if (code === 'nb' || code === 'no' || code === 'nn') return 'no';
      return code;
    };

    const targetLangNormalized = normalizeLang(voice.language);
    const lowercaseVoiceName = voice.name.toLowerCase();

    // Available voices for the language
    const availableVoicesForLang = browserVoices.filter(v => normalizeLang(v.lang) === targetLangNormalized);

    // Scoring logic for browser voices
    const sortedVoices = [...availableVoicesForLang].sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        let s = 0;
        const n = v.name.toLowerCase();
        
        // Priority 1: Google voices
        if (n.includes('google')) s += 100;
        // Priority 2: Neural/Natural/Premium
        if (n.includes('neural') || n.includes('natural') || n.includes('premium') || n.includes('online')) s += 80;
        
        // Priority 3: Name match
        if (n.includes(lowercaseVoiceName)) s += 50;

        // Priority 4: Strict Gender Matching
        // Detection for browser voice gender
        const isFemaleBrowser = n.includes('female') || n.includes('kvinnelig') || n.includes('dame') || 
                                n.includes('zira') || n.includes('samantha') || n.includes('siri') || 
                                n.includes('nora') || n.includes('pernille') || n.includes('elise') || 
                                n.includes('mette') || n.includes('hanne') || n.includes('emma') || 
                                n.includes('eliza') || n.includes('viktoria') || n.includes('vår') ||
                                (n.includes('google') && !n.includes('male') && !n.includes('mannlig'));

        const isMaleBrowser = n.includes('male') || n.includes('mannlig') || n.includes('herre') || 
                              n.includes('david') || n.includes('mark') || n.includes('henrik') || 
                              n.includes('finn') || n.includes('adam') || n.includes('jon') || 
                              n.includes('stefan') || n.includes('ole') || n.includes('lars') || 
                              n.includes('george') || n.includes('paul') || n.includes('frank');

        if (voice.gender === 'female') {
          if (isFemaleBrowser) s += 200;
          if (isMaleBrowser) s -= 500; // Extreme penalty for cross-gender
        } else if (voice.gender === 'male') {
          if (isMaleBrowser) s += 200;
          if (isFemaleBrowser) s -= 500; // Extreme penalty for cross-gender
        }
        
        return s;
      };
      return score(b) - score(a);
    });

    const bestMatch = sortedVoices[0];

    if (bestMatch) {
      utterance.voice = bestMatch;
      utterance.lang = bestMatch.lang;
    } else {
      // If no language matched, try to find ANY voice of the same gender as fallback
      const fallbackVoice = browserVoices.find(v => {
        const n = v.name.toLowerCase();
        if (voice.gender === 'female') return n.includes('female') || n.includes('kvinnelig');
        if (voice.gender === 'male') return n.includes('male') || n.includes('mannlig');
        return false;
      });
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
        utterance.lang = fallbackVoice.lang;
      } else {
        utterance.lang = voice.language;
      }
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setPlayingId(voice.id);
      console.log(`Spiller av ${voice.name} med browser-stemme: ${bestMatch?.name || 'Standard System'}`);
    };
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = (err) => {
      console.error("Speech Synthesis Error:", err);
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const AudioWave = () => (
    <div className="flex items-center gap-[2px] h-3">
      {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: playingId ? [4, h * 4, 4] : 4 }}
          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
          className="w-[2px] bg-primary rounded-full"
        />
      ))}
    </div>
  );

  const handleSelect = (voiceName: string) => {
    onChange(voiceName);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 bg-surface border border-outline focus:border-primary px-4 py-2.5 rounded-lg flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <Volume2 size={16} className={cn("transition-colors", isOpen ? "text-primary" : "text-text-muted")} />
            <span className="text-xs font-medium">{value || t('voiceSelector.placeholder')}</span>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Loader2 size={12} className="animate-spin text-primary" />}
            <div className="w-[1px] h-4 bg-outline" />
            <Search size={14} className="text-text-muted opacity-50" />
          </div>
        </button>

        {selectedVoice && (
          <button
            type="button"
            onClick={(e) => togglePreview(e, selectedVoice)}
            className={cn(
              "px-3 bg-surface border border-outline rounded-lg flex items-center justify-center transition-all hover:border-primary group",
              playingId === selectedVoice.id && "bg-primary/20 border-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            )}
            title={t('voiceSelector.preview')}
          >
            {playingId === selectedVoice.id ? (
              <Pause size={14} className="text-primary animate-pulse" />
            ) : (
              <Play size={14} className="text-text-muted group-hover:text-primary transition-colors" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 w-full mt-2 bg-[#121415] border border-primary/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search size={14} className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                  search ? "text-primary" : "text-text-muted"
                )} />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('voiceSelector.searchPlaceholder')}
                  className="w-full bg-[#1a1c1e] border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 pl-9 pr-4 py-2.5 rounded-lg outline-none text-xs transition-all placeholder:text-text-muted/40"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    <span className="text-[10px] mono uppercase">✕</span>
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredVoices.length === 0 ? (
                <div className="p-6 text-center text-text-muted text-[10px] uppercase font-mono tracking-widest">
                  {t('voiceSelector.noResults')}
                </div>
              ) : (
                <div className="p-1">
                  {filteredVoices.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => handleSelect(voice.name)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all group",
                        value === voice.name ? "bg-primary/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => togglePreview(e, voice)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all relative overflow-hidden",
                            playingId === voice.id 
                              ? "bg-primary text-background shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                              : "bg-surface-bright border border-outline group-hover:border-primary/50 text-text"
                          )}
                        >
                          {playingId === voice.id ? (
                            <Pause size={12} fill="currentColor" />
                          ) : (
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-bold">{voice.name}</p>
                            <span className="text-[8px] mono px-1.5 py-0.5 bg-background border border-outline rounded uppercase text-text-muted">
                              {voice.language}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[9px] text-text-muted opacity-60 uppercase font-mono tracking-tighter">
                              {voice.type} AI Profile
                            </p>
                            {playingId === voice.id && <AudioWave />}
                          </div>
                        </div>
                      </div>
                      {value === voice.name && <Check size={14} className="text-primary mr-2" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {enableCloning && (
              <div className="p-2 bg-primary/5 border-t border-primary/10">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-all border border-dashed border-primary/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Mic size={14} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-primary">{t('voiceSelector.customVoice')}</p>
                    <p className="text-[9px] opacity-60 uppercase font-mono tracking-tighter">{t('voiceSelector.customVoiceSub')}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
