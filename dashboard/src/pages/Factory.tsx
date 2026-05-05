import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '../store/pipelineStore';
import { triggerProduction } from '../lib/api';

export default function FactoryPage() {
  const { orders = [], fetchOrders } = usePipelineStore();
  const [prompt, setPrompt] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('TIKTOK');
  const [aiUpscaling, setAiUpscaling] = useState(true);
  const [watermark, setWatermark] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      await triggerProduction({ topic: prompt, style: 'cinematic' });
      setPrompt('');
      fetchOrders();
    } catch (e) {
      console.error(e);
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
            <span className="font-headline text-4xl font-[900] text-[#6bff83]">{String(orders.length || 8).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Prompt-to-Viral Workspace */}
        <section className="lg:col-span-8 bg-[#0A0A0B] border border-white/10 relative overflow-hidden p-8 group">
          <div className="scanline-overlay absolute inset-0" />
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
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="bg-white/5 hover:bg-white/10 text-zinc-400 p-2 rounded transition-colors">
                    <span className="material-symbols-outlined text-sm">mic</span>
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-zinc-400 p-2 rounded transition-colors">
                    <span className="material-symbols-outlined text-sm">attachment</span>
                  </button>
                </div>
              </div>

              {/* Style Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'movie', label: 'Cinematic' },
                  { icon: 'theater_comedy', label: 'Humorous' },
                  { icon: 'trending_up', label: 'Trending High' },
                  { icon: 'psychology', label: 'Educational' },
                ].map(s => (
                  <button key={s.label} className="border border-white/10 bg-white/5 p-3 flex flex-col items-center gap-1 hover:border-[#BD00FF] group transition-all">
                    <span className="material-symbols-outlined text-zinc-500 group-hover:text-[#ecb2ff]">{s.icon}</span>
                    <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-400 uppercase">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                className="w-full bg-[#BD00FF] py-6 flex items-center justify-center gap-3 clipped-corner group hover:shadow-[0_0_25px_rgba(189,0,255,0.4)] transition-all"
              >
                <span className="font-headline text-[24px] font-bold uppercase tracking-tighter italic text-black">INITIATE GENERATION</span>
                <span className="material-symbols-outlined text-3xl text-black">play_arrow</span>
              </button>
            </div>
          </div>
        </section>

        {/* Export Engine + Viral Probability */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-[#201f20] border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#6bff83]">settings_input_component</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#6bff83] uppercase">EXPORT ENGINE</h2>
            </div>
            <div className="space-y-6">
              {/* Target Platform */}
              <div>
                <label className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 block mb-2 uppercase">TARGET PLATFORM</label>
                <div className="grid grid-cols-3 gap-2">
                  {['TIKTOK', 'REELS', 'SHORTS'].map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`bg-black border p-2 text-center text-xs font-bold transition-all ${
                        selectedPlatform === p
                          ? 'border-[#BD00FF]/30 text-[#BD00FF]'
                          : 'border-white/10 text-zinc-500 hover:border-white/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-xs uppercase text-zinc-400">Resolution</span>
                  <span className="text-[#6bff83] font-bold text-xs">1080x1920 (9:16)</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-xs uppercase text-zinc-400">Frame Rate</span>
                  <span className="text-zinc-300 text-xs">60 FPS</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-xs uppercase text-zinc-400">AI Upscaling</span>
                  <button
                    onClick={() => setAiUpscaling(!aiUpscaling)}
                    className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: aiUpscaling ? '#6bff83' : '#3f3f46' }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: aiUpscaling ? '22px' : '2px' }} />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                  <span className="font-data-mono text-xs uppercase text-zinc-400">Watermark</span>
                  <button
                    onClick={() => setWatermark(!watermark)}
                    className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: watermark ? '#6bff83' : '#3f3f46' }}
                  >
                    <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ left: watermark ? '22px' : '2px', background: watermark ? '#fff' : '#a1a1aa' }} />
                  </button>
                </div>
              </div>

              {/* Render Time */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 uppercase">ESTIMATED RENDERING TIME</span>
                  <span className="font-data-mono text-xs text-[#6bff83]">02:14:00</span>
                </div>
                <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                  <div className="bg-[#6bff83] w-1/3 h-full" />
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
            <div className="font-headline text-4xl font-[900] text-[#ffb2ba]">84.2%</div>
            <div className="h-12 w-full flex items-end gap-1 mt-4">
              {[20, 30, 25, 40, 60, 80].map((h, i) => (
                <div key={i} className="w-1/6 transition-all" style={{ height: `${h}%`, background: `rgba(255,178,186,${0.2 + i * 0.15})` }} />
              ))}
            </div>
          </div>
        </aside>

        {/* AI Script Generator */}
        <section className="lg:col-span-12 xl:col-span-7 bg-[#0A0A0B] border border-white/10 p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ecb2ff]">description</span>
              <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#ecb2ff] uppercase">AI SCRIPT GENERATOR</h2>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/5 hover:bg-white/10 text-xs font-label-caps px-4 py-2 border border-white/5 text-zinc-400 uppercase tracking-[0.1em]">REGENERATE</button>
              <button className="bg-[#ecb2ff] text-black text-xs font-label-caps px-4 py-2 uppercase tracking-[0.1em] font-bold">APPLY</button>
            </div>
          </div>
          <div className="bg-black/40 border border-white/10 p-6 font-data-mono text-sm space-y-4 max-h-[300px] overflow-y-auto">
            <div className="flex gap-4">
              <span className="text-zinc-600 shrink-0">00:01</span>
              <p className="text-zinc-300"><span className="text-[#BD00FF]">[SCENE 1: ULTRA-ZOOM]</span> High-frequency rapid cuts of neon signs reflecting in rain-slicked pavement. Audio: Heavy industrial bass thud.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-zinc-600 shrink-0">00:05</span>
              <p className="text-zinc-300"><span className="text-[#BD00FF]">[SCENE 2: NARRATION]</span> &quot;The future isn&apos;t coming... it&apos;s already here and it&apos;s rendering in 8K.&quot; Voice: Deep, gravelly synth-tone.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-zinc-600 shrink-0">00:12</span>
              <p className="text-zinc-300"><span className="text-[#BD00FF]">[SCENE 3: ACTION]</span> Transition through glitch-blur into factory floor sequence showing robotic arms mimicking human gestures.</p>
            </div>
            <div className="flex gap-4 border-l-2 border-[#BD00FF] pl-4">
              <span className="text-zinc-600 shrink-0">00:18</span>
              <p className="text-zinc-300"><span className="text-[#BD00FF] cursor-text">[EDITING...]</span> Add overlay of viral engagement metrics spiking over the main visual frame.</p>
            </div>
          </div>
        </section>

        {/* System Templates */}
        <section className="lg:col-span-12 xl:col-span-5 bg-[#201f20] border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#6bff83]">auto_awesome_motion</span>
            <h2 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-[#6bff83] uppercase">SYSTEM TEMPLATES</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'CYBER_DRIVE', desc: 'Fast cuts / Glitch / Heavy Bass', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlxbEPnOCEnoR_be_AC0UKmF0YuFbEv7Yj3W4cuolzvIkqK_Vm6PHyCy6wIR3kp1mH16a_CMlaN2CQGjDRMMQqtlQljbtlWDwk-nNWZ1ZEtNSr89Z8qyIF_EIH6Lzp0stCPbFw77V932dAyxwcvf_nWmIGRbcHdFxS8mJ1nPW-lKm0Sp5bhMmxK1OuTvc-XyQEc7qnJg7OuAcWbDkDTw28rjuefF_rf5UZpUGqv6ZcQgTydxfRaG16Z1bql8X-muAE6nPNGFfafRM' },
              { name: 'ZEN_MINIMAL', desc: 'Soft / Clean / Storytelling', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATPlUBGNQo5QaXrmoKV0tQHPMe_EEVp800iXRdmjAVyTHf360rzMkL_7TU6eLIJXPLku0jI91ENtLriV_KxMa6JQf9G8F8mePE54Wy5bLGplxHxqvkSXZw01ZBl75kr5bx9TKfaNuKIv7pJbpnT4Emyta-L5FRVh6Fr9YHk4oSxhZ9jge0T1hltViR9mMfz54DT7WfsSLrqfTzfEHZh6RkutbwBPa30n45jgbB3F3iFrXEetsfLIzLEbQH5hkxdq57ukuICTI-QUQ' },
              { name: 'RETRO_HYPE', desc: '80s / Grainy / VHS FX', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxq5GoUIWHjIdgy1jobi7njr24GCqg4SgWktWBW5FGAtAF7Km-pVcTXidWxXru-ZXOMna8wUVRw9EUaYrVwWO9bYg-3_m2L5dzDZvzlKIAEibZY4uYQFAaSvdPC2iM8zKfVh--7fJaZhP1BXI05AvN5-Y4-vmmLro_i5xaOzlpaaATI_lOWctacvW6cCYx8tUsIY4Wwmaf29HDG4NO4v3kxot3C8fXaoVglSAGxcHMH0zwPrnL0bgPODxw-HoF_s_SF2ewwot7XYQ' },
              { name: 'GLITCH_VIBE', desc: 'Chaotic / Rapid / Modern', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP0uZ_CKEGWCnNWuEUtPimZtJ1FFakmFUduu5uqKaCIN_z0geTcZ1nsyGMChJ5j_ET6bPjXdlIpxO8VYLJd7gP0xjKl_6yg09G9PHcRIuJzNZuN8JpyGm89l2RRBK4QBQN4OlhoO0sWhT2CQkESvbjfmSQpPnOQqAzJ72PIzJYSDdFxHu9J_MlEa6aMLtcHRa4PbZb1AdNg7S6m3eWIeGY1ipXF5S51zn2Ub4vMWoWAACu_60BSDF1t6JhazUqUQfKUE74M3Ww9Ak' },
            ].map(tmpl => (
              <div key={tmpl.name} className="group relative aspect-video bg-black border border-white/10 overflow-hidden cursor-pointer hover:border-[#BD00FF] transition-all">
                <img className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all scale-110 group-hover:scale-100" src={tmpl.img} alt={tmpl.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-[#ecb2ff] uppercase">{tmpl.name}</span>
                  <span className="text-[8px] text-zinc-500">{tmpl.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Stats */}
      <footer className="mt-8 border-t border-white/10 pt-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'PROCESSOR LOAD', value: '34.2% GFLOPS', color: '#6bff83', pulse: true },
          { label: 'MEMORY STATUS', value: 'OPTIMIZED', color: '#BD00FF', pulse: false },
          { label: 'TRAFFIC MONITOR', value: 'HIGH_BANDWIDTH', color: '#e90053', pulse: false },
          { label: 'API GATEWAY', value: 'CONNECTED', color: '#00fe66', pulse: true },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-4">
            <span className={`w-3 h-3 ${s.pulse ? 'animate-pulse' : ''}`} style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            <div>
              <p className="font-label-caps text-[10px] tracking-[0.1em] font-bold text-zinc-500 uppercase">{s.label}</p>
              <p className="font-data-mono text-sm text-zinc-300">{s.value}</p>
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}
