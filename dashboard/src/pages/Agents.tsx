import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Film, Sparkles, Activity, Palette, Brain,
  Download, Zap, Settings, Eye
} from 'lucide-react';

const glass = {
  background: 'rgba(14, 21, 17, 0.6)',
  backdropFilter: 'blur(20px) saturate(150%)',
  border: '1px solid rgba(12, 198, 135, 0.2)',
  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
};

const AGENTS = [
  { id: 'kronos', name: 'KRONOS', icon: Activity, task: 'Continuity Audit', progress: 65, color: '#44e3a1', version: '2.1.4-BETA', status: 'active' },
  { id: 'nova', name: 'NOVA', icon: Palette, task: 'Grading Design', progress: 42, color: '#8B5CF6', version: '1.8.0-STABLE', status: 'active' },
  { id: 'pulse', name: 'PULSE', icon: Brain, task: 'Hibernating', progress: 0, color: '#71717a', version: '0.9.1-ALPHA', status: 'offline' },
];

const LOG_ENTRIES = [
  { time: '14:22:01', agent: 'ATLAS', text: 'optimized frame 12,042 for dynamic range clipping.' },
  { time: '14:18:45', agent: 'KRONOS', text: 'flagged potential narrative loop in scene 3.' },
  { time: '14:12:30', agent: 'NOVA', text: "generated 12 alternative lighting rigs for 'Sunset Plateau'." },
  { time: '14:05:11', agent: 'ATLAS', text: "completed color pass for sequence 'Alpha_01'." },
  { time: '13:58:22', agent: 'SYS', text: 'System integrity check: Optimal.' },
];

export default function Agents() {
  const [creativity, setCreativity] = useState(82);
  const [technicality, setTechnicality] = useState(95);

  return (
    <div className="max-w-[1600px] mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-emerald-400" style={{ textShadow: '0 0 10px rgba(68,227,161,0.3)' }}>
            AI AGENT CLUSTER
          </h1>
          <p className="text-zinc-400 text-lg mt-1">Control center for autonomous production personas.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 flex items-center gap-3 rounded" style={glass}>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(68,227,161,0.6)' }} />
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">System Online</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-3 rounded" style={glass}>
            <span className="font-mono text-xs text-zinc-400">UPTIME: 99.98%</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Agent Card: ATLAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 rounded-xl p-6 flex flex-col gap-6"
          style={{ ...glass, borderTop: '2px solid rgba(68,227,161,0.3)' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: 'rgba(9,16,12,0.9)', border: '1px solid rgba(68,227,161,0.2)' }}>
                <Film size={32} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-semibold text-white">Director Persona: ATLAS</h2>
                <p className="text-zinc-500 text-sm font-mono">ID: UNIT-A-042 // STATUS: RENDERING_SCENE_04</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(68,227,161,0.1)', border: '1px solid rgba(68,227,161,0.4)', color: '#44e3a1' }}>Active</span>
              <div className="mt-2 text-emerald-400/60 font-mono text-xs">Load: 84%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-4">
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>Creativity</span>
                  <span className="text-emerald-400">{creativity}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={creativity}
                  onChange={e => setCreativity(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-zinc-600 italic">Controls narrative divergence and aesthetic experimentation risk levels.</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>Technicality</span>
                  <span className="text-emerald-400">{technicality}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={technicality}
                  onChange={e => setTechnicality(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-emerald-400"
                />
                <p className="text-[10px] text-zinc-600 italic">Strict adherence to technical specs, color gamuts, and frame-rate precision.</p>
              </div>
            </div>

            {/* Visual Feedback */}
            <div className="relative rounded-lg overflow-hidden h-full min-h-[160px]" style={{ background: 'rgba(9,16,12,0.9)', border: '1px solid rgba(60,74,65,0.3)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-violet-900/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye size={64} className="text-emerald-500/10" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="font-mono text-[10px] text-emerald-400/80">LIVE_PREVIEW_STREAM_004</div>
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-emerald-400 animate-pulse" />
                  <div className="w-1 h-5 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-2 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-4" style={{ borderTop: '1px solid rgba(60,74,65,0.2)' }}>
            <button className="flex-grow py-3 bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all rounded">
              DEPLOY CONFIGURATION
            </button>
            <button className="px-6 py-3 text-emerald-400 font-bold text-xs uppercase tracking-widest hover:bg-emerald-500/5 transition-all rounded" style={{ border: '1px solid rgba(68,227,161,0.4)' }}>
              OVERRIDE
            </button>
          </div>
        </motion.div>

        {/* Agent Log Buffer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-4 rounded-xl p-6 flex flex-col gap-4"
          style={glass}
        >
          <h3 className="font-['Space_Grotesk'] text-xl font-semibold text-white pb-4" style={{ borderBottom: '1px solid rgba(60,74,65,0.2)' }}>
            AGENT_LOG_BUFFER
          </h3>
          <div className="flex-grow space-y-4 overflow-y-auto pr-2">
            {LOG_ENTRIES.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-emerald-400 font-mono text-xs mt-1 shrink-0">[{entry.time}]</span>
                <p className="text-sm text-zinc-300">
                  <span className="text-violet-400">{entry.agent}</span> {entry.text}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors text-center" style={{ borderTop: '1px solid rgba(60,74,65,0.2)' }}>
            DOWNLOAD FULL LOGS (.JSON)
          </button>
        </motion.div>

        {/* Secondary Agent Grid */}
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`col-span-12 md:col-span-4 rounded-xl p-4 group transition-all ${agent.status === 'offline' ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
            style={{ ...glass, borderColor: agent.status === 'offline' ? 'rgba(60,74,65,0.2)' : `${agent.color}30` }}
          >
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <agent.icon size={20} style={{ color: agent.color }} className="group-hover:scale-110 transition-transform" />
                <span className="font-['Space_Grotesk'] text-lg font-semibold" style={{ color: agent.status === 'offline' ? '#71717a' : '#dde5dd' }}>{agent.name}</span>
              </div>
              <span className="w-3 h-3 rounded-full" style={{
                backgroundColor: agent.status === 'offline' ? '#3f3f46' : '#44e3a1',
                boxShadow: agent.status === 'offline' ? 'none' : '0 0 8px rgba(68,227,161,0.5)',
              }} />
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-zinc-500">{agent.status === 'offline' ? 'Status' : 'Task'}</span>
                <span className="text-zinc-300">{agent.task}</span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${agent.progress}%`, backgroundColor: agent.color }} />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] text-zinc-600 font-mono">VER: {agent.version}</span>
              <button className="text-xs font-bold hover:underline" style={{ color: agent.status === 'offline' ? '#71717a' : agent.color }}>
                {agent.status === 'offline' ? 'WAKE_UP' : 'MANAGE'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
