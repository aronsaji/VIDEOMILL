import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Sparkles, Play, Camera, Smartphone,
  Plus, Minus, Globe, History, Check, ArrowRight,
  Tv, Wand2, Zap, Layers, Clock, Cpu, Layout, Radio,
  RefreshCw, Lock
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
  { id: 'youtube', label: 'YouTube', icon: Play, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'tiktok', label: 'TikTok', icon: Smartphone, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'instagram', label: 'Instagram', icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/10' },
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

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

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

  const seriesOrders = orders.filter(o => (o.title || '').startsWith('[SERIE]'));

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-['Space_Grotesk'] text-5xl font-bold text-violet-400 uppercase tracking-tighter leading-none">AUTO SERIES</h2>
          <p className="text-base text-zinc-400 max-w-xl mt-2">
            Plan and automate full seasons of AI-generated content with precision scheduling and industrial-grade synthesis.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new')}
          className="bg-violet-500 text-white px-6 py-3 rounded-lg font-['Space_Grotesk'] font-black uppercase text-sm tracking-widest flex items-center gap-2 hover:bg-violet-600 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          <Plus size={16} />
          Schedule New Series
        </button>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Controls Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div
            className="p-6 rounded-xl relative overflow-hidden"
            style={{
              background: 'rgba(31, 31, 35, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
            }}
          >
            {/* Scanline */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%)',
                backgroundSize: '100% 4px',
              }}
            />

            <h3 className="text-xs font-bold text-violet-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Cpu size={12} />
              Global Parameters
            </h3>

            <div className="space-y-6 relative z-10">
              {/* Series Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Series Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-violet-500 outline-none transition-colors"
                  placeholder="CYBER_INDUSTRIAL_V2"
                />
              </div>

              {/* Frequency */}
              <div className="flex justify-between items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Frequency</label>
                  <span className="font-mono text-sm text-violet-400">Daily_08:00</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 flex items-center justify-center relative">
                  <div className="w-1 h-4 bg-violet-500 absolute -top-1 rounded-full"></div>
                  <RefreshCw size={12} className="text-violet-500/50" />
                </div>
              </div>

              {/* Platform Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Target</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.slice(0, 2).map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`py-2 rounded border flex items-center justify-center gap-2 font-['Space_Grotesk'] text-[10px] font-bold tracking-widest uppercase transition-all ${
                        selectedPlatforms.includes(p.id)
                          ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                      }`}
                      style={{
                        background: selectedPlatforms.includes(p.id)
                          ? 'rgba(139,92,246,0.1)'
                          : 'rgba(31, 31, 35, 0.6)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <p.icon size={14} /> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode Count */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Episodes</label>
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded p-2">
                  <button onClick={() => setEpisodesCount(Math.max(1, episodesCount - 1))} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-violet-500/10 rounded text-violet-400 transition-colors">
                    <Minus size={16} />
                  </button>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-white">{episodesCount}</span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Episodes</span>
                  </div>
                  <button onClick={() => setEpisodesCount(episodesCount + 1)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-violet-500/10 rounded text-violet-400 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Concept</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-violet-500 outline-none transition-colors resize-none"
                  placeholder="Detail the narrative arc..."
                />
              </div>

              {/* Status LEDs */}
              <div className="pt-3 border-t border-zinc-800/50 flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Engine_Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Queue_Active</span>
                </div>
              </div>

              {/* Launch Button */}
              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-['Space_Grotesk'] font-bold uppercase tracking-widest py-3 rounded shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Deploying Nodes...' : 'Commence Auto-Stream'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-3 rounded-xl text-center border-l-2 border-violet-500"
              style={{
                background: 'rgba(31, 31, 35, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Total_Assets</div>
              <div className="text-2xl font-['Space_Grotesk'] text-white font-black">{orders.length}</div>
            </div>
            <div
              className="p-3 rounded-xl text-center border-l-2 border-emerald-400"
              style={{
                background: 'rgba(31, 31, 35, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="text-zinc-500 text-[10px] uppercase font-bold">Active_Series</div>
              <div className="text-2xl font-['Space_Grotesk'] text-white font-black">{String(seriesOrders.length).padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline View */}
        <div className="col-span-12 lg:col-span-8">
          <div
            className="rounded-xl overflow-hidden flex flex-col h-full"
            style={{
              background: 'rgba(31, 31, 35, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
            }}
          >
            <div className="px-6 py-3 bg-zinc-900/50 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Automation Pipeline / Vertical Timeline</h3>
              <div className="flex gap-2">
                <Layers size={16} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                <Layout size={16} className="text-violet-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[700px]">
              {seriesOrders.length === 0 ? (
                /* Empty State — show placeholder timeline */
                <>
                  {/* Timeline Item 01 - Demo */}
                  <div className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-500">NEXT</span>
                        <span className="text-lg font-['Space_Grotesk'] text-violet-400 font-black">01</span>
                      </div>
                      <div className="w-px flex-1 bg-zinc-800 mt-2"></div>
                    </div>
                    <div
                      className="flex-1 p-3 rounded-lg border-l-4 border-violet-500/50 group-hover:border-violet-500 transition-all flex flex-col md:flex-row gap-4"
                      style={{ background: 'rgba(31, 31, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid rgba(139,92,246,0.5)' }}
                    >
                      <div className="w-full md:w-32 h-20 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-800 border-dashed">
                        <Film size={24} className="text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider text-sm">AWAITING_CONFIG</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-violet-500/20 text-violet-400 font-bold uppercase border border-violet-500/30">QUEUED</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Configure parameters on the left panel and launch your first automated series.</p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 w-0"></div>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">0% Sync</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 02 - Locked */}
                  <div className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-500">NEXT</span>
                        <span className="text-lg font-['Space_Grotesk'] text-white font-black">02</span>
                      </div>
                      <div className="w-px flex-1 bg-zinc-800 mt-2"></div>
                    </div>
                    <div
                      className="flex-1 p-3 rounded-lg flex flex-col md:flex-row gap-4 opacity-60"
                      style={{ background: 'rgba(31, 31, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid rgba(63,63,70,1)' }}
                    >
                      <div className="w-full md:w-32 h-20 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-800 border-dashed">
                        <Lock size={20} className="text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-['Space_Grotesk'] font-bold text-zinc-500 uppercase tracking-wider text-sm">PENDING_EPISODE</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-500 font-bold uppercase border border-zinc-700">LOCKED</span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1">System awaiting previous episode validation.</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 03 - Locked */}
                  <div className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-500">NEXT</span>
                        <span className="text-lg font-['Space_Grotesk'] text-white font-black">03</span>
                      </div>
                    </div>
                    <div
                      className="flex-1 p-3 rounded-lg flex flex-col md:flex-row gap-4 opacity-60"
                      style={{ background: 'rgba(31, 31, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid rgba(63,63,70,1)' }}
                    >
                      <div className="w-full md:w-32 h-20 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-800 border-dashed">
                        <Lock size={20} className="text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-['Space_Grotesk'] font-bold text-zinc-500 uppercase tracking-wider text-sm">PENDING_EPISODE</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-500 font-bold uppercase border border-zinc-700">LOCKED</span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1">System awaiting previous episode validation.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Real series orders */
                seriesOrders.map((order, i) => (
                  <div key={order.id} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-500">EP</span>
                        <span className="text-lg font-['Space_Grotesk'] text-violet-400 font-black">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      {i < seriesOrders.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-2"></div>}
                    </div>
                    <div
                      className="flex-1 p-3 rounded-lg flex flex-col md:flex-row gap-4 transition-all"
                      style={{ background: 'rgba(31, 31, 35, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid rgba(139,92,246,0.5)' }}
                    >
                      <div className="w-full md:w-32 h-20 bg-zinc-800 rounded overflow-hidden flex items-center justify-center">
                        <Film size={24} className="text-violet-500/30" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider text-sm">
                            {(order.title || '').replace('[SERIE] ', '')} // E{String(i + 1).padStart(2, '0')}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[9px] bg-violet-500/20 text-violet-400 font-bold uppercase border border-violet-500/30">
                            {order.status?.toUpperCase() || 'QUEUED'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{order.description || 'Synthesizing visual layers...'}</p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500"
                              style={{ width: `${order.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{order.progress || 0}% Sync</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
