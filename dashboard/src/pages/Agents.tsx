import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AGENTS = [
  { id: 'atlas', name: 'ATLAS', role: 'DIRECTOR', status: 'ACTIVE', focus: 'Creative Strategy', color: '#BD00FF', description: 'Master architect of viral narratives. Optimizes for hook retention and emotional resonance.' },
  { id: 'kronos', name: 'KRONOS', role: 'EDITOR', status: 'IDLE', focus: 'Pacing & Rhythm', color: '#6bff83', description: 'Precision timing specialist. Manages frame-perfect transitions and beat-syncing.' },
  { id: 'nova', name: 'NOVA', role: 'RESEARCHER', status: 'SCANNING', focus: 'Trend Detection', color: '#00f5ff', description: 'Deep-web data miner. Identifies emerging visual patterns before they hit the mainstream.' },
  { id: 'pulse', name: 'PULSE', role: 'DISTRIBUTOR', status: 'ACTIVE', focus: 'Platform Algorithm', color: '#e90053', description: 'Deployment expert. Calculates optimal posting windows and hashtag clusters for maximum reach.' },
];

export default function Agents() {
  const [creativity, setCreativity] = useState(85);
  const [technicality, setTechnicality] = useState(62);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-[40px] font-[800] tracking-[-0.02em] leading-[1.2] text-[#e5e2e3] uppercase">
            AI_AGENTS_CORE
          </h1>
          <p className="font-data-mono text-[14px] text-zinc-500 uppercase tracking-widest">
            Neural Network Management // Logic Gate Control
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1c1b1c] border border-white/10 px-6 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">ACTIVE_NODES</span>
            <span className="font-data-mono text-[#6bff83] text-lg">04 / 04</span>
          </div>
          <div className="bg-[#1c1b1c] border border-white/10 px-6 py-2 flex flex-col items-end">
            <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-500 uppercase">LATENCY</span>
            <span className="font-data-mono text-[#00f5ff] text-lg">12ms</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Director Card (ATLAS) */}
        <section className="col-span-12 lg:col-span-8 bg-[#0A0A0B] border border-white/10 p-8 relative overflow-hidden group">
          <div className="scanline-overlay absolute inset-0 opacity-10" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* Persona Visual */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="aspect-square bg-[#1c1b1c] border border-[#BD00FF]/30 relative overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSnZuXxAy5ICwztpDs95LokFbo_csIiN_ZL_Nn4ErDP_OSFtQM6_2QYYI0FNFEXWYw68gfkSIAApWJ6NhAemY0ZoAEFCzc7D7PcHcKYPdGZ764M3L_1xfgcNZVnkZo28P9Na1vFLqOOXJa72V08PdfPTZaP-raJMj5tF5KORXNUe7SfZiU-MZQ6iNpNlylpwl-ndjXebgUcJQ9ARNA2MUsJ9GjRx-s3cI_jEinn1GWwMQNVQcpRrAjZ6CRnBIIfI9ENhigUc8njAo" 
                  alt="ATLAS" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#6bff83] rounded-full animate-pulse" />
                    <span className="font-data-mono text-[10px] text-[#6bff83]">CORE_SYNC_ACTIVE</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between font-label-caps text-[10px] text-zinc-500 uppercase">
                  <span>Logic Processing</span>
                  <span className="text-white">98%</span>
                </div>
                <div className="w-full bg-white/5 h-1">
                  <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="bg-[#BD00FF] h-full" />
                </div>
              </div>
            </div>

            {/* Persona Content */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="font-headline text-5xl font-[900] text-white tracking-tighter uppercase mb-1 italic">ATLAS</h2>
                <span className="font-label-caps text-xs tracking-[0.2em] text-[#BD00FF] font-bold uppercase">MASTER_DIRECTOR_PERSONA</span>
              </div>
              
              <p className="text-zinc-400 font-sans text-sm leading-relaxed max-w-xl">
                Atlas is the primary intelligence governing your production pipeline. He analyzes global trends, synthesizes script narratives, and directs the secondary agents to ensure every video produced meets the "Viral Threshold" (V-Score {'>'} 85).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Sliders */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">CREATIVITY_WEIGHT</span>
                      <span className="font-data-mono text-[#BD00FF]">{creativity}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={creativity} 
                      onChange={(e) => setCreativity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#BD00FF]" 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-zinc-400 uppercase">TECHNICAL_THRESHOLD</span>
                      <span className="font-data-mono text-[#6bff83]">{technicality}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={technicality} 
                      onChange={(e) => setTechnicality(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#6bff83]" 
                    />
                  </div>
                </div>

                {/* Status Console */}
                <div className="bg-black/40 border border-white/5 p-4 font-data-mono text-[11px] space-y-2 max-h-[140px] overflow-hidden">
                  <p className="text-[#BD00FF]">[SYSTEM] Accessing global trend cache...</p>
                  <p className="text-zinc-500">[ATLAS] Identifying hook patterns for 9:16 layout.</p>
                  <p className="text-zinc-500">[ATLAS] Script synthesis complete for Project_X.</p>
                  <p className="text-[#6bff83]">[CORE] Delegating render tasks to KRONOS_v4.</p>
                  <p className="text-zinc-500">[SYSTEM] All systems nominal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Stream Panel */}
        <section className="col-span-12 lg:col-span-4 bg-[#201f20] border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-label-caps text-[12px] tracking-[0.1em] font-bold text-white uppercase">LIVE_AGENT_FEED</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#e90053] rounded-full animate-pulse" />
              <span className="font-data-mono text-[10px] text-[#e90053]">ENCRYPTED</span>
            </div>
          </div>
          <div className="flex-1 bg-black aspect-[9/16] relative overflow-hidden rounded-sm border border-white/5">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP0uZ_CKEGWCnNWuEUtPimZtJ1FFakmFUduu5uqKaCIN_z0geTcZ1nsyGMChJ5j_ET6bPjXdlIpxO8VYLJd7gP0xjKl_6yg09G9PHcRIuJzNZuN8JpyGm89l2RRBK4QBQN4OlhoO0sWhT2CQkESvbjfmSQpPnOQqAzJ72PIzJYSDdFxHu9J_MlEa6aMLtcHRa4PbZb1AdNg7S6m3eWIeGY1ipXF5S51zn2Ub4vMWoWAACu_60BSDF1t6JhazUqUQfKUE74M3Ww9Ak" 
               alt="Live Feed" 
               className="w-full h-full object-cover opacity-40 mix-blend-screen"
             />
             <div className="absolute inset-0 scanline-overlay opacity-20" />
             <div className="absolute top-4 left-4 font-data-mono text-[10px] text-white bg-black/60 px-2 py-1">REC_CAM_01</div>
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
               <div className="space-y-1">
                 <div className="w-24 h-1 bg-white/10 overflow-hidden">
                   <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="bg-[#6bff83] h-full" />
                 </div>
                 <span className="font-data-mono text-[9px] text-zinc-500">PROCESSING_ASSET_442</span>
               </div>
               <span className="font-data-mono text-[10px] text-[#6bff83]">00:42:11:05</span>
             </div>
          </div>
          <button className="mt-6 w-full py-3 bg-white/5 border border-white/10 font-label-caps text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
            OVERRIDE_LOCAL_CONTROL
          </button>
        </section>

        {/* Agent Grid */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <motion.div 
              key={agent.id}
              whileHover={{ y: -5 }}
              className="bg-[#1c1b1c] border border-white/5 p-6 group cursor-pointer hover:border-[#BD00FF]/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-sm bg-black border border-white/10 flex items-center justify-center relative">
                   <span className="material-symbols-outlined text-zinc-500" style={{ color: agent.status === 'ACTIVE' ? agent.color : undefined }}>
                     {agent.id === 'atlas' ? 'architecture' : agent.id === 'kronos' ? 'precision_manufacturing' : agent.id === 'nova' ? 'biotech' : 'send'}
                   </span>
                   {agent.status === 'ACTIVE' && (
                     <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1c1b1c]" style={{ backgroundColor: agent.color }} />
                   )}
                </div>
                <span className="font-data-mono text-[10px] text-zinc-600 uppercase">{agent.status}</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-white uppercase italic mb-1">{agent.name}</h3>
              <p className="font-label-caps text-[10px] tracking-[0.1em] text-zinc-500 uppercase mb-4">{agent.role} // {agent.focus}</p>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">{agent.description}</p>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                 <span className="font-data-mono text-[10px] text-zinc-500 uppercase">Uptime: 99.9%</span>
                 <button className="material-symbols-outlined text-sm text-zinc-600 hover:text-white">settings</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
