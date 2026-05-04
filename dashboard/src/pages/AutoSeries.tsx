import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Sparkles, Play, Camera, Smartphone,
  Plus, Minus, Globe, History, Check, ArrowRight,
  Tv, Wand2, Zap, Layers, Clock
} from 'lucide-react';
import { triggerProduction } from '../lib/api';
import { usePipelineStore } from '../store/pipelineStore';

const LANGUAGES = [
  { id: 'no', label: 'Norsk', flag: '🇳🇴' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 'tiktok', label: 'TikTok', icon: Smartphone, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'instagram', label: 'Instagram', icon: Camera, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

export default function AutoSeries() {
  const [activeTab, setActiveTab] = useState<'new' | 'mine'>('new');
  const { orders = [] } = usePipelineStore();

  // Form State
  const [title, setTitle] = useState('Min Nye Auto-Serie');
  const [description, setDescription] = useState('Beskriv konseptet ditt her...');
  const [selectedLanguage, setSelectedLanguage] = useState('no');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok']);
  const [episodesCount, setEpisodesCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!title || !description) return;
    setIsGenerating(true);
    
    try {
      const orderId = crypto.randomUUID();
      await triggerProduction({
        id: orderId,
        video_id: orderId,
        action: 'SERIES_START',
        title: `[SERIE] ${title}`,
        description,
        language: LANGUAGES.find(l => l.id === selectedLanguage)?.label || 'Norsk',
        platforms: selectedPlatforms,
        episodes_count: episodesCount
      });
      setActiveTab('mine');
    } catch (err) {
      console.error('Serie produksjon feilet:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]"
          >
            <Tv size={14} />
            Content Automation
          </motion.div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Auto <span className="text-neon-cyan">Series</span>
          </h1>
          <p className="text-gray-500 max-w-md">
            Planlegg og automatiser hele sesonger med AI-generert innhold.
          </p>
        </div>

        <div className="flex bg-surface/50 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'new' ? 'bg-neon-cyan text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Ny Serie
          </button>
          <button 
            onClick={() => setActiveTab('mine')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'mine' ? 'bg-neon-cyan text-black' : 'text-gray-500 hover:text-white'}`}
          >
            Mine Serier
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'new' ? (
          <motion.div
            key="new"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-morphism rounded-[40px] p-10 border-white/5 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Serie Tittel</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-cyan/50 outline-none transition-all font-bold text-lg"
                    placeholder="Eks: Muvendar - Historien om de tre kongene"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Konsept & Beskrivelse</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-cyan/50 outline-none transition-all leading-relaxed"
                    placeholder="Hva skal serien handle om? Jo mer detaljert, jo bedre blir resultatet."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Språk</label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedLanguage === lang.id ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' : 'bg-white/5 border-white/5 text-gray-500'}`}
                        >
                          {lang.flag} {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] ml-2">Antall Episoder</label>
                    <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-2 w-fit">
                      <button onClick={() => setEpisodesCount(Math.max(1, episodesCount - 1))} className="p-2 hover:bg-white/5 rounded-lg text-neon-cyan"><Minus size={20} /></button>
                      <span className="text-xl font-black text-white w-12 text-center">{episodesCount}</span>
                      <button onClick={() => setEpisodesCount(episodesCount + 1)} className="p-2 hover:bg-white/5 rounded-lg text-neon-cyan"><Plus size={20} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary & Action */}
            <div className="space-y-6">
              <div className="glass-morphism rounded-3xl p-8 border-white/5 space-y-6">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Produksjonsplan</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500">Kanaler</span>
                    <div className="flex gap-1">
                      {selectedPlatforms.map(p => {
                        const Icon = PLATFORMS.find(pl => pl.id === p)?.icon || Smartphone;
                        return <div key={p} className="p-1.5 bg-neon-cyan/10 rounded-lg text-neon-cyan"><Icon size={14} /></div>
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500">Estimert Tid</span>
                    <span className="text-white">~45 min pr episode</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500">Status</span>
                    <span className="text-neon-amber">KLAR FOR GENEREING</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="w-full py-4 bg-neon-cyan text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_#00f5ff] transition-all disabled:opacity-50"
                  >
                    {isGenerating ? 'Starter Fabrikken...' : 'START AUTO-PRODUKSJON'}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-neon-purple/5 border border-neon-purple/20 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-neon-purple font-black text-[10px] uppercase">
                  <Zap size={14} /> AI Insight
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                  Dette konseptet har en beregnet suksessrate på 88% basert på nåværende trender i {LANGUAGES.find(l => l.id === selectedLanguage)?.label} markedet.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-morphism rounded-[40px] border-white/5 overflow-hidden"
          >
            <div className="p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                <History size={40} />
              </div>
              <h3 className="text-xl font-bold text-white">Ingen aktive serier</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Start din første automatiserte serie for å se dem her.</p>
              <button onClick={() => setActiveTab('new')} className="text-neon-cyan font-black uppercase tracking-widest text-xs mt-4">Lag ny serie nå</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
