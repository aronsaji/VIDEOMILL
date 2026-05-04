import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Sparkles, Play, Camera, Smartphone,
  Plus, Minus, Globe, History, Check, ArrowRight,
  Tv, Wand2, Zap, Layers, Clock, Cpu, Layout, Radio
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
  { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
  { id: 'tiktok', label: 'TikTok', icon: Smartphone, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
  { id: 'instagram', label: 'Instagram', icon: Camera, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
];

export default function AutoSeries() {
  const [activeTab, setActiveTab] = useState<'new' | 'mine'>('new');
  const { orders = [] } = usePipelineStore();

  // Form State
  const [title, setTitle] = useState('New Production Stream');
  const [description, setDescription] = useState('Define your core series concept here...');
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
      console.error('Series production failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-neon-pink font-mono text-xs uppercase tracking-[0.4em]"
          >
            <Radio size={14} className="animate-pulse" />
            Automated Content Stream
          </motion.div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Auto <span className="text-neon-pink">Series</span>
          </h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed">
            Deploy full seasons of viral content. Our neural engine handles scripting, 
            visual synthesis, and multi-channel scheduling.
          </p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-[24px] border border-white/5 backdrop-blur-xl">
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'new' ? 'bg-neon-pink text-white shadow-lg shadow-neon-pink/20' : 'text-gray-500 hover:text-white'}`}
          >
            Deploy New
          </button>
          <button 
            onClick={() => setActiveTab('mine')}
            className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === 'mine' ? 'bg-neon-pink text-white shadow-lg shadow-neon-pink/20' : 'text-gray-500 hover:text-white'}`}
          >
            Active Streams
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left: Configuration Form */}
            <div className="lg:col-span-8 space-y-10">
              <div className="glass-ultra rounded-[48px] p-12 border border-white/5 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">Series Identification</label>
                    <span className="text-[10px] font-mono text-neon-pink uppercase tracking-widest">Required_Field</span>
                  </div>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-6 text-white focus:border-neon-pink/40 outline-none transition-all font-black text-xl italic uppercase tracking-tight"
                    placeholder="Eks: Chronicles of Muvendar"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em]">Conceptual Core</label>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                       <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Neural Input Active</span>
                    </div>
                  </div>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] px-8 py-6 text-white focus:border-neon-pink/40 outline-none transition-all leading-relaxed font-medium italic"
                    placeholder="Detail the narrative arc or concept complexity..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Linguistic Logic</label>
                    <div className="grid grid-cols-2 gap-3">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`px-6 py-4 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${selectedLanguage === lang.id ? 'bg-neon-pink/10 border-neon-pink text-white shadow-lg shadow-neon-pink/10' : 'glass-ultra border-white/5 text-gray-500'}`}
                        >
                          <span className="text-lg grayscale-0">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-[0.3em] ml-2">Iteration Count</label>
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-[24px] p-2">
                      <button onClick={() => setEpisodesCount(Math.max(1, episodesCount - 1))} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-neon-pink transition-colors"><Minus size={24} /></button>
                      <div className="flex flex-col items-center">
                         <span className="text-3xl font-black text-white italic">{episodesCount}</span>
                         <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em]">Episodes</span>
                      </div>
                      <button onClick={() => setEpisodesCount(episodesCount + 1)} className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-neon-pink transition-colors"><Plus size={24} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary & Action Panel */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-ultra rounded-[48px] p-10 border border-white/5 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                  <Cpu size={200} />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <h3 className="text-lg font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-3">
                    <Zap className="text-neon-pink" size={20} />
                    Stream Protocol
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">Network Nodes</span>
                      <div className="flex gap-2">
                        {selectedPlatforms.map(p => {
                          const Icon = PLATFORMS.find(pl => pl.id === p)?.icon || Smartphone;
                          const color = PLATFORMS.find(pl => pl.id === p)?.color || 'text-white';
                          return <div key={p} className={`p-2 bg-white/5 rounded-xl ${color} border border-white/5`}><Icon size={16} /></div>
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">Temporal Estimate</span>
                      <span className="text-[11px] font-black text-white italic uppercase tracking-tighter">~45 min / EP</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                      <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">Core Status</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-neon-amber rounded-full animate-pulse shadow-[0_0_8px_#ffaa00]" />
                         <span className="text-[11px] font-black text-neon-amber italic uppercase tracking-tighter">Ready For Ignite</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={isGenerating}
                      onClick={handleGenerate}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs rounded-[24px] hover:bg-neon-pink hover:text-white transition-all shadow-xl hover:shadow-neon-pink/20 disabled:opacity-50 disabled:grayscale"
                    >
                      {isGenerating ? 'Deploying Nodes...' : 'Commence Auto-Stream'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-ultra rounded-[32px] p-8 border border-neon-purple/20 bg-neon-purple/5 space-y-4">
                <div className="flex items-center gap-3 text-neon-purple font-black text-[10px] uppercase tracking-[0.3em]">
                  <Sparkles size={16} /> Neural Forecast
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-mono font-bold uppercase tracking-widest italic text-center">
                  Predicting 88% engagement saturation in the selected linguistic sector.
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
            className="glass-ultra rounded-[64px] border border-white/5 overflow-hidden"
          >
            <div className="p-32 text-center space-y-8">
              <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto text-gray-700 border border-white/5">
                <History size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Zero Active Streams</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-medium">Your automated production network is currently in standby. Initialize a new series node to begin.</p>
              </div>
              <button 
                onClick={() => setActiveTab('new')} 
                className="px-10 py-4 bg-white/5 text-neon-pink font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white/10 border border-neon-pink/20 transition-all"
              >
                Launch Primary Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
