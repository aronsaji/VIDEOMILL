import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';

const LANGUAGES = [
  { id: 'Norsk', label: 'Norway (Norsk)' },
  { id: 'English', label: 'UK/USA (English)' },
  { id: 'Español', label: 'Spain (Español)' },
  { id: 'Deutsch', label: 'Germany (Deutsch)' },
  { id: 'Français', label: 'France (Français)' },
  { id: 'Tamil', label: 'India (Tamil)' },
  { id: 'Hindi', label: 'India (Hindi)' },
];

const PLATFORMS = [
  { id: 'TIKTOK', label: 'TikTok', icon: 'bolt' },
  { id: 'INSTAGRAM_REELS', label: 'Instagram Reels', icon: 'camera_indoor' },
  { id: 'FACEBOOK_REELS', label: 'Facebook Reels', icon: 'video_library' },
  { id: 'YOUTUBE_SHORTS', label: 'YouTube Shorts', icon: 'play_circle' },
  { id: 'FACEBOOK_POST', label: 'Facebook Post', icon: 'article' },
];

export default function FactoryPage() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('TIKTOK');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [aiUpscaling, setAiUpscaling] = useState(true);
  const [watermark, setWatermark] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      // Build the payload for n8n based on user requirements
      const payload = {
        topic: prompt,
        platform: selectedPlatform,
        language: selectedLanguage,
        upscale: aiUpscaling,
        watermark: watermark,
        timestamp: new Date().toISOString(),
        action: 'viranode-generate'
      };

      const success = await triggerProduction(payload);
      if (success) {
        setPrompt('');
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">THE FACTORY</h1>
          <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-[0.05em]">Production Line: 04-VX-GENERATE</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#2a2a2b] border border-white/5 p-4 flex flex-col">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">CREDITS REMAINING</span>
            <span className="font-headline text-4xl font-[900] text-[#BD00FF]">4,822</span>
          </div>
          <div className="bg-[#2a2a2b] border border-white/5 p-4 flex flex-col">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">QUEUE DEPTH</span>
            <span className="font-headline text-4xl font-[900] text-[#6bff83]">{String(orders.length || 0).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Prompt-to-Viral Workspace */}
        <section className="lg:col-span-8 bg-[#0A0A0B] border border-white/10 relative overflow-hidden p-8 group">
          <div className="scanline-overlay absolute inset-0 opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#BD00FF]">bolt</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#ecb2ff] uppercase">PROMPT-TO-VIRAL GENERATION</h2>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className="w-full bg-black/40 border-b border-[#BD00FF] p-6 text-[18px] leading-[1.6] text-[#e5e2e3] focus:outline-none focus:ring-0 min-h-[160px] resize-none placeholder:text-zinc-700 font-sans"
                  placeholder="Describe your viral vision... e.g., 'Cyberpunk street fashion montage with aggressive bass and neon glitch transitions'"
                />
              </div>

              {/* Language Selection */}
              <div>
                 <label className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 block mb-3 uppercase">OUTPUT LANGUAGE</label>
                 <div className="flex flex-wrap gap-2">
                   {LANGUAGES.map(lang => (
                     <button
                       key={lang.id}
                       onClick={() => setSelectedLanguage(lang.id)}
                       className={`px-4 py-2 border text-[10px] font-bold uppercase transition-all ${
                         selectedLanguage === lang.id ? 'border-[#BD00FF] text-[#BD00FF] bg-[#BD00FF]/5' : 'border-white/5 text-zinc-500 hover:border-white/20'
                       }`}
                     >
                       {lang.label}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Generate Button */}
              <button
                disabled={isGenerating || !prompt.trim()}
                onClick={handleGenerate}
                className={`w-full py-6 flex items-center justify-center gap-3 clipped-corner group transition-all ${
                  isGenerating ? 'bg-zinc-800 opacity-50' : 'bg-[#BD00FF] hover:shadow-[0_0_25px_rgba(189,0,255,0.4)]'
                }`}
              >
                <span className="font-headline text-[24px] font-bold uppercase tracking-tighter italic text-black">
                  {isGenerating ? 'PROCESSING_NEURAL_FLOW...' : 'INITIATE GENERATION'}
                </span>
                <span className={`material-symbols-outlined text-3xl text-black ${isGenerating ? 'animate-spin' : ''}`}>
                  {isGenerating ? 'refresh' : 'play_arrow'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Export Engine + Viral Probability */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-[#201f20] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#6bff83]">settings_input_component</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#6bff83] uppercase">MULTI-PLATFORM ENGINE</h2>
            </div>
            <div className="space-y-6">
              {/* Target Platforms */}
              <div className="space-y-2">
                <label className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 block mb-2 uppercase">TARGET PLATFORMS</label>
                <div className="space-y-1">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`w-full flex items-center gap-3 p-3 border transition-all ${
                        selectedPlatform === p.id
                          ? 'border-[#BD00FF]/50 text-[#BD00FF] bg-[#BD00FF]/5'
                          : 'border-white/5 text-zinc-500 hover:bg-white/5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{p.icon}</span>
                      <span className="font-data-mono text-[11px] font-bold uppercase">{p.label}</span>
                      {selectedPlatform === p.id && <span className="ml-auto material-symbols-outlined text-sm">check_circle</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-[10px] uppercase text-zinc-400">AI Upscaling (4K)</span>
                  <button
                    onClick={() => setAiUpscaling(!aiUpscaling)}
                    className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: aiUpscaling ? '#6bff83' : '#3f3f46' }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: aiUpscaling ? '22px' : '2px' }} />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-[10px] uppercase text-zinc-400">Remove Watermarks</span>
                  <button
                    onClick={() => setWatermark(!watermark)}
                    className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: watermark ? '#6bff83' : '#3f3f46' }}
                  >
                    <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ left: watermark ? '22px' : '2px', background: watermark ? '#fff' : '#a1a1aa' }} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 uppercase">EST. PRODUCTION TIME</span>
                  <span className="font-data-mono text-xs text-[#6bff83]">01:42:00</span>
                </div>
                <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                  <div className="bg-[#6bff83] w-1/4 h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Viral Probability */}
          <div className="bg-[#201f20] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ffb2ba]">trending_up</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#ffb2ba] uppercase">VIRAL PROBABILITY</h2>
            </div>
            <div className="font-headline text-4xl font-[900] text-[#ffb2ba]">
              {prompt.length > 10 ? '92.4%' : '00.0%'}
            </div>
            <div className="h-12 w-full flex items-end gap-1 mt-4">
              {[20, 35, 25, 60, 85, 100].map((h, i) => (
                <div key={i} className="w-1/6 transition-all" style={{ height: `${h}%`, background: `rgba(255,178,186,${0.2 + i * 0.15})` }} />
              ))}
            </div>
          </div>
        </aside>

        {/* AI Script Generator */}
        <section className="lg:col-span-12 xl:col-span-12 bg-[#0A0A0B] border border-white/10 p-8 flex flex-col gap-6">
           <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ecb2ff]">description</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#ecb2ff] uppercase">LIVE PRODUCTION FEED</h2>
            </div>
            <span className="font-data-mono text-[10px] text-zinc-500 uppercase">Monitoring n8n Webhook: viranode-generate</span>
          </div>
          <div className="bg-black/40 border border-white/10 p-6 font-data-mono text-xs space-y-2 max-h-[200px] overflow-y-auto">
             <p className="text-[#BD00FF]">[03:02:11] Waiting for production signal...</p>
             {orders.slice(0, 5).map((order, i) => (
               <p key={i} className="text-zinc-500">
                 [{new Date(order.created_at).toLocaleTimeString()}] Task: {order.topic || order.title} // Status: <span className="text-[#6bff83] uppercase">{order.status}</span>
               </p>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
